import { Module } from '@nestjs/common';
import { CalendarApiModule } from './calendar-api/calendar-api.module';

@Module({
  imports: [CalendarApiModule],
})
export class CalendarModule {}

