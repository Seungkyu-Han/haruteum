import { randomUUID } from 'crypto';

export class User {
  private readonly _id: string;
  private readonly _email: string | undefined;
  private readonly _name: string | undefined;
  private readonly _createdAt: Date;

  constructor({
    id,
    email,
    name,
    createdAt,
  }: {
    id?: string;
    email?: string;
    name?: string;
    createdAt?: Date;
  }) {
    this._id = id || randomUUID();
    this._email = email;
    this._name = name;
    this._createdAt = createdAt || new Date();
  }

  get id() {
    return this._id;
  }

  get email() {
    return this._email;
  }

  get name() {
    return this._name;
  }

  get createdAt() {
    return this._createdAt;
  }
}
