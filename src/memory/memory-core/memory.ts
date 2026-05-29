import { MemoryComment } from './memory-comment';
import { MemoryImage } from './memory-image';
import { ImageMoodAgent } from './output/agents/image-mood.agent';

export class Memory {
  private readonly _memoryImages: MemoryImage[];
  private readonly _comments: MemoryComment[];
  private readonly _createdAt: Date;
  private _summary: string | undefined;

  constructor({
    memoryImages,
    comments,
    createdAt,
  }: {
    memoryImages: MemoryImage[];
    comments: MemoryComment[];
    createdAt?: Date;
    summary?: string;
  }) {
    this._memoryImages = memoryImages;
    this._comments = comments;
    this._createdAt = createdAt || new Date();
    this._summary = undefined;
  }

  async summarize(imageMoodAgent: ImageMoodAgent): Promise<void> {
    this._summary = await imageMoodAgent.invoke(
      this._memoryImages,
      this._comments,
    );
  }

  get memoryImages() {
    return this._memoryImages;
  }

  get comment() {
    return this._comments;
  }

  get createdAt() {
    return this._createdAt;
  }

  get summary() {
    return this._summary;
  }
}
