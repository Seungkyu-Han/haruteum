import { randomUUID } from 'crypto';

export class KakaoOauth {
  private readonly _id: string;
  private readonly _kakaoId: number;
  private readonly _userId: string;

  constructor({
    id,
    kakaoId,
    userId,
  }: {
    id?: string;
    kakaoId: number;
    userId?: string;
  }) {
    this._id = id || randomUUID();
    this._kakaoId = kakaoId;
    this._userId = userId || randomUUID();
  }

  get id() {
    return this._id;
  }

  get kakaoId() {
    return this._kakaoId;
  }

  get userId() {
    return this._userId;
  }
}
