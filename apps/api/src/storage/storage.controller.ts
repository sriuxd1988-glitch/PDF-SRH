import { Controller, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { StorageService } from './storage.service';

interface PresignedUploadDto {
  filename: string;
  sizeBytes: number;
  contentType: string;
}

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('presigned-upload')
  async getPresignedUpload(
    @Body() dto: PresignedUploadDto,
    @Headers('x-user-role') roleHeader?: string
  ) {
    if (!dto.filename || !dto.sizeBytes) {
      throw new BadRequestException('Filename and sizeBytes are required');
    }

    const role = roleHeader || 'GUEST';
    return this.storageService.createPresignedUploadUrl(
      dto.filename,
      dto.sizeBytes,
      dto.contentType,
      role
    );
  }
}
