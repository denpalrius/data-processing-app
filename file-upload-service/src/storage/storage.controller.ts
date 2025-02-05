import { Body, Controller, Post, Query } from '@nestjs/common';
import { StorageService } from './storage.service';
import { CreateUploadUrlDto } from 'src/utils/create-upload-url-dto';
import { PresignedUploadUrlResponse } from 'src/utils/presigned-response';
import { FileMetadata } from 'src/filemetadata/filemetadata.entity';
import { ApiOperation } from '@nestjs/swagger';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('presigned-url')
  @ApiOperation({ summary: 'Create a presigned URL for file upload' })
  async createPresignedUploadUrl(
    @Body() createUploadUrlDto: CreateUploadUrlDto,
  ): Promise<PresignedUploadUrlResponse> {
    return await this.storageService.createPresignedUploadUrl(
      createUploadUrlDto,
    );
  }

  @Post('complete-upload')
  @ApiOperation({ summary: 'Complete the file upload' })
  async completeUpload(@Query('fileId') fileId: string): Promise<FileMetadata> {
    return await this.storageService.completeUpload(fileId);
  }
}
