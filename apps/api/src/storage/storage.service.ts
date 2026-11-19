import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
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

  /**
   * Generates a 15-minute presigned PUT URL for direct client browser-to-S3 uploads.
   * Enforces file size limits per tier:
   * - Guest: 25 MB
   * - Free Member: 50 MB
   * - Pro / Admin: 2048 MB (2 GB)
   */
  async createPresignedUploadUrl(
    filename: string,
    fileSizeBytes: number,
    contentType: string = 'application/pdf',
    userRole: string = 'GUEST'
  ) {
    let maxAllowedBytes = 25 * 1024 * 1024; // Default Guest: 25MB
    let tierName = 'Guest (25MB)';

    if (userRole === 'PRO' || userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      maxAllowedBytes = 2048 * 1024 * 1024; // 2GB
      tierName = 'PRO (2GB)';
    } else if (userRole === 'USER') {
      maxAllowedBytes = 50 * 1024 * 1024; // 50MB
      tierName = 'Free Member (50MB)';
    }

    if (fileSizeBytes > maxAllowedBytes) {
      throw new BadRequestException(
        `File size (${(fileSizeBytes / 1024 / 1024).toFixed(1)}MB) exceeds limit for ${tierName}. Upgrade to PRO for up to 2GB files.`
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

    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 900 });

    this.logger.log(`Generated presigned PUT for key: ${key} (${fileSizeBytes} bytes, role: ${userRole})`);

    return {
      uploadUrl,
      fileKey: key,
      fileId,
      expiresInSeconds: 900,
    };
  }

  /**
   * Generates a presigned GET download URL with attachment header.
   */
  async createPresignedDownloadUrl(fileKey: string, downloadFilename: string, expiresIn: number = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      ResponseContentDisposition: `attachment; filename="${downloadFilename}"`,
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }

  /**
   * Permanently deletes an object from S3.
   */
  async deleteFile(fileKey: string) {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: fileKey,
        })
      );
      this.logger.log(`Deleted S3 object: ${fileKey}`);
    } catch (e) {
      this.logger.warn(`Failed to delete S3 object ${fileKey}: ${e}`);
    }
  }
}
