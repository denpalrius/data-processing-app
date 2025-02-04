// src/minio/minio-client.provider.ts
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

export const MINIO_CONNECTION = 'MINIO_CONNECTION';

export const MinioConnectionProvider: Provider = {
  provide: MINIO_CONNECTION,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const client = new Client({
      endPoint: configService.get<string>('MINIO_ENDPOINT') || 'localhost',
      port: Number(configService.get('MINIO_PORT')),
      useSSL: configService.get<string>('MINIO_USE_SSL') === 'true',
      accessKey: configService.get('MINIO_ACCESS_KEY'),
      secretKey: configService.get('MINIO_SECRET_KEY'),
    });

    // console.log('MinIO client initialized');

    return client;
  },
};
