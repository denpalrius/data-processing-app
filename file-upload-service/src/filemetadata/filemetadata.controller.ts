import { Controller, Post } from '@nestjs/common';
import { FilemetadataService } from './filemetadata.service';

@Controller('filemetadata')
export class FilemetadataController {
  constructor(private readonly filemetadataService: FilemetadataService) {}

  @Post()
  async getFiles() {
    return await this.filemetadataService.findAll();
  }
}
