import { MemoryComment } from '../../memory-comment';
export interface ImageMoodAgent {
  invoke(
    memoryImageBuffers: Buffer[],
    memoryComments: MemoryComment[],
  ): Promise<string>;
}
