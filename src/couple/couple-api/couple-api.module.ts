import { Module } from '@nestjs/common';
import { CoupleApplicationModule } from '../couple-application/couple-application.module';
import { CoupleV1Controller } from './controllers/couple.v1.controller';
import { UserApplicationModule } from '../../user/user-application/user-application.module';

@Module({
  imports: [CoupleApplicationModule, UserApplicationModule],
  controllers: [CoupleV1Controller],
})
export class CoupleApiModule {}
