export interface MemoryCommandService {
  createMemory(imageFile: Buffer, review: string): void;
}
