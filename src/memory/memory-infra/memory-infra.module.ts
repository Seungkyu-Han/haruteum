import { Module } from '@nestjs/common';
import {
  IMAGE_MOOD_AGENT,
  MEMORY_IMAGE_STORAGE,
} from '../memory-core/memory.token';
import { OpenAIImageMoodAgent } from './agents/openai_image_mood_agent';
import { MinioMemoryImageStorage } from './storages/minio-memory-image.storage';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MockImageMoodAgent } from './agents/mock_image_mood_agent';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
    }),
  ],
  providers: [
    {
      inject: [ConfigService],
      provide: IMAGE_MOOD_AGENT,
      useFactory: (configService: ConfigService) => {
        const imageMoodAgentType = configService.get<string>(
          'IMAGE_MOOD_AGENT_TYPE',
        );

        switch (imageMoodAgentType) {
          case 'openai':
            return new OpenAIImageMoodAgent();
          default:
            return new MockImageMoodAgent();
        }
      },
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
