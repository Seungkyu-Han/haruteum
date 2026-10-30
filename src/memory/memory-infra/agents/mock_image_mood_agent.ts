import { ImageMoodAgent } from '../../memory-core/output/agents/image-mood.agent';
import { Injectable } from '@nestjs/common';
import { MemoryComment } from '../../memory-core/memory-comment';
import { ImageMoodAgentModel } from '../../memory-core/models/image-mood-agent.model';
import { isCoupleMemoryMode } from '../../memory-core/models/memory-mode.enum';

@Injectable()
export class MockImageMoodAgent implements ImageMoodAgent {
  constructor() {}
  async invoke(
    _memoryImageBuffers: Buffer[],
    _memoryComments: MemoryComment[],
    mode?: string,
  ): Promise<ImageMoodAgentModel> {
    const isCouple = isCoupleMemoryMode(mode);
    const mood = isCouple
      ? '우리 둘만의 소중하고 설레는 순간'
      : '오롯이 나에게 집중했던 평온한 하루';
    return Promise.resolve(new ImageMoodAgentModel(mood, 80, ''));
  }
}
