export class UnauthorizedScheduleAccessException extends Error {
  constructor(message = '해당 일정에 대한 접근 권한이 없습니다.') {
    super(message);
  }
}

