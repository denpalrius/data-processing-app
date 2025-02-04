import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class UploadService {
  constructor(
    private storageService: StorageService,
    // private natsService: NatsService,
  ) {}


  // async handleUpload(file: Express.Multer.File) {
  //   await this.storageService.uploadFileToStaging(file.originalname, file.buffer);

  //   const savedFile = await this.fileRepo.save({
  //     filename: file.originalname,
  //     size: file.size,
  //     contentType: file.mimetype,
  //   });

  //   await this.natsService.publishFileUploadEvent(file.originalname);

  //   return { message: 'File uploaded successfully', file: savedFile };
  // }

  //   async handleUpload(file: Express.Multer.File) {
  //     await this.storageService.uploadFile('uploads', file.originalname, file.buffer);

  //     const savedFile = await this.fileRepo.save({
  //       filename: file.originalname,
  //       size: file.size,
  //       contentType: file.mimetype,
  //     });

  //     await this.natsService.publish(file.originalname);

  //     return { message: 'File uploaded successfully', file: savedFile };
  //   }
}
