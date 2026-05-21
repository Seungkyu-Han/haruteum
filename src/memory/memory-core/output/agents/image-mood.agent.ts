import { ImageVO } from '../../vo/image.vo';

export interface ImageMoodAgent {
  invoke(images: ImageVO[], comment: string): Promise<string>;
}
