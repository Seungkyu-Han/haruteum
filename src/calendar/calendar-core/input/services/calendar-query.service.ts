import { CalendarSchedule } from '../../calendar-schedule';

export interface ICalendarQueryService {
  getSchedulesByRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CalendarSchedule[]>;

  getScheduleById(userId: string, scheduleId: string): Promise<CalendarSchedule>;
}

