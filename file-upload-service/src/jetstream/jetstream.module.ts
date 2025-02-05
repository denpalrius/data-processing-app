import { Module } from '@nestjs/common';
import { JetStreamService } from './jetstream.service';
@Module({
  providers: [JetStreamService],
  exports: [JetStreamService],
})
export class JetstreamModule {}
