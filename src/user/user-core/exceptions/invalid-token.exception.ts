export class InvalidTokenException extends Error {
  constructor(message = '유효하지 않은 토큰입니다.') {
    super(message);
  }
}
