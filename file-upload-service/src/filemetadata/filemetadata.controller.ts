import { Controller, Get } from '@nestjs/common';
import { FilemetadataService } from './filemetadata.service';
import { ApiOperation } from '@nestjs/swagger';
import { Delete } from '@nestjs/common';

@Controller('filemetadata')
export class FilemetadataController {
  constructor(private readonly filemetadataService: FilemetadataService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all files metadata' })
  async getFiles() {
    return await this.filemetadataService.findAll();
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear all files metadata' })
  async clearFiles() {
    return await this.filemetadataService.removeAll();
  }
}
