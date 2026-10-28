export class CoupleCodeAlreadyUsedException extends Error {
  constructor(message = '이미 사용된 초대 코드입니다.') {
    super(message);
  }
}
