import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  connect,
  NatsConnection,
  JetStreamClient,
  JetStreamManager,
  JSONCodec,
  AckPolicy,
  ConsumerConfig,
  consumerOpts,
} from 'nats';

@Injectable()
export class JetStreamService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(JetStreamService.name);
  private nc: NatsConnection;
  private js: JetStreamClient;
  private jsm: JetStreamManager;

  private readonly jc = JSONCodec();

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const natsServers = this.configService.get<string>('NATS_SERVERS');
    this.nc = await connect({ servers: natsServers });
    this.js = this.nc.jetstream();
    this.jsm = await this.nc.jetstreamManager();
    this.logger.log('Connected to NATS JetStream');

    await this.createStreams();
    // await this.subscribeToFileProcessingComplete();
  }

  async createStreams() {
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
      const pub = await this.js.publish(subject, msg);

      this.logger.log(`Published event: ${subject}; fileId; ${data.id};`);

      return pub;
    } catch (error) {
      this.logger.error(`Error publishing to ${subject}:`, error?.stack);
      throw error;
    }
  }

  async subscribeToFileProcessingComplete() {
    const subject = 'file.processing.complete';
    try {
      console.log('subscribing to file.processing.complete');

      // const consumerConfig: Partial<ConsumerConfig> = {
      //   durable_name: 'file-processing-complete-consumer',
      //   ack_policy: AckPolicy.Explicit,
      // };

      // await this.jsm.consumers.add('FILE_PROCESSING', consumerConfig);

      const opts = consumerOpts();
      opts.durable('file-processing-complete-consumer');
      opts.ackExplicit();
      opts.deliverTo('file-processing-complete-consumer');

      const sub = await this.js.subscribe(subject, opts);

      this.logger.log(`Subscribed to ${subject}`);

      // for await (const msg of sub) {
        // const data = this.jc.decode(msg.data);
        // this.logger.log(
        //   `Received message on ${subject}: ${JSON.stringify(data)}`,
        // );
        // Process the message here
        // Acknowledge the message
        // await msg.ack();
      // }
    } catch (error) {
      this.logger.error(`Failed to subscribe to ${subject}:`, error.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.nc?.drain();
    this.logger.log('Disconnected from NATS JetStream');
  }
}
