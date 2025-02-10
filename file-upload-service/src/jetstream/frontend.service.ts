/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class FrontendService {
  private readonly logger = new Logger(FrontendService.name);
  private readonly sseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.sseUrl =
      this.configService.get<string>('SSE_BROADCAST_URL') ||
      'http://localhost:8081/broadcast';
  }

  public async broadcastMessage(message: Record<string, any>): Promise<void> {
    const data = JSON.stringify(message);
    this.logger.log('Broadcasting event: ' + data);

    try {
      const response = await axios.post(this.sseUrl, message, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.logger.log('Event broadcasted successfully: ' + response.status);
    } catch (error: any) {
      this.logger.error('Error broadcasting event:', error.message);
    }
  }
}
