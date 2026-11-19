import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '@simplifypdf/database';
import { StorageService } from './storage.service';

@Injectable()
export class FileCleanupService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FileCleanupService.name);
  private timer: NodeJS.Timeout | null = null;

  constructor(private readonly storageService: StorageService) {}

  onModuleInit() {
    // Run cleanup check every 15 minutes
    this.timer = setInterval(() => this.shredExpiredFiles(), 15 * 60 * 1000);
    this.logger.log('FileCleanupService initialized. Scanning for expired files every 15 minutes.');
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  async shredExpiredFiles() {
    try {
      const now = new Date();
      const expiredJobs = await prisma.job.findMany({
        where: {
          expiresAt: { lt: now },
          status: { in: ['COMPLETED', 'FAILED', 'QUEUED'] },
        },
        take: 50,
      });

      if (expiredJobs.length === 0) return;

      this.logger.log(`Found ${expiredJobs.length} expired jobs to shred from S3.`);

      for (const job of expiredJobs) {
        if (job.sourceKey) {
          await this.storageService.deleteFile(job.sourceKey);
        }
        if (job.outputKey) {
          await this.storageService.deleteFile(job.outputKey);
        }

        // Remove or clear keys to prevent orphan accumulation
        await prisma.job.update({
          where: { id: job.id },
          data: {
            sourceKey: 'SHREDDED',
            outputKey: null,
            status: 'FAILED',
            errorReason: 'File expired and was permanently shredded per privacy policy.',
          },
        });
      }

      this.logger.log(`Shredded ${expiredJobs.length} expired files successfully.`);
    } catch (e) {
      this.logger.error('Error during scheduled file shredding:', e);
    }
  }
}
