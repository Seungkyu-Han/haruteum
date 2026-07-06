import { MemoryComment } from '../../memory-comment';
import { ImageMoodAgentModel } from '../../models/image-mood-agent.model';
export interface ImageMoodAgent {
  invoke(
    memoryImageBuffers: Buffer[],
    memoryComments: MemoryComment[],
  ): Promise<ImageMoodAgentModel>;
}
