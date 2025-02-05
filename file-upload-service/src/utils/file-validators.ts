import { MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';

export const validators = [
  new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 1024 }), // 1GB
  new FileTypeValidator({
    fileType:
      /^(text\/csv|application\/sql|application\/json|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/,
  }),
];
