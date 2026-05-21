import type { ImageMoodAgent } from '../../memory-core/output/agents/image-mood.agent';
import { Inject, Injectable } from '@nestjs/common';
import { MemoryCommandService } from '../../memory-core/input/services/memory_command_service';
import { IMAGE_MOOD_AGENT } from '../../memory-core/memory.token';

@Injectable()
export class MemoryCommandServiceImpl implements MemoryCommandService {
  constructor(
    @Inject(IMAGE_MOOD_AGENT) private readonly imageMoodAgent: ImageMoodAgent,
  ) {}

  async createMemory(imageFiles: Buffer[], comment: string): Promise<string> {
    const mood = await this.imageMoodAgent.invoke(imageFiles, comment);
    return mood;
  }
}
