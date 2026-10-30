import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICalendarScheduleRepository } from '../../calendar-core/output/repositories/calendar-schedule.repository';
import { CalendarSchedule } from '../../calendar-core/calendar-schedule';
import { CalendarScheduleEntity } from '../entities/calendar-schedule.entity';
import {
  calendarScheduleToDomain,
  calendarScheduleToEntity,
} from '../mappers/calendar-schedule.mapper';

@Injectable()
export class CalendarScheduleRepositoryPg
  implements ICalendarScheduleRepository
{
  constructor(
    @InjectRepository(CalendarScheduleEntity)
    private readonly repository: Repository<CalendarScheduleEntity>,
  ) {}

  async save(schedule: CalendarSchedule): Promise<CalendarSchedule> {
    const entity = calendarScheduleToEntity(schedule);
    const savedEntity = await this.repository.save(entity);
    return calendarScheduleToDomain(savedEntity);
  }

  async findById(id: string): Promise<CalendarSchedule | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });
    return entity ? calendarScheduleToDomain(entity) : null;
  }

  async findByCoupleIdAndDateRange(
    coupleId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CalendarSchedule[]> {
    const entities = await this.repository
      .createQueryBuilder('schedule')
      .where('schedule.coupleId = :coupleId', { coupleId })
      .andWhere('schedule.startDate <= :endDate', { endDate })
      .andWhere('schedule.endDate >= :startDate', { startDate })
      .orderBy('schedule.startDate', 'ASC')
      .addOrderBy('schedule.createdAt', 'ASC')
      .getMany();

    return entities.map(calendarScheduleToDomain);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}

