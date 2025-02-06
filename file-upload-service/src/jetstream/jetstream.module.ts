import { Global, Module } from '@nestjs/common';
import { JetStreamService } from './jetstream.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { JetstreamController } from './jetstream.controller';
import { FilemetadataModule } from 'src/filemetadata/filemetadata.module';
import { FrontendService } from './frontend.service';

@Global()
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
  providers: [JetStreamService, FrontendService],
  exports: [JetStreamService, FrontendService],
  controllers: [JetstreamController],
})
export class JetStreamModule {}
