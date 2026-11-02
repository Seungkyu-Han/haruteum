export class CoupleCodeGenerationFailedException extends Error {
  constructor(
    message = '초대 코드 생성에 실패했습니다. 잠시 후 다시 시도해주세요.',
  ) {
    super(message);
  }
}
