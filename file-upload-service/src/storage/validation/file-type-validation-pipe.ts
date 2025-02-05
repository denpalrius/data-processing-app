import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { PresignedUrlRequest } from 'src/storage/dtos/presigned-url-request';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private readonly allowedFileTypes = [
    'text/csv',
    'application/sql',
    'application/json',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  transform(value: PresignedUrlRequest) {
    const { contentType } = value;

    if (!this.allowedFileTypes.includes(contentType)) {
      throw new BadRequestException(`File type ${contentType} is not allowed`);
    }

    return value;
  }
}
