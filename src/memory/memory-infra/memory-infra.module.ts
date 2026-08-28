import { Module } from '@nestjs/common';
import {
  IMAGE_MOOD_AGENT,
  MEMORY_IMAGE_STORAGE,
  MEMORY_REPOSITORY,
} from '../memory-core/memory.token';
import { OpenAIImageMoodAgent } from './agents/openai_image_mood_agent';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MockImageMoodAgent } from './agents/mock_image_mood_agent';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryImageEntity } from './entities/memory-image.entity';
import { MemoryCommentEntity } from './entities/memory-comment.entity';
import { MemoryEntity } from './entities/memory.entity';
import { MemoryRepositoryPg } from './repositories/memory.repository.pg';
import { GoogleMemoryImageStorage } from './storages/google-memory-image.storage';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MemoryImageEntity,
      MemoryCommentEntity,
      MemoryEntity,
    ]),
    ConfigModule.forRoot({
      isGlobal: false,
    }),
  ],
  providers: [
    {
      provide: MEMORY_REPOSITORY,
      useClass: MemoryRepositoryPg,
    },
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
        const imageStorageType =
          configService.getOrThrow<string>('IMAGE_STORAGE_TYPE');

        switch (imageStorageType) {
          default:
            return new GoogleMemoryImageStorage(
              configService.getOrThrow<string>('BUCKET_NAME'),
              configService.get<string>('KEY_FILENAME'),
            );
        }
      },
    },
  ],
  exports: [IMAGE_MOOD_AGENT, MEMORY_REPOSITORY, MEMORY_IMAGE_STORAGE],
})
export class MemoryInfraModule {}
