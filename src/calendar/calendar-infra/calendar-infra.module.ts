import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarScheduleEntity } from './entities/calendar-schedule.entity';
import { CalendarScheduleRepositoryPg } from './repositories/calendar-schedule.repository.pg';
import { CALENDAR_SCHEDULE_REPOSITORY } from '../calendar-core/calendar.token';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarScheduleEntity])],
  providers: [
    {
      provide: CALENDAR_SCHEDULE_REPOSITORY,
      useClass: CalendarScheduleRepositoryPg,
    },
  ],
  exports: [CALENDAR_SCHEDULE_REPOSITORY],
})
export class CalendarInfraModule {}

