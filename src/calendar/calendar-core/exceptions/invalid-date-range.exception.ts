export class InvalidDateRangeException extends Error {
  constructor(message = '시작일은 종료일보다 이전이어야 합니다.') {
    super(message);
  }
}

