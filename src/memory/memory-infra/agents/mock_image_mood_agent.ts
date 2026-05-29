import { ImageMoodAgent } from '../../memory-core/output/agents/image-mood.agent';
import { Injectable } from '@nestjs/common';
import { MemoryImage } from '../../memory-core/memory-image';
import { MemoryComment } from '../../memory-core/memory-comment';

@Injectable()
export class MockImageMoodAgent implements ImageMoodAgent {
  private readonly mood = 'mocked result';

  constructor() {}
  async invoke(
    _memoryImages: MemoryImage[],
    _memoryComments: MemoryComment[],
  ): Promise<string> {
    return Promise.resolve(this.mood);
  }
}
