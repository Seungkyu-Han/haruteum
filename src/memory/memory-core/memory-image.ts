import { randomUUID } from 'crypto';

export class MemoryImage {
  private readonly _id: string;
  private readonly _memoryId: string;
  private readonly _filename: string;
  private readonly _buffer: Buffer;
  private readonly _url: string;

  constructor({
    id,
    memoryId,
    filename,
    buffer,
    url,
  }: {
    id?: string;
    memoryId: string;
    filename: string;
    buffer: Buffer;
    url: string;
  }) {
    this._id = id ?? randomUUID();
    this._memoryId = memoryId;
    this._filename = filename;
    this._buffer = buffer;
    this._url = url;
  }

  get filename() {
    return this._filename;
  }

  get buffer() {
    return this._buffer;
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
}
