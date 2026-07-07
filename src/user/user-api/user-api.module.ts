import { Module } from '@nestjs/common';
import { UserApplicationModule } from '../user-application/user-application.module';
import { AuthV1Controller } from './controllers/auth.v1.controller';

@Module({
  imports: [UserApplicationModule],
  controllers: [AuthV1Controller],
})
export class UserApiModule {}
