import { Module } from '@nestjs/common';
import { NatsService } from './nats.service';

@Module({
  providers: [NatsService],
})
export class NatsModule {}
