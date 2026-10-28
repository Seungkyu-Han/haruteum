import { Module } from '@nestjs/common';
import { CoupleApiModule } from './couple-api/couple-api.module';

@Module({
  imports: [CoupleApiModule],
})
export class CoupleModule {}
