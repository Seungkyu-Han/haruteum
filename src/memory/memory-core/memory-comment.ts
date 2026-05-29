import { randomUUID } from 'crypto';

export class MemoryComment {
  private readonly _id: string;
  private readonly _memoryId: string;
  private readonly _comment: string;
  private readonly _createdAt: Date;

  constructor({
    id,
    memoryId,
    comment,
    createdAt,
  }: {
    id?: string;
    memoryId: string;
    comment: string;
    createdAt?: Date;
  }) {
    this._id = id ?? randomUUID();
    this._memoryId = memoryId;
    this._comment = comment;
    this._createdAt = createdAt ?? new Date();
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

  get createdAt() {
    return this._createdAt;
  }
}
