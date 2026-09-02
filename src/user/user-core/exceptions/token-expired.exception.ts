export class TokenExpiredException extends Error {
  constructor() {
    super('만료된 토큰입니다.');
  }
}
