import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileMetadata } from './models/filemetadata.entity';
import { FilemetadataService } from './filemetadata.service';
import { FilemetadataController } from './filemetadata.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FileMetadata])],
  providers: [FilemetadataService],
  exports: [FilemetadataService],
  controllers: [FilemetadataController],
})
export class FilemetadataModule {}
