import { randomUUID } from 'crypto';

export class MemoryImage {
  private readonly _id: string;
  private readonly _memoryId: string;
  private readonly _filename: string;
  private readonly _url: string;
  private readonly _createdAt: Date;

  constructor({
    id,
    memoryId,
    filename,
    url,
    createdAt,
  }: {
    id?: string;
    memoryId: string;
    filename: string;
    url: string;
    createdAt?: Date;
  }) {
    this._id = id ?? randomUUID();
    this._memoryId = memoryId;
    this._filename = filename;
    this._url = url;
    this._createdAt = createdAt ?? new Date();
  }

  get filename() {
    return this._filename;
  }

  get url() {
    return this._url;
  }

  get memoryId() {
    return this._memoryId;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }
}
