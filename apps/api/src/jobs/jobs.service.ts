import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { prisma, ToolType, JobStatus } from '@simplifypdf/database';
import { RedisService } from '../redis/redis.service';
import { StorageService } from '../storage/storage.service';
import { Observable, Subject } from 'rxjs';

export interface CreateJobDto {
  toolType: ToolType;
  sourceKey: string;
  sourceFilename: string;
  sourceSizeBytes: number;
  options?: Record<string, any>;
  userId?: string;
  userRole?: string;
}

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly redis: RedisService,
    private readonly storage: StorageService
  ) {}

  async createJob(dto: CreateJobDto, ipHash?: string) {
    const isPro = dto.userRole === 'PRO' || dto.userRole === 'ADMIN' || dto.userRole === 'SUPER_ADMIN';
    const retentionHours = isPro ? 24 : 2;
    const expiresAt = new Date(Date.now() + retentionHours * 60 * 60 * 1000);

    const job = await prisma.job.create({
      data: {
        toolType: dto.toolType,
        sourceKey: dto.sourceKey,
        sourceFilename: dto.sourceFilename,
        sourceSizeBytes: BigInt(dto.sourceSizeBytes || 0),
        status: JobStatus.QUEUED,
        expiresAt,
        userId: dto.userId || null,
        guestIpHash: ipHash || null,
      },
    });

    // Enqueue to Redis Stream for Python worker consumption
    await this.redis.pushJobStream('stream:pdf-jobs', {
      jobId: job.id,
      toolType: job.toolType,
      sourceKey: job.sourceKey,
      sourceFilename: job.sourceFilename,
      optionsJson: JSON.stringify(dto.options || {}),
      userRole: dto.userRole || 'GUEST',
    });

    this.logger.log(`Job ${job.id} enqueued to stream:pdf-jobs for ${job.toolType}`);

    return {
      jobId: job.id,
      status: job.status,
      expiresAt: job.expiresAt,
    };
  }

  async getJob(id: string) {
    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) throw new NotFoundException(`Job with ID ${id} not found`);

    let downloadUrl: string | null = null;
    if (job.status === JobStatus.COMPLETED && job.outputKey) {
      downloadUrl = await this.storage.createPresignedDownloadUrl(
        job.outputKey,
        job.outputFilename || `processed_${job.sourceFilename}`
      );
    }

    return {
      ...job,
      sourceSizeBytes: Number(job.sourceSizeBytes),
      outputSizeBytes: job.outputSizeBytes ? Number(job.outputSizeBytes) : null,
      downloadUrl,
    };
  }

  // SSE Progress Stream
  getProgressStream(jobId: string): Observable<{ data: any }> {
    const subject = new Subject<{ data: any }>();
    const sub = this.redis.getSubscriber();
    const channel = `job:status:${jobId}`;

    // Emit initial status
    this.getJob(jobId)
      .then((job) => {
        subject.next({
          data: {
            jobId: job.id,
            status: job.status,
            progress: job.status === 'COMPLETED' ? 100 : 10,
            downloadUrl: job.downloadUrl,
          },
        });
      })
      .catch((err) => subject.error(err));

    const onMessage = (chan: string, msg: string) => {
      if (chan === channel) {
        try {
          const parsed = JSON.parse(msg);
          subject.next({ data: parsed });
          if (parsed.status === 'COMPLETED' || parsed.status === 'FAILED') {
            sub.unsubscribe(channel);
            subject.complete();
          }
        } catch (e) {
          this.logger.error('Failed to parse SSE message', e);
        }
      }
    };

    sub.subscribe(channel);
    sub.on('message', onMessage);

    return subject.asObservable();
  }
}
