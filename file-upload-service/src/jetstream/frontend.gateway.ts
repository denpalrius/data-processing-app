import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

@WebSocketGateway(8083, { transports: ['websocket'] })
export class FrontendGateway {
  private readonly logger = new Logger(FrontendGateway.name);
  private static isInitialized = false; // Ensure the gateway is only initialized once

  constructor() {
    if (FrontendGateway.isInitialized) {
      this.logger.error('FrontendGateway has already been initialized');
    }
    FrontendGateway.isInitialized = true;
  }

  // Emit a message to the connected clients
  @SubscribeMessage('fileProcessed')
  handleFileProcessed(
    @MessageBody() data: { fileId: string; status: string },
  ): WsResponse<any> {
    this.logger.log(
      `File processed: ${data.fileId} with status: ${data.status}`,
    );
    return { event: 'fileProcessed', data };
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
