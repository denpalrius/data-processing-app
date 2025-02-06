import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { StorageModule } from './storage/storage.module';
import { FileMetadata } from './filemetadata/filemetadata.entity';
import { MinioModule } from './minio/minio.module';
import { FilemetadataModule } from './filemetadata/filemetadata.module';
import { JetStreamModule } from './jetstream/jetstream.module';
import minioConfig from './minio/minio.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [minioConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_URL,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [FileMetadata],
      synchronize: true,
    }),
    StorageModule,
    MinioModule,
    FilemetadataModule,
    JetStreamModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  constructor() {}
}
