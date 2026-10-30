import { CalendarSchedule } from '../../calendar-schedule';

export interface ICalendarScheduleRepository {
  save(schedule: CalendarSchedule): Promise<CalendarSchedule>;
  findById(id: string): Promise<CalendarSchedule | null>;
  findByCoupleIdAndDateRange(
    coupleId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CalendarSchedule[]>;
  deleteById(id: string): Promise<void>;
}

