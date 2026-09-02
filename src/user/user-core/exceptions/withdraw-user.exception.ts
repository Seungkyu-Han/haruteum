export class WithdrawUserException extends Error {
  constructor() {
    super(`탈퇴한 사용자입니다.`);
  }
}
