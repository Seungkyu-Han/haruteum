import { Module } from '@nestjs/common';
import { UserApplicationModule } from '../user-application/user-application.module';
import { AuthV1Controller } from './controllers/auth.v1.controller';
import { GuardianModule } from '@seungkyu/guardian';

@Module({
  imports: [
    UserApplicationModule,
    GuardianModule.forRoot({
      accessTokenOptions: {
        secretKey: process.env.JWT_SECRET ?? '',
      },
    }),
  ],
  controllers: [AuthV1Controller],
})
export class UserApiModule {}
