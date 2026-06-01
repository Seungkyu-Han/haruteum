export interface MemoryImageStorage {
  saveImage(filename: string, buffer: Buffer): Promise<string>;
}
