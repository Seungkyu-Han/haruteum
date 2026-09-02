export class UserNotFoundException extends Error {
  constructor() {
    super('존재하지 않는 사용자입니다.');
  }
}
