import { BadRequestException, Injectable } from '@nestjs/common';
import { MinioService } from 'src/minio/minio.service';
import { FileMetadata } from 'src/filemetadata/filemetadata.entity';
import { v4 } from 'uuid';
import { FilemetadataService } from 'src/filemetadata/filemetadata.service';
import { JetStreamService } from 'src/jetstream/jetstream.service';
import { FileStatus } from './enums/file-status';
import { PresignedUrlRequest } from './dtos/presigned-url-request';
import { PresignedUrlResponse } from './dtos/presigned-url-response';
import { ConfigService } from '@nestjs/config';
import * as csv from 'csv-parser';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'fast-csv';

@Injectable()
export class StorageService {
  private readonly natsSubject: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
    private readonly fileMetadataService: FilemetadataService,
    private readonly jetstreamService: JetStreamService,
  ) {
    this.natsSubject =
      this.configService.get<string>('NATS_STAGED_SUBJECT') ||
      'file.upload.completed';
  }

  async createPresignedUploadUrl(
    params: PresignedUrlRequest,
    expiryMinutes: number = 30,
  ): Promise<PresignedUrlResponse> {
    if (!params.filename || !params.contentType) {
      throw new BadRequestException('Filename and content type are required');
    }
    const fileId = v4();
    params.filename = this.toSnakeCase(params.filename);
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
      status: FileStatus.UPLOADING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.fileMetadataService.create(metadata);

    const presignedResponse: PresignedUrlResponse = {
      url,
      expires: expires,
      fileId,
      objectName,
      fields,
    };

    return presignedResponse;
  }

  async completeUpload(fileId: string): Promise<FileMetadata> {
    const metadata = await this.fileMetadataService.findOne(fileId);
    if (!metadata) {
      throw new BadRequestException(
        `File metadata not found for ID: ${fileId}`,
      );
    }

    // Update metadata and status
    const updatedMetadata: FileMetadata = {
      ...metadata,
      status: FileStatus.STAGED,
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

    // Publish event to JetStream
    await this.jetstreamService.publishEvent(
      this.natsSubject,
      updatedFileMetadata,
    );

    return updatedFileMetadata;
  }

  async getFilePreview(fileId: string, numRecords: number = 5): Promise<any> {
    // Fetch file metadata
    const metadata = await this.fileMetadataService.findOne(fileId);
    if (!metadata) {
      throw new BadRequestException('File not found');
    }

    // if(metadata.status !== FileStatus.PROCESSED) {
    //   throw new BadRequestException('File is not procesed yet');
    // }

    // Download the file from MinIO
    const localPath = path.join('/tmp', metadata.objectName);
    await this.minioService.downloadProcessedFile(
      metadata.objectName,
      localPath,
    );

    // Read and preview the file content
    let previewData;
    if (metadata.contentType === 'text/csv') {
      previewData = await this.previewCsvFile(localPath, numRecords);
    } else if (metadata.contentType.includes('excel')) {
      previewData = this.previewExcelFile(localPath, numRecords);
    } else {
      throw new BadRequestException('Unsupported file type for preview');
    }

    // Clean up the local file
    fs.unlinkSync(localPath);

    return previewData;
  }

  private async previewCsvFile(
    filePath: string,
    numRecords: number,
  ): Promise<any[]> {
    const results: any[] = [];
    const stream = fs.createReadStream(filePath).pipe(csv());

    return new Promise((resolve, reject) => {
      stream.on('data', (data) => {
        if (results.length < numRecords) {
          results.push(data);
        }
        if (results.length >= numRecords) {
          // Once we have enough records, stop reading the file
          stream.pause();
          stream.destroy();
        }
      });

      stream.on('close', () => resolve(results));
      stream.on('end', () => resolve(results));
      stream.on('error', (error) => reject(error));
    });
  }

  private previewExcelFile(filePath: string, numRecords: number): any[] {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    return jsonData.slice(0, numRecords);
  }

  toSnakeCase(str: string): string {
    return str
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`) // Convert camel case to snake case
      .replace(/-+/g, '_') // Replace hyphens with underscores
      .replace(/__+/g, '_') // Replace multiple underscores with a single underscore
      .replace(/^_+|_+$/g, ''); // Remove leading and trailing underscores
  }
}
