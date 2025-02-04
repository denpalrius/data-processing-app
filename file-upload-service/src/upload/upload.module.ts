import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './models/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [TypeOrmModule],
})
export class UploadModule {}
