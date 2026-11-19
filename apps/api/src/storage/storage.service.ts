import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET_NAME || 'simplifypdf-files';
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
      },
    });
  }

  // Generate Presigned PUT URL for direct browser-to-S3 upload
  async createPresignedUploadUrl(
    filename: string,
    fileSizeBytes: number,
    contentType: string,
    userRole: string = 'GUEST'
  ) {
    const isPro = userRole === 'PRO' || userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';
    const maxAllowedBytes = isPro ? 2 * 1024 * 1024 * 1024 : 50 * 1024 * 1024; // 2GB vs 50MB

    if (fileSizeBytes > maxAllowedBytes) {
      throw new BadRequestException(
        `File exceeds maximum permitted size of ${isPro ? '2GB' : '50MB'}. Upgrade to Pro for 2GB file processing.`
      );
    }

    const fileId = randomUUID();
    const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `uploads/${fileId}/${sanitizedName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType || 'application/pdf',
      Metadata: {
        originalName: sanitizedName,
        userRole: userRole,
      },
    });

    // 15-minute presigned upload window
    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 900 });

    this.logger.log(`Created presigned upload URL for key: ${key} (${fileSizeBytes} bytes)`);

    return {
      uploadUrl,
      fileKey: key,
      fileId,
      expiresInSeconds: 900,
    };
  }

  // Generate Presigned GET download URL with attachment disposition
  async createPresignedDownloadUrl(fileKey: string, downloadFilename: string, expiresIn: number = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      ResponseContentDisposition: `attachment; filename="${downloadFilename}"`,
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }
}
