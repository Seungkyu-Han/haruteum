import { randomUUID } from 'crypto';

export class CoupleInviteCode {
  private readonly _id: string;
  private readonly _inviterId: string;
  private readonly _code: string;
  private readonly _expiresAt: Date;
  private _isUsed: boolean;
  private readonly _createdAt: Date;

  constructor({
    id,
    inviterId,
    code,
    expiresAt,
    isUsed = false,
    createdAt,
  }: {
    id?: string;
    inviterId: string;
    code: string;
    expiresAt: Date;
    isUsed?: boolean;
    createdAt?: Date;
  }) {
    this._id = id ?? randomUUID();
    this._inviterId = inviterId;
    this._code = code;
    this._expiresAt = expiresAt;
    this._isUsed = isUsed;
    this._createdAt = createdAt ?? new Date();
  }

  get id(): string {
    return this._id;
  }

  get inviterId(): string {
    return this._inviterId;
  }

  get code(): string {
    return this._code;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  get isUsed(): boolean {
    return this._isUsed;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  isExpired(now = new Date()): boolean {
    return this._expiresAt.getTime() <= now.getTime();
  }

  use(): void {
    this._isUsed = true;
  }

  invalidate(): void {
    this._isUsed = true;
  }
}
