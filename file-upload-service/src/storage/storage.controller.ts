/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { validators } from '../utils/file-validators';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
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
}
