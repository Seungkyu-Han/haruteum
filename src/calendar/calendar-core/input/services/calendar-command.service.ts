import { CalendarSchedule } from '../../calendar-schedule';
import { CreateCalendarScheduleCommand } from '../../commands/create-calendar-schedule.command';
import { UpdateCalendarScheduleCommand } from '../../commands/update-calendar-schedule.command';

export interface ICalendarCommandService {
  createSchedule(
    userId: string,
    command: Omit<CreateCalendarScheduleCommand, 'coupleId' | 'userId'>,
  ): Promise<CalendarSchedule>;

  updateSchedule(
    userId: string,
    scheduleId: string,
    command: UpdateCalendarScheduleCommand,
  ): Promise<CalendarSchedule>;

  toggleScheduleComplete(
    userId: string,
    scheduleId: string,
  ): Promise<CalendarSchedule>;

  deleteSchedule(userId: string, scheduleId: string): Promise<void>;
}

