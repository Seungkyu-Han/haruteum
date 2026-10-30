import { Module } from '@nestjs/common';
import { GuardianModule } from '@seungkyu/guardian';
import { JwtModule } from '@nestjs/jwt';
import { CalendarApplicationModule } from '../calendar-application/calendar-application.module';
import { CalendarV1Controller } from './controllers/calendar.v1.controller';

@Module({
  imports: [
    CalendarApplicationModule,
    JwtModule,
    GuardianModule.forRoot({
      accessTokenOptions: {
        secretKey: process.env.JWT_SECRET ?? '',
      },
    }),
  ],
  controllers: [CalendarV1Controller],
})
export class CalendarApiModule {}

