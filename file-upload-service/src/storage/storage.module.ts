import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { MinioModule } from 'src/minio/minio.module';
import { FilemetadataModule } from 'src/filemetadata/filemetadata.module';

@Module({
  imports: [MinioModule, FilemetadataModule],
  providers: [StorageService],
  controllers: [StorageController],
  exports: [StorageService],
})
export class StorageModule {}
