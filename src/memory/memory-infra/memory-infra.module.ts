import { Module } from '@nestjs/common';
import {
  IMAGE_MOOD_AGENT,
  MEMORY_IMAGE_STORAGE,
} from '../memory-core/memory.token';
import { OpenAIImageMoodAgent } from './agents/openai_image_mood_agent';
import { MinioMemoryImageStorage } from './storages/minio-memory-image.storage';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
    }),
  ],
  providers: [
    {
      provide: IMAGE_MOOD_AGENT,
      useClass: OpenAIImageMoodAgent,
    },
    {
      inject: [ConfigService],
      provide: MEMORY_IMAGE_STORAGE,
      useFactory: (configService: ConfigService) => {
        const memoryImageStorageType = configService.get<string>(
          'MEMORY_IMAGE_STORAGE_TYPE',
        );
        const localIp = configService.get<string>('LOCAL_IP') || '';
        const s3AccessKeyId =
          configService.get<string>('S3_ACCESS_KEY_ID') || '';
        const s3SecretAccessKey =
          configService.get<string>('S3_SECRET_ACCESS_KEY') || '';

        switch (memoryImageStorageType) {
          case 'minio':
            return new MinioMemoryImageStorage(
              localIp,
              s3AccessKeyId,
              s3SecretAccessKey,
            );
          default:
            throw new Error(
              `Unsupported MEMORY_IMAGE_STORAGE_TYPE: ${memoryImageStorageType}`,
            );
        }
      },
    },
  ],
  exports: [IMAGE_MOOD_AGENT, MEMORY_IMAGE_STORAGE],
})
export class MemoryInfraModule {}
