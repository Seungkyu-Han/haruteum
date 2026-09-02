import { randomUUID } from 'crypto';

export class User {
  private readonly _id: string;
  private _email: string | undefined;
  private _name: string | undefined;
  private readonly _createdAt: Date;
  private readonly _deletedAt: Date | undefined;

  constructor({
    id,
    email,
    name,
    createdAt,
    deletedAt,
  }: {
    id?: string;
    email?: string;
    name?: string;
    createdAt?: Date;
    deletedAt?: Date;
  }) {
    this._id = id || randomUUID();
    this._email = email;
    this._name = name;
    this._createdAt = createdAt || new Date();
    this._deletedAt = deletedAt;
  }

  get id() {
    return this._id;
  }

  get email(): string | undefined {
    return this._email;
  }

  get name(): string | undefined {
    return this._name;
  }

  get createdAt() {
    return this._createdAt;
  }

  get deletedAt() {
    return this._deletedAt;
  }

  set name(name: string | undefined) {
    this._name = name;
  }

  set email(email: string | undefined) {
    this._email = email;
  }

  isDeleted() {
    return !!this._deletedAt;
  }
}
