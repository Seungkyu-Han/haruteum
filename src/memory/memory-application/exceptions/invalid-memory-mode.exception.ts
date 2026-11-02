export class InvalidMemoryModeException extends Error {
  constructor(
    message = '유효하지 않은 추억 모드입니다. TOGETHER 또는 SOLO 모드를 지정해주세요.',
  ) {
    super(message);
  }
}
