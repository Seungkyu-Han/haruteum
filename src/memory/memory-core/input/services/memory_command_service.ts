export interface MemoryCommandService {
  createMemory(imageFile: Buffer): Promise<string>;
}
