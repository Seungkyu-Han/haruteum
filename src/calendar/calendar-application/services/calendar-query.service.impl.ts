import { Inject, Injectable } from '@nestjs/common';
import { ICalendarQueryService } from '../../calendar-core/input/services/calendar-query.service';
import { CALENDAR_SCHEDULE_REPOSITORY } from '../../calendar-core/calendar.token';
import type { ICalendarScheduleRepository } from '../../calendar-core/output/repositories/calendar-schedule.repository';
import { COUPLE_QUERY_SERVICE } from '../../../couple/couple-core/couple.token';
import type { ICoupleQueryService } from '../../../couple/couple-core/input/services/couple-query.service';
import { CalendarSchedule } from '../../calendar-core/calendar-schedule';
import { CalendarScheduleNotFoundException } from '../../calendar-core/exceptions/calendar-schedule-not-found.exception';
import { InvalidDateRangeException } from '../../calendar-core/exceptions/invalid-date-range.exception';
import { UnauthorizedScheduleAccessException } from '../../calendar-core/exceptions/unauthorized-schedule-access.exception';

@Injectable()
export class CalendarQueryServiceImpl implements ICalendarQueryService {
  constructor(
    @Inject(CALENDAR_SCHEDULE_REPOSITORY)
    private readonly calendarScheduleRepository: ICalendarScheduleRepository,
    @Inject(COUPLE_QUERY_SERVICE)
    private readonly coupleQueryService: ICoupleQueryService,
  ) {}

  async getSchedulesByRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CalendarSchedule[]> {
    const couple = await this.coupleQueryService.getMyCouple(userId);

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.getTime() > end.getTime()) {
      throw new InvalidDateRangeException();
    }

    return await this.calendarScheduleRepository.findByCoupleIdAndDateRange(
      couple.id,
      start,
      end,
    );
  }

  async getScheduleById(
    userId: string,
    scheduleId: string,
  ): Promise<CalendarSchedule> {
    const couple = await this.coupleQueryService.getMyCouple(userId);
    const schedule = await this.calendarScheduleRepository.findById(scheduleId);

    if (!schedule) {
      throw new CalendarScheduleNotFoundException();
    }

    if (!schedule.isOwnedByCouple(couple.id)) {
      throw new UnauthorizedScheduleAccessException();
    }

    return schedule;
  }
}

