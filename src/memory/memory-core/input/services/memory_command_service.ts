export interface MemoryCommandService {
  createMemory(imageFiles: Buffer[], comment: string): Promise<string>;
}
