import { Module } from '@nestjs/common';
import { GuardianModule } from '@seungkyu/guardian';
import { CalendarApplicationModule } from '../calendar-application/calendar-application.module';
import { CalendarV1Controller } from './controllers/calendar.v1.controller';
import { getGuardianOptions } from '../../config/guardian.config';

@Module({
  imports: [
    CalendarApplicationModule,
    GuardianModule.forRoot(getGuardianOptions()),
  ],
  controllers: [CalendarV1Controller],
})
export class CalendarApiModule {}
