import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { Client, PostPolicy } from 'minio';
import { MINIO_CONNECTION } from './minio-client.provider';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private readonly stagingBucket: string;
  private readonly processedBucket: string;

  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: Client,
    private readonly configService: ConfigService,
  ) {
    this.stagingBucket =
      this.configService.get<string>('MINIO_STAGING_BUCKET') || 'staging';
    this.processedBucket =
      this.configService.get<string>('MINIO_PROCESSED_BUCKET') || 'processed';
  }

  async onModuleInit() {
    await this.createBucket(this.stagingBucket);
    await this.createBucket(this.processedBucket);
  }

  getStagingBucketName(): string {
    return this.stagingBucket;
  }

  async generatePresignedUploadUrl(
    objectName: string,
    expirySeconds: number,
    metadata?: Record<string, string>,
  ) {
    try {
      const minFilesize: number = 0;
      const maxFileSize: number = 1000 * 1024 * 1024;

      const policy = new PostPolicy();
      policy.setKey(objectName);
      policy.setBucket(this.stagingBucket);
      policy.setExpires(new Date(Date.now() + expirySeconds * 1000));
      policy.setContentLengthRange(minFilesize, maxFileSize);

      if (metadata) {
        policy.setUserMetaData(metadata);
      }

      const data = await this.minioClient.presignedPostPolicy(policy);

      return {
        url: data.postURL,
        expires: policy.policy.expiration
          ? new Date(policy.policy.expiration)
          : undefined,
        fields: data.formData,
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate presigned upload URL for ${objectName}:`,
        error,
      );
      throw new Error(
        `Presigned URL generation failed: ${(error as Error).message}`,
      );
    }
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
