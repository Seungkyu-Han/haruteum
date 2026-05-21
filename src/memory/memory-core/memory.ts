import { ImageMoodAgent } from './output/agents/image-mood.agent';
import { ImageVO } from './vo/image.vo';

export class Memory {
  private readonly _images: ImageVO[];
  private readonly _comment: string;
  private readonly _createdAt: Date;
  private _summary: string | undefined;

  constructor(images: ImageVO[], comment: string, createdAt?: Date) {
    this._images = images;
    this._comment = comment;
    this._createdAt = createdAt || new Date();
    this._summary = undefined;
  }

  async summarize(imageMoodAgent: ImageMoodAgent): Promise<void> {
    this._summary = await imageMoodAgent.invoke(this._images, this._comment);
  }

  get images() {
    return this._images;
  }

  get comment() {
    return this._comment;
  }

  get createdAt() {
    return this._createdAt;
  }

  get summary() {
    return this._summary;
  }
}
