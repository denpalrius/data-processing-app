/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { validators } from '../utils/file-validators';
import { StorageService } from './storage.service';
import { CreateUploadUrlDto } from 'src/utils/create-upload-url-dto';
import { PresignedUploadUrlResponse } from 'src/utils/presigned-response';
import { FileMetadata } from 'src/filemetadata/filemetadata.entity';
import { ApiOperation } from '@nestjs/swagger';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a single file' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: validators,
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.storageService.uploadFile(file);
  }

  @Post('presigned-url')
  @ApiOperation({ summary: 'Create a presigned URL for file upload' })
  async createPresignedUploadUrl(
    @Body() createUploadUrlDto: CreateUploadUrlDto,
  ): Promise<PresignedUploadUrlResponse> {
    return await this.storageService.createPresignedUploadUrl(
      createUploadUrlDto,
    );
  }

  @Post('complete-upload/:fileId')
  @ApiOperation({ summary: 'Complete the file upload' })
  async completeUpload(
    @Param('fileId') fileId: string,
    @Body('size') size: number,
  ): Promise<FileMetadata> {
    if (!size || size <= 0) {
      throw new BadRequestException('File size must be greater than zero');
    }
    return await this.storageService.completeUpload(fileId, size);
  }
}
