import { randomUUID } from 'crypto';

export class CalendarSchedule {
  private readonly _id: string;
  private readonly _coupleId: string;
  private readonly _userId: string;
  private _title: string;
  private _description: string | null;
  private _startDate: Date;
  private _endDate: Date;
  private _isCompleted: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt?: Date;

  constructor({
    id,
    coupleId,
    userId,
    title,
    description = null,
    startDate,
    endDate,
    isCompleted = false,
    createdAt,
    updatedAt,
    deletedAt,
  }: {
    id?: string;
    coupleId: string;
    userId: string;
    title: string;
    description?: string | null;
    startDate: Date;
    endDate?: Date;
    isCompleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }) {
    this._id = id ?? randomUUID();
    this._coupleId = coupleId;
    this._userId = userId;
    this._title = title;
    this._description = description ?? null;
    this._startDate = startDate;
    this._endDate = endDate ?? startDate;
    this._isCompleted = isCompleted;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
    this._deletedAt = deletedAt;
  }

  get id(): string {
    return this._id;
  }

  get coupleId(): string {
    return this._coupleId;
  }

  get userId(): string {
    return this._userId;
  }

  get title(): string {
    return this._title;
  }

  get description(): string | null {
    return this._description;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date {
    return this._endDate;
  }

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  update({
    title,
    description,
    startDate,
    endDate,
    isCompleted,
  }: {
    title?: string;
    description?: string | null;
    startDate?: Date;
    endDate?: Date;
    isCompleted?: boolean;
  }): void {
    if (title !== undefined) {
      this._title = title;
    }
    if (description !== undefined) {
      this._description = description;
    }
    if (startDate !== undefined) {
      this._startDate = startDate;
    }
    if (endDate !== undefined) {
      this._endDate = endDate;
    }
    if (isCompleted !== undefined) {
      this._isCompleted = isCompleted;
    }
    this._updatedAt = new Date();
  }

  toggleComplete(): void {
    this._isCompleted = !this._isCompleted;
    this._updatedAt = new Date();
  }

  isOwnedByCouple(coupleId: string): boolean {
    return this._coupleId === coupleId;
  }
}

