import { Controller } from '@nestjs/common';

@Controller('uploads')
export class UploadController {
  // constructor(private readonly uploadService: UploadService) {}
  // @Get()
  // async getFiles() {
  //   return await this.uploadService.getAllFiles();
  // }
  //   @Post('/presigned-url')
  //   @UseGuards(AuthGuard)
  //   getPresignedUrl(@Body('filename') filename: string) {
  //     return { url: `https://minio.local/${filename}` };
  //   }
  //   @Post()
  //   @UseGuards(AuthGuard)
  //   @UseInterceptors(FileInterceptor('file'))
  //   async uploadFile(@UploadedFile() file: Express.Multer.File) {
  //     return this.uploadService.handleUpload(file);
  //   }
}
