import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FilemetadataService } from '../filemetadata/filemetadata.service';
import { FileStatus } from 'src/storage/enums/file-status';
import { FrontendService } from './frontend.service';

@Controller('jetstream')
export class JetstreamController {
  private readonly logger = new Logger(JetstreamController.name);

  constructor(
    private readonly fileMetadataService: FilemetadataService,
    private readonly frontendGateway: FrontendService,
  ) {}

  @MessagePattern('file.processing.*')
  async handleFileProcessingComplete(data: Record<string, unknown>) {
    const fileId = data['fileId'] as string;
    if (!fileId) {
      this.logger.error('File ID is missing in the message data');
      return;
    }

    try {
      await this.fileMetadataService.updateStatus(fileId, FileStatus.PROCESSED);
      this.logger.log(
        `File status updated to 'processed' for file ID: ${fileId}`,
      );

      this.frontendGateway.sendMessage({
        fileId: fileId,
        status: FileStatus.PROCESSED,
      });
    } catch (error) {
      this.logger.error(
        `Failed to update file status for file ID: ${fileId}`,
        error,
      );
    }
  }
}
