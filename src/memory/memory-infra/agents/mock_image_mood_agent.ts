import { ImageMoodAgent } from '../../memory-core/output/agents/image-mood.agent';
import { Injectable } from '@nestjs/common';
import { MemoryComment } from '../../memory-core/memory-comment';

@Injectable()
export class MockImageMoodAgent implements ImageMoodAgent {
  private readonly mood = 'mocked result';

  constructor() {}
  async invoke(
    _memoryImageBuffers: Buffer[],
    _memoryComments: MemoryComment[],
  ): Promise<string> {
    return Promise.resolve(this.mood);
  }
}
