export interface MemoryImageStorage {
  saveImage(imageFile: Buffer): Promise<string>;
}
