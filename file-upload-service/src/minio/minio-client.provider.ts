import { Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

export const MINIO_CONNECTION = 'MINIO_CONNECTION';

export const MinioConnectionProvider: Provider = {
  provide: MINIO_CONNECTION,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<Client> => {
    const logger = new Logger('MinioConnectionProvider');

    const client = new Client({
      endPoint: configService.get<string>('MINIO_ENDPOINT') || 'localhost',
      port: Number(configService.get('MINIO_PORT')),
      useSSL: configService.get<string>('MINIO_USE_SSL') === 'true',
      accessKey: configService.get('MINIO_ACCESS_KEY'),
      secretKey: configService.get('MINIO_SECRET_KEY'),
    });

    try {
      await client.listBuckets();
      logger.log('Successfully connected to MinIO');
    } catch (error) {
      logger.error('Failed to connect to MinIO:', error.message);
      throw error;
    }

    return client;
  },
};
