import { randomUUID } from 'crypto';

export class Couple {
  private readonly _id: string;
  private readonly _user1Id: string;
  private readonly _user2Id: string;
  private readonly _createdAt: Date;
  private _deletedAt?: Date;

  constructor({
    id,
    user1Id,
    user2Id,
    createdAt,
    deletedAt,
  }: {
    id?: string;
    user1Id: string;
    user2Id: string;
    createdAt?: Date;
    deletedAt?: Date;
  }) {
    this._id = id ?? randomUUID();
    this._user1Id = user1Id;
    this._user2Id = user2Id;
    this._createdAt = createdAt ?? new Date();
    this._deletedAt = deletedAt;
  }

  get id(): string {
    return this._id;
  }

  get user1Id(): string {
    return this._user1Id;
  }

  get user2Id(): string {
    return this._user2Id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  isMember(userId: string): boolean {
    return this._user1Id === userId || this._user2Id === userId;
  }

  getPartnerId(userId: string): string {
    if (this._user1Id === userId) {
      return this._user2Id;
    }
    if (this._user2Id === userId) {
      return this._user1Id;
    }
    throw new Error('해당 커플에 속한 사용자가 아닙니다.');
  }

  disconnect(): void {
    this._deletedAt = new Date();
  }

  isDisconnected(): boolean {
    return !!this._deletedAt;
  }
}
