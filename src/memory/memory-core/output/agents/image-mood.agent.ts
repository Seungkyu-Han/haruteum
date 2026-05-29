import { MemoryComment } from '../../memory-comment';
import { MemoryImage } from '../../memory-image';

export interface ImageMoodAgent {
  invoke(
    memoryImages: MemoryImage[],
    memoryComments: MemoryComment[],
  ): Promise<string>;
}
