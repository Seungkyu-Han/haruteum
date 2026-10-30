import { CalendarSchedule } from '../../calendar-core/calendar-schedule';
import { CalendarScheduleEntity } from '../entities/calendar-schedule.entity';

export function calendarScheduleToDomain(
  entity: CalendarScheduleEntity,
): CalendarSchedule {
  return new CalendarSchedule({
    id: entity.id,
    coupleId: entity.coupleId,
    userId: entity.userId,
    title: entity.title,
    description: entity.description,
    startDate: entity.startDate,
    endDate: entity.endDate,
    isCompleted: entity.isCompleted,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    deletedAt: entity.deletedAt,
  });
}

export function calendarScheduleToEntity(
  domain: CalendarSchedule,
): CalendarScheduleEntity {
  const entity = new CalendarScheduleEntity();
  entity.id = domain.id;
  entity.coupleId = domain.coupleId;
  entity.userId = domain.userId;
  entity.title = domain.title;
  entity.description = domain.description ?? undefined;
  entity.startDate = domain.startDate;
  entity.endDate = domain.endDate;
  entity.isCompleted = domain.isCompleted;
  entity.createdAt = domain.createdAt;
  entity.updatedAt = domain.updatedAt;
  entity.deletedAt = domain.deletedAt;
  return entity;
}

