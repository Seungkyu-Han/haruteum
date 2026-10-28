export class AlreadyInCoupleException extends Error {
  constructor(message = '이미 커플로 연결되어 있는 사용자입니다.') {
    super(message);
  }
}
