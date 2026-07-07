import { ImageMoodAgent } from '../../memory-core/output/agents/image-mood.agent';
import { Injectable } from '@nestjs/common';
import { MemoryComment } from '../../memory-core/memory-comment';
import { ImageMoodAgentModel } from '../../memory-core/models/image-mood-agent.model';

@Injectable()
export class MockImageMoodAgent implements ImageMoodAgent {
  private readonly mood = 'mocked result';

  constructor() {}
  async invoke(
    _memoryImageBuffers: Buffer[],
    _memoryComments: MemoryComment[],
  ): Promise<ImageMoodAgentModel> {
    return Promise.resolve(new ImageMoodAgentModel(this.mood, 80, ''));
  }
}
