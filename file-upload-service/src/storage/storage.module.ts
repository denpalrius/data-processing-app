import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { MinioModule } from 'src/minio/minio.module';
import { FilemetadataModule } from 'src/filemetadata/filemetadata.module';
import { JetstreamModule } from 'src/jetstream/jetstream.module';

@Module({
  imports: [MinioModule, FilemetadataModule, JetstreamModule],
  providers: [StorageService],
  controllers: [StorageController],
  exports: [StorageService],
})
export class StorageModule {}
