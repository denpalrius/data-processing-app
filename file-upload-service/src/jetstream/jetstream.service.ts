import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import {
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

  constructor(
    @Inject('NATS_CLIENT') private readonly client: ClientProxy,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const connection = await this.client.connect();
      this.nc = connection as unknown as NatsConnection;
      this.js = this.nc.jetstream();
      this.jsm = await this.nc.jetstreamManager();
      this.logger.log('Connected to NATS JetStream');

      await this.createStreams();
    } catch (error) {
      this.logger.error('Failed to initialize NATS connection:', error);
      throw error;
    }
  }

  private async createStreams() {
    const streams = [
      {
        name: 'FILE_UPLOADS',
        subjects: ['file.upload.*'],
      },
      {
        name: 'FILE_PROCESSING',
        subjects: ['file.processing.*'],
      },
    ];

    for (const stream of streams) {
      try {
        await this.jsm.streams.info(stream.name);
        this.logger.log(
          `JetStream ${stream.name} stream already exists, skipping creation`,
        );
      } catch (error) {
        if ((error as Error).message.includes('stream not found')) {
          await this.jsm.streams.add(stream);
          this.logger.log(
            `JetStream ${stream.name} stream created successfully`,
          );
        } else {
          this.logger.error(
            `Error checking ${stream.name} stream:`,
            error.stack,
          );
          throw error;
        }
      }
    }
  }

  async publishEvent(subject: string, data: Record<string, any>) {
    try {
      const msg = this.jc.encode(data);
      await this.js.publish(subject, msg);
      this.logger.log(`Published event: ${subject}; fileId: ${data.id};`);
    } catch (error) {
      this.logger.error(`Error publishing to ${subject}:`, error?.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.client.close();
    this.logger.log('Disconnected from NATS JetStream');
  }
}
