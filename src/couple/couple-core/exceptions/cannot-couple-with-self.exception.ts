export class CannotCoupleWithSelfException extends Error {
  constructor(message = '자신이 생성한 초대 코드에는 연결할 수 없습니다.') {
    super(message);
  }
}
