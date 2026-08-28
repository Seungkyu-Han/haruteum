import { MemoryComment } from './memory-comment';
import { MemoryImage } from './memory-image';
import { ImageMoodAgent } from './output/agents/image-mood.agent';
import { v7 as uuidv7 } from 'uuid';

export class Memory {
  private readonly _id: string;
  private readonly _userId?: string;
  private readonly _memoryImages: MemoryImage[];
  private readonly _memoryComments: MemoryComment[];
  private readonly _createdAt: Date;
  private _happyScore: number;
  private _recommendedSong: string;
  private readonly _emotions: string[];
  private _summary: string | undefined;
  private readonly _mode: string;

  constructor({
    id,
    userId,
    memoryImages,
    memoryComments,
    happyScore,
    recommendedSong,
    mode,
    emotions,
    createdAt,
  }: {
    id?: string;
    userId?: string;
    memoryImages: MemoryImage[];
    memoryComments: MemoryComment[];
    happyScore?: number;
    recommendedSong?: string;
    mode: string;
    emotions: string[];
    createdAt?: Date;
    summary?: string;
  }) {
    this._id = id || uuidv7();
    this._userId = userId;
    this._memoryImages = memoryImages;
    this._memoryComments = memoryComments;
    this._createdAt = createdAt || new Date();
    this._summary = undefined;
    this._happyScore = happyScore || 0;
    this._mode = mode;
    this._recommendedSong = recommendedSong || '';
    this._emotions = emotions;
  }

  async summarize(
    memoryImageBuffers: Buffer[],
    imageMoodAgent: ImageMoodAgent,
  ): Promise<void> {
    const imageMoodAgentModel = await imageMoodAgent.invoke(
      memoryImageBuffers,
      this._memoryComments,
    );

    this._summary = imageMoodAgentModel.summary;
    this._happyScore = imageMoodAgentModel.happyScore;
    this._recommendedSong = imageMoodAgentModel.recommendedSong;
  }

  get userId() {
    return this._userId;
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

  get happyScore() {
    return this._happyScore;
  }

  get emotions() {
    return this._emotions;
  }

  get recommendedSong() {
    return this._recommendedSong;
  }

  get mode() {
    return this._mode;
  }
}
