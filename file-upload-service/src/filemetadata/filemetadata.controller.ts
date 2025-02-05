import { Controller, Get } from '@nestjs/common';
import { FilemetadataService } from './filemetadata.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('filemetadata')
export class FilemetadataController {
  constructor(private readonly filemetadataService: FilemetadataService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all files metadata' })
  async getFiles() {
    return await this.filemetadataService.findAll();
  }
}
