import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FrontendService implements OnModuleDestroy {
  private readonly logger = new Logger(FrontendService.name);
  private socket: WebSocket | null = null;

  constructor(private readonly configService: ConfigService) {
    const websocketUrl = this.configService.get<string>('WEBSOCKET_URL');

    if (!websocketUrl) {
      this.logger.error('WEBSOCKET_URL is not defined');
      return;
    }

    this.logger.log(`Connecting to WebSocket server at: ${websocketUrl}`);
    // this.socket = new WebSocket(websocketUrl);
    this.socket = new WebSocket("http://localhost:8080/ws");

    this.socket.onopen = () => {
      this.logger.log('Connected to WebSocket server');
      this.sendMessage({ type: 'fileProcessed', data: 'test' });
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.logger.log(`Received message: ${JSON.stringify(data)}`);
    };

    this.socket.onerror = (error) => {
      this.logger.error(`WebSocket error: ${JSON.stringify(error)}`);
    };

    this.socket.onclose = () => {
      this.logger.log('Disconnected from WebSocket server');
    };

    this.sendMessage({ type: 'fileProcessed', data: 'test' });
  }

  sendMessage(message: Record<string, any>) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      this.logger.error('WebSocket is not open. Unable to send message.');
    }
  }

  onModuleDestroy() {
    if (this.socket) {
      this.socket.close();
      this.logger.log('Disconnected from WebSocket server');
    }
  }
}
