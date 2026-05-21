import { Module } from '@nestjs/common';
import { IMAGE_MOOD_AGENT } from '../memory-core/memory.token';
import { OpenAIImageMoodAgent } from './agents/openai_image_mood_agent';

@Module({
  providers: [
    {
      provide: IMAGE_MOOD_AGENT,
      useClass: OpenAIImageMoodAgent,
    },
  ],
  exports: [IMAGE_MOOD_AGENT],
})
export class MemoryInfraModule {}
