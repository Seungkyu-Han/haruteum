export class CalendarScheduleNotFoundException extends Error {
  constructor(message = '해당 캘린더 일정을 찾을 수 없습니다.') {
    super(message);
  }
}

