import { ImageMoodAgent } from '../../memory-core/output/agents/image-mood.agent';
import { Injectable } from '@nestjs/common';
import { ImageVO } from '../../memory-core/vo/image.vo';

@Injectable()
export class MockImageMoodAgent implements ImageMoodAgent {
  private readonly mood = 'mocked result';

  constructor() {}
  async invoke(_images: ImageVO[], _comment: string): Promise<string> {
    return Promise.resolve(this.mood);
  }
}
