import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { UploadModule } from './upload/upload.module';
import { NatsModule } from './nats/nats.module';
import { File } from './upload/models/file.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_URL,
      port: process.env.DATABASE_PORT ? +process.env.DATABASE_PORT : 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [File],
      synchronize: true,
    }),
    AuthModule,
    StorageModule,
    UploadModule,
    NatsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
