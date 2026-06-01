import { randomUUID } from 'crypto';
import { MemoryComment } from './memory-comment';
import { MemoryImage } from './memory-image';
import { ImageMoodAgent } from './output/agents/image-mood.agent';

export class Memory {
  private readonly _id: string;
  private readonly _memoryImages: MemoryImage[];
  private readonly _memoryComments: MemoryComment[];
  private readonly _createdAt: Date;
  private _summary: string | undefined;

  constructor({
    id,
    memoryImages,
    memoryComments,
    createdAt,
  }: {
    id?: string;
    memoryImages: MemoryImage[];
    memoryComments: MemoryComment[];
    createdAt?: Date;
    summary?: string;
  }) {
    this._id = id || randomUUID();
    this._memoryImages = memoryImages;
    this._memoryComments = memoryComments;
    this._createdAt = createdAt || new Date();
    this._summary = undefined;
  }

  async summarize(
    memoryImageBuffers: Buffer[],
    imageMoodAgent: ImageMoodAgent,
  ): Promise<void> {
    this._summary = await imageMoodAgent.invoke(
      memoryImageBuffers,
      this._memoryComments,
    );
  }

  get id() {
    return this._id;
  }

  get memoryImages() {
    return this._memoryImages;
  }

  get memoryComments() {
    return this._memoryComments;
  }

  get createdAt() {
    return this._createdAt;
  }

  get summary() {
    return this._summary;
  }
}
