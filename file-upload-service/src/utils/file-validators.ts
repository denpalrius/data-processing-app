import { MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';

export const validators = [
  new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 1024 }), // 1GB
  new FileTypeValidator({
    fileType:
      /^(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|application\/vnd\.ms-powerpoint|application\/vnd\.openxmlformats-officedocument\.presentationml\.presentation|text\/csv|application\/sql|application\/xml|application\/json|text\/plain)$/,
  }),
];
