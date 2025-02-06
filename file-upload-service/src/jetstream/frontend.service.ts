import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, StompConfig } from '@stomp/stompjs';

@Injectable()
export class FrontendService implements OnModuleDestroy {
  private readonly logger = new Logger(FrontendService.name);
  private client: Client;

  constructor(private readonly configService: ConfigService) {
    const websocketUrl = this.configService.get<string>(
      'WEBSOCKET_URL',
      'ws://localhost:8080/ws',
    );

    if (!websocketUrl) {
      this.logger.error('WEBSOCKET_URL is not defined');
      return;
    }

    this.logger.log(`Connecting to WebSocket server at: ${websocketUrl}`);

    const stompConfig: StompConfig = {
      brokerURL: websocketUrl,
      connectHeaders: {},
      debug: (str) => {
        this.logger.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    };

    this.client = new Client(stompConfig);

    this.client.onConnect = (frame) => {
      this.logger.log('Connected to WebSocket server');
      this.sendMessage({ type: 'fileProcessed', data: 'test' });
    };

    this.client.onStompError = (frame) => {
      this.logger.error(`Broker reported error: ${frame.headers['message']}`);
      this.logger.error(`Additional details: ${frame.body}`);
    };

    this.client.onWebSocketClose = (evt) => {
      this.logger.log('Disconnected from WebSocket server');
    };

    this.client.activate();
  }

  sendMessage(message: Record<string, any>) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: '/topic/messages',
        body: JSON.stringify(message),
      });
      this.logger.log(`Message sent: ${JSON.stringify(message)}`);
    } else {
      this.logger.error('WebSocket is not connected. Unable to send message.');
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.deactivate();
      this.logger.log('Disconnected from WebSocket server');
    }
  }
}
