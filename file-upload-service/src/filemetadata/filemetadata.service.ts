import { Injectable } from '@nestjs/common';
import { FileMetadata } from './filemetadata.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileStatus } from 'src/storage/enums/file-status';

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

  async updateStatus(
    id: string,
    status: FileStatus,
  ): Promise<FileMetadata | null> {
    await this.fileMetadataRepository.update(id, { status });
    return await this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.fileMetadataRepository.delete(id);
    return { message: 'File metadata deleted' };
  }

  async removeAll(): Promise<{ message: string }> {
    await this.fileMetadataRepository.clear();
    return { message: 'All files metadata cleared' };
  }
}
