import { randomUUID } from 'crypto';

export class User {
  private readonly _id: string;
  private _email: string | undefined;
  private _nickname: string | undefined;
  private readonly _createdAt: Date;
  private readonly _deletedAt: Date | undefined;

  constructor({
    id,
    email,
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
    this._email = email;
    this._nickname = nickname;
    this._createdAt = createdAt || new Date();
    this._deletedAt = deletedAt;
  }

  get id() {
    return this._id;
  }

  get email(): string | undefined {
    return this._email;
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

  set email(email: string | undefined) {
    this._email = email;
  }

  isDeleted() {
    return !!this._deletedAt;
  }
}
