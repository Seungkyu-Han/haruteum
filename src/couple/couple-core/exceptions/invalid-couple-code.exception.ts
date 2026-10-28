export class InvalidCoupleCodeException extends Error {
  constructor(message = '유효하지 않은 초대 코드입니다.') {
    super(message);
  }
}
