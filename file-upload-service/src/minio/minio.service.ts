import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import { MINIO_CONNECTION } from './minio-client.provider';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  stagingBucket: string;
  processedBucket: string;

  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: Client,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.stagingBucket =
      this.configService.get<string>('MINIO_STAGING_BUCKET') || 'staging';
    this.processedBucket =
      this.configService.get<string>('MINIO_PROCESSED_BUCKET') || 'processed';

    await this.createBucket(this.stagingBucket);
    await this.createBucket(this.processedBucket);
  }

  async createBucket(bucketName: string): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(bucketName);
        this.logger.log(`Bucket ${bucketName} created successfully.`);
      } else {
        this.logger.log(`Bucket ${bucketName} already exists.`);
      }
    } catch (error: any) {
      this.logger.error(`Failed to create bucket ${bucketName}:`, error);
      throw new Error(`Bucket creation failed: ${(error as Error).message}`);
    }
  }

  async uploadFile(
    objectName: string,
    buffer: Buffer,
    metaData?: { [key: string]: string },
  ): Promise<{ bucketName: string; url: string }> {
    try {
      const bucketName = this.stagingBucket;

      await this.minioClient.putObject(
        bucketName,
        objectName,
        buffer,
        Number(metaData?.size),
        metaData,
      );

      const url = await this.minioClient.presignedGetObject(
        bucketName,
        objectName,
        24 * 60 * 60,
      );
      return { bucketName, url };
    } catch (error) {
      this.logger.error(`Failed to upload file ${objectName}:`, error);
      throw new Error(`File upload failed: ${(error as Error).message}`);
    }
  }
}
