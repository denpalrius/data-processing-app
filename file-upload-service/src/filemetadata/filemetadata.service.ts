import { Injectable } from '@nestjs/common';
import { FileMetadata } from './models/filemetadata.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FilemetadataService {
  constructor(
    @InjectRepository(FileMetadata)
    private fileMetadataRepository: Repository<FileMetadata>,
  ) {}

  async findAll(): Promise<FileMetadata[]> {
    return this.fileMetadataRepository.find();
  }

  async findOne(id: string): Promise<FileMetadata | null> {
    return this.fileMetadataRepository.findOneBy({ id });
  }

  async create(fileMetadata: FileMetadata): Promise<FileMetadata> {
    return this.fileMetadataRepository.save(fileMetadata);
  }

  async update(
    id: string,
    fileMetadata: FileMetadata,
  ): Promise<FileMetadata | null> {
    await this.fileMetadataRepository.update(id, fileMetadata);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.fileMetadataRepository.delete(id);
  }
}
