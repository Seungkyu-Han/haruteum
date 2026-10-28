export class CoupleNotFoundException extends Error {
  constructor(message = '커플 정보를 찾을 수 없습니다.') {
    super(message);
  }
}
