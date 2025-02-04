import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { StorageModule } from './storage/storage.module';
import { UploadModule } from './upload/upload.module';
import { NatsModule } from './nats/nats.module';

@Module({
  imports: [AuthModule, DbModule, StorageModule, UploadModule, NatsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
