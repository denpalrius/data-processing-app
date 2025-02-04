import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './models/file.entity';
// import { StorageService } from '../storage/storage.service';
// import { NatsService } from '../nats/nats.service';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(File) private fileRepo: Repository<File>,
    // private storageService: StorageService,
    // private natsService: NatsService,
  ) {}

  async getAllFiles(): Promise<File[]> {
    await this.fileRepo.save({
      filename: 'test' + Date.now() + '.txt',
      size: 1234,
      contentType: 'text/plain',
    });

    return await this.fileRepo.find();
  }

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
