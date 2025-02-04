import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  // constructor() {
  //   this.filename = ''; // Default value for filename
  //   this.size = 0; // Default value for size
  //   this.contentType = ''; // Default value for contentType
  // }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  size: number;

  @Column()
  contentType: string;
}
