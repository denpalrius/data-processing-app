import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FilemetadataService } from './filemetadata.service';
import { ApiOperation } from '@nestjs/swagger';
import { Delete } from '@nestjs/common';

@Controller('filemetadata')
export class FilemetadataController {
  constructor(private readonly filemetadataService: FilemetadataService) {}

  @MessagePattern('file.processing.*')
  handleFileProcessingComplete(data: Record<string, unknown>) {
    console.log('MessagePattern: File processing complete:', data);
  }

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
