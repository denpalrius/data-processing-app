import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioService } from './minio.service';
import minioConfig from './minio.config';
import { MinioConnectionProvider } from './minio-client.provider';

@Module({
  imports: [ConfigModule.forFeature(minioConfig)],
  providers: [MinioConnectionProvider, MinioService],
  exports: [MinioService],
})
export class MinioModule {}
