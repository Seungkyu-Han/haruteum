export class CoupleCodeExpiredException extends Error {
  constructor(message = '만료된 초대 코드입니다.') {
    super(message);
  }
}
