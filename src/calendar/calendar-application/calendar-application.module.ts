import { Module } from '@nestjs/common';
import { CalendarInfraModule } from '../calendar-infra/calendar-infra.module';
import { CoupleApplicationModule } from '../../couple/couple-application/couple-application.module';
import {
  CALENDAR_COMMAND_SERVICE,
  CALENDAR_QUERY_SERVICE,
} from '../calendar-core/calendar.token';
import { CalendarCommandServiceImpl } from './services/calendar-command.service.impl';
import { CalendarQueryServiceImpl } from './services/calendar-query.service.impl';

@Module({
  imports: [CalendarInfraModule, CoupleApplicationModule],
  providers: [
    {
      provide: CALENDAR_COMMAND_SERVICE,
      useClass: CalendarCommandServiceImpl,
    },
    {
      provide: CALENDAR_QUERY_SERVICE,
      useClass: CalendarQueryServiceImpl,
    },
  ],
  exports: [CALENDAR_COMMAND_SERVICE, CALENDAR_QUERY_SERVICE],
})
export class CalendarApplicationModule {}

