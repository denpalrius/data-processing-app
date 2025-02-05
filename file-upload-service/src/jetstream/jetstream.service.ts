import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import {
  connect,
  NatsConnection,
  JetStreamClient,
  JetStreamManager,
  JSONCodec,
} from 'nats';

@Injectable()
export class JetStreamService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(JetStreamService.name);
  private nc: NatsConnection;
  private js: JetStreamClient;
  private jsm: JetStreamManager;

  private readonly jc = JSONCodec();
  private readonly fileUploadCompleteEvent: string = 'file.upload.completed';

  async onModuleInit() {
    this.nc = await connect({ servers: 'nats://localhost:4222' });
    this.js = this.nc.jetstream();
    this.jsm = await this.nc.jetstreamManager();
    this.logger.log('Connected to NATS JetStream');
    await this.createStream();
  }

  async createStream() {
    try {
      await this.jsm.streams.add({
        name: 'FILE_UPLOADS',
        subjects: ['file.upload.*'],
      });
      this.logger.log('JetStream FILE_UPLOADS stream created successfully');
    } catch (error) {
      if ((error as Error).message.includes('stream name already in use')) {
        this.logger.log(
          'JetStream FILE_UPLOADS stream already exists, skipping creation',
        );
      } else {
        this.logger.error('Error creating JetStream stream:', error.stack);
        throw error;
      }
    }
  }

  async publishEvent(subject: string, data: Record<string, any>) {
    try {
      const msg = this.jc.encode(data);
      const pub = await this.js.publish(subject, msg);
      this.logger.log(`Published event: ${subject}; fileId; ${data.id};`);

      return pub;
    } catch (error) {
      this.logger.error(`Error publishing to ${subject}:`, error?.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.nc?.drain();
    this.logger.log('Disconnected from NATS JetStream');
  }
}
