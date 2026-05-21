import { Module } from '@nestjs/common';
import {
  IMAGE_MOOD_AGENT,
  MEMORY_IMAGE_STORAGE,
} from '../memory-core/memory.token';
import { OpenAIImageMoodAgent } from './agents/openai_image_mood_agent';
import { S3MemoryImageStorage } from './storages/s3-memory-image.storage';

@Module({
  providers: [
    {
      provide: IMAGE_MOOD_AGENT,
      useClass: OpenAIImageMoodAgent,
    },
    {
      provide: MEMORY_IMAGE_STORAGE,
      useClass: S3MemoryImageStorage,
    },
  ],
  exports: [IMAGE_MOOD_AGENT, MEMORY_IMAGE_STORAGE],
})
export class MemoryInfraModule {}
