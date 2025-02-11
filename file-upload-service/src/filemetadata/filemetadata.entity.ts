import { FileStatus } from '../storage/enums/file-status';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('file_metadata')
export class FileMetadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  size: number;

  @Column()
  contentType: string;

  @Column()
  bucketName: string;

  @Column()
  objectName: string;

  @Column()
  bucketUrl: string;

  @Column()
  status: FileStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
