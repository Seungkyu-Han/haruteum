import { Inject, Injectable } from '@nestjs/common';
import { ICalendarCommandService } from '../../calendar-core/input/services/calendar-command.service';
import {
  CALENDAR_SCHEDULE_REPOSITORY,
} from '../../calendar-core/calendar.token';
import type { ICalendarScheduleRepository } from '../../calendar-core/output/repositories/calendar-schedule.repository';
import { COUPLE_QUERY_SERVICE } from '../../../couple/couple-core/couple.token';
import type { ICoupleQueryService } from '../../../couple/couple-core/input/services/couple-query.service';
import { CalendarSchedule } from '../../calendar-core/calendar-schedule';
import { CreateCalendarScheduleCommand } from '../../calendar-core/commands/create-calendar-schedule.command';
import { UpdateCalendarScheduleCommand } from '../../calendar-core/commands/update-calendar-schedule.command';
import { CalendarScheduleNotFoundException } from '../../calendar-core/exceptions/calendar-schedule-not-found.exception';
import { InvalidDateRangeException } from '../../calendar-core/exceptions/invalid-date-range.exception';
import { UnauthorizedScheduleAccessException } from '../../calendar-core/exceptions/unauthorized-schedule-access.exception';

@Injectable()
export class CalendarCommandServiceImpl implements ICalendarCommandService {
  constructor(
    @Inject(CALENDAR_SCHEDULE_REPOSITORY)
    private readonly calendarScheduleRepository: ICalendarScheduleRepository,
    @Inject(COUPLE_QUERY_SERVICE)
    private readonly coupleQueryService: ICoupleQueryService,
  ) {}

  async createSchedule(
    userId: string,
    command: Omit<CreateCalendarScheduleCommand, 'coupleId' | 'userId'>,
  ): Promise<CalendarSchedule> {
    const couple = await this.coupleQueryService.getMyCouple(userId);

    const startDate = new Date(command.startDate);
    const endDate = command.endDate ? new Date(command.endDate) : startDate;

    if (startDate.getTime() > endDate.getTime()) {
      throw new InvalidDateRangeException();
    }

    const schedule = new CalendarSchedule({
      coupleId: couple.id,
      userId,
      title: command.title,
      description: command.description,
      startDate,
      endDate,
      isCompleted: command.isCompleted ?? false,
    });

    return await this.calendarScheduleRepository.save(schedule);
  }

  async updateSchedule(
    userId: string,
    scheduleId: string,
    command: UpdateCalendarScheduleCommand,
  ): Promise<CalendarSchedule> {
    const couple = await this.coupleQueryService.getMyCouple(userId);
    const schedule = await this.calendarScheduleRepository.findById(scheduleId);

    if (!schedule) {
      throw new CalendarScheduleNotFoundException();
    }

    if (!schedule.isOwnedByCouple(couple.id)) {
      throw new UnauthorizedScheduleAccessException();
    }

    const newStartDate = command.startDate
      ? new Date(command.startDate)
      : schedule.startDate;
    const newEndDate = command.endDate
      ? new Date(command.endDate)
      : schedule.endDate;

    if (newStartDate.getTime() > newEndDate.getTime()) {
      throw new InvalidDateRangeException();
    }

    schedule.update({
      title: command.title,
      description: command.description,
      startDate: command.startDate ? newStartDate : undefined,
      endDate: command.endDate ? newEndDate : undefined,
      isCompleted: command.isCompleted,
    });

    return await this.calendarScheduleRepository.save(schedule);
  }

  async toggleScheduleComplete(
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

    schedule.toggleComplete();
    return await this.calendarScheduleRepository.save(schedule);
  }

  async deleteSchedule(userId: string, scheduleId: string): Promise<void> {
    const couple = await this.coupleQueryService.getMyCouple(userId);
    const schedule = await this.calendarScheduleRepository.findById(scheduleId);

    if (!schedule) {
      throw new CalendarScheduleNotFoundException();
    }

    if (!schedule.isOwnedByCouple(couple.id)) {
      throw new UnauthorizedScheduleAccessException();
    }

    await this.calendarScheduleRepository.deleteById(scheduleId);
  }
}

