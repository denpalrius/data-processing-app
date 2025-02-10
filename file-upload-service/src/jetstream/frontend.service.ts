import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebSocketGateway } from '@nestjs/websockets';
import * as WebSocket from 'ws';

@WebSocketGateway()
@Injectable()
export class FrontendService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FrontendService.name);
  private ws: WebSocket;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const websocketUrl = this.configService.get<string>(
      'WEBSOCKET_URL',
      'ws://localhost:8080/ws',
    );

    if (!websocketUrl) {
      this.logger.error('WEBSOCKET_URL is not defined');
      return;
    }

    this.logger.log(`Connecting to WebSocket server at: ${websocketUrl}...`);

    this.connectToServer(websocketUrl);
  }

  private connectToServer(websocketUrl: string) {
    this.ws = new WebSocket(websocketUrl);

    this.ws.on('open', () => {
      this.logger.log('Connected to WebSocket server');
    });

    this.ws.on('message', (data: WebSocket.Data) => {
      try {
        console.log('Message received:', data);

        const message = JSON.parse(data.toString());
        this.receiveMessage(message);
      } catch (error) {
        this.logger.error(`Error processing message: ${error.message}`);
      }
    });

    this.ws.on('close', () => {
      this.logger.warn('WebSocket connection closed. Attempting reconnect...');
      setTimeout(() => this.connectToServer(websocketUrl), 5000);
    });

    this.ws.on('error', (error) => {
      this.logger.error(`WebSocket error: ${error.message}`);
    });
  }

  private receiveMessage(message: any) {
    // We're just logging the message for now
    this.logger.log(`Received message: ${JSON.stringify(message)}`);
  }

  public sendMessage(message: Record<string, any>, retries = 3): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify(message));
          this.logger.log(`Message sent: ${JSON.stringify(message)}`);
          resolve();
        } catch (error) {
          this.logger.error(`Error sending message: ${error.message}`);
          reject(error);
        }
      } else if (retries > 0) {
        this.logger.warn('WebSocket is not connected. Retrying in 1s...');
        setTimeout(() => {
          this.sendMessage(message, retries - 1)
            .then(resolve)
            .catch(reject);
        }, 1000);
      } else {
        const error = new Error(
          'WebSocket is not connected. Unable to send message.',
        );
        this.logger.error(error.message);
        reject(error);
      }
    });
  }

  async onModuleDestroy() {
    if (this.ws) {
      this.ws.close();
      this.logger.log('Disconnected from WebSocket server');
    }
  }
}
