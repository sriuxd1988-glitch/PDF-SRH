import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { FileCleanupService } from './cleanup.service';

@Module({
  controllers: [StorageController],
  providers: [StorageService, FileCleanupService],
  exports: [StorageService, FileCleanupService],
})
export class StorageModule {}
