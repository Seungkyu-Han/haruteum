import { ImageVO } from '../../vo/image.vo';

export interface MemoryImageStorage {
  saveImage(imageVO: ImageVO): Promise<string>;
}
