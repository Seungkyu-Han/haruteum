import { Module } from '@nestjs/common';
import { GuardianModule } from '@seungkyu/guardian';
import { CoupleApplicationModule } from '../couple-application/couple-application.module';
import { CoupleV1Controller } from './controllers/couple.v1.controller';
import { UserApplicationModule } from '../../user/user-application/user-application.module';
import { getGuardianOptions } from '../../config/guardian.config';

@Module({
  imports: [
    CoupleApplicationModule,
    UserApplicationModule,
    GuardianModule.forRoot(getGuardianOptions()),
  ],
  controllers: [CoupleV1Controller],
})
export class CoupleApiModule {}
