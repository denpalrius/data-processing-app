import { Injectable } from '@nestjs/common';
import { MinioService } from 'src/minio/minio.service';
import { FileMetadata } from 'src/filemetadata/models/filemetadata.entity';
import { v4 } from 'uuid';
import { FilemetadataService } from 'src/filemetadata/filemetadata.service';

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

    console.log('File metadata:', metadata);

    // Save metadata to the database
    const fileMetadata: FileMetadata =
      await this.fileMetadataService.create(metadata);

    console.log('File metadata saved:', fileMetadata);

    return { message: 'File uploaded successfully', data: { url, metadata } };
  }
}
