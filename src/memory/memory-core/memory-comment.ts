import { randomUUID } from 'crypto';

export class MemoryComment {
  private readonly _id: string;
  private readonly _memoryId: string;
  private readonly _comment: string;

  constructor({
    id,
    memoryId,
    comment,
  }: {
    id?: string;
    memoryId: string;
    comment: string;
  }) {
    this._id = id ?? randomUUID();
    this._memoryId = memoryId;
    this._comment = comment;
  }

  get id() {
    return this._id;
  }

  get memoryId() {
    return this._memoryId;
  }

  get comment() {
    return this._comment;
  }
}
