import { randomUUID } from 'crypto';

export class User {
  private readonly _id: string;
  private _nickname: string | undefined;
  private readonly _createdAt: Date;
  private _deletedAt: Date | undefined;

  constructor({
    id,
    nickname,
    createdAt,
    deletedAt,
  }: {
    id?: string;
    email?: string;
    nickname?: string;
    createdAt?: Date;
    deletedAt?: Date;
  }) {
    this._id = id || randomUUID();
    this._nickname = nickname;
    this._createdAt = createdAt || new Date();
    this._deletedAt = deletedAt;
  }

  get id() {
    return this._id;
  }

  get nickname(): string | undefined {
    return this._nickname;
  }

  get createdAt() {
    return this._createdAt;
  }

  get deletedAt() {
    return this._deletedAt;
  }

  set nickname(nickname: string | undefined) {
    this._nickname = nickname;
  }

  isDeleted() {
    return !!this._deletedAt;
  }

  withdraw() {
    this._deletedAt = new Date();
    this._nickname = undefined;
  }

  restore(nickname: string) {
    this._nickname = nickname;
    this._deletedAt = undefined;
  }
}
