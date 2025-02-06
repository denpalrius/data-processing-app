import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ApiOperation } from '@nestjs/swagger';
import { FileTypeValidationPipe } from './validation/file-type-validation-pipe';
import { PresignedUrlRequest } from './dtos/presigned-url-request';
import { PresignedUrlResponse } from './dtos/presigned-url-response';
import { FileMetadata } from 'src/filemetadata/filemetadata.entity';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @ApiOperation({ summary: 'Create a presigned URL for file upload' })
  @Post('presigned-url')
  @UsePipes(FileTypeValidationPipe)
  async createPresignedUploadUrl(
    @Body() createUploadUrlDto: PresignedUrlRequest,
  ): Promise<PresignedUrlResponse> {
    return await this.storageService.createPresignedUploadUrl(
      createUploadUrlDto,
    );
  }

  @Post('complete-upload')
  @ApiOperation({ summary: 'Complete the file upload' })
  async completeUpload(@Query('fileId') fileId: string): Promise<FileMetadata> {
    return await this.storageService.completeUpload(fileId);
  }

  @Get('preview')
  @ApiOperation({ summary: 'Preview the file content' })
  async getFilePreview(
    @Query('fileId') fileId: string,
    @Query('numRecords') numRecords: number = 10,
  ): Promise<any> {
    return await this.storageService.getFilePreview(fileId, numRecords);
  }
}
