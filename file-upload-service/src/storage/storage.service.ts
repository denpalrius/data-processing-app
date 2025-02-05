import { BadRequestException, Injectable } from '@nestjs/common';
import { MinioService } from 'src/minio/minio.service';
import { FileMetadata } from 'src/filemetadata/filemetadata.entity';
import { v4 } from 'uuid';
import { FilemetadataService } from 'src/filemetadata/filemetadata.service';
import { CreateUploadUrlDto } from 'src/utils/create-upload-url-dto';
import { PresignedUploadUrlResponse } from 'src/utils/presigned-response';

@Injectable()
export class StorageService {
  constructor(
    private readonly minioService: MinioService,
    private readonly fileMetadataService: FilemetadataService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ message: string; data: any }> {
    const fileId = v4();
    const objectName = `${fileId}-${file.originalname}`;

    // Upload the file to MinIO
    const { bucketName, url } = await this.minioService.uploadFile(
      objectName,
      file.buffer,
      {
        'Content-Type': file.mimetype,
        'Original-Name': file.originalname,
        'File-Id': fileId,
      },
    );

    // Create metadata
    const metadata: FileMetadata = {
      id: fileId,
      filename: file.originalname,
      size: file.size,
      contentType: file.mimetype,
      bucketName: bucketName,
      objectName: objectName,
      bucketUrl: url,
      status: 'uploaded',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save metadata to the database
    const fileMetadata: FileMetadata =
      await this.fileMetadataService.create(metadata);

    console.log('File metadata saved:', fileMetadata);

    return { message: 'File uploaded successfully', data: { metadata } };
  }

  async createPresignedUploadUrl(
    params: CreateUploadUrlDto,
    expiryMinutes: number = 30,
  ): Promise<PresignedUploadUrlResponse> {
    if (!params.filename || !params.contentType) {
      throw new BadRequestException('Filename and content type are required');
    }

    const fileId = v4();
    const objectName = `${fileId}-${params.filename}`;

    // Generate presigned PUT URL
    const { url, expires, fields } =
      await this.minioService.generatePresignedUploadUrl(
        objectName,
        expiryMinutes * 60, // Convert to seconds
        {
          'Content-Type': params.contentType,
          'Original-Name': params.filename,
          'File-Id': fileId,
        },
      );

    // Pre-create metadata record with 'pending' status
    const metadata: FileMetadata = {
      id: fileId,
      filename: params.filename,
      size: params.size || 0,
      contentType: params.contentType,
      bucketName: this.minioService.getStagingBucketName(),
      objectName: objectName,
      bucketUrl: url,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.fileMetadataService.create(metadata);

    const presignedResponse: PresignedUploadUrlResponse = {
      url,
      expires: expires,
      fileId,
      objectName,
      fields,
    };

    return presignedResponse;
  }

  async completeUpload(fileId: string, size: number): Promise<FileMetadata> {
    const metadata = await this.fileMetadataService.findOne(fileId);
    if (!metadata) {
      throw new BadRequestException(
        `File metadata not found for ID: ${fileId}`,
      );
    }

    // Update metadata with final size and status
    const updatedMetadata: FileMetadata = {
      ...metadata,
      size,
      status: 'uploaded',
      updatedAt: new Date(),
    };

    const updatedFileMetadata = await this.fileMetadataService.update(
      fileId,
      updatedMetadata,
    );
    if (!updatedFileMetadata) {
      throw new BadRequestException(
        `Failed to update metadata for file ID: ${fileId}`,
      );
    }
    return updatedFileMetadata;
  }
}
