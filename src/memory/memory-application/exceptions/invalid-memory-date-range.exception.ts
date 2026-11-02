export class InvalidMemoryDateRangeException extends Error {
  constructor(
    message = '시작일과 종료일은 동시에 지정되어야 하며, 시작일은 종료일보다 이전이어야 합니다.',
  ) {
    super(message);
  }
}
