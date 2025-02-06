import { Module } from '@nestjs/common';
import { JetStreamService } from './jetstream.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { JetstreamController } from './jetstream.controller';
import { FilemetadataModule } from 'src/filemetadata/filemetadata.module';

@Module({
  imports: [
    FilemetadataModule,
    ClientsModule.register([
      {
        name: 'NATS_CLIENT',
        transport: Transport.NATS,
        options: {
          servers: [
            new ConfigService().get<string>(
              'NATS_URL',
              'nats://localhost:4222',
            ),
          ],
        },
      },
    ]),
  ],
  providers: [JetStreamService],
  exports: [JetStreamService],
  controllers: [JetstreamController],
})
export class JetStreamModule {}
