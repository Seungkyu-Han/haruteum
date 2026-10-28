import { Module } from '@nestjs/common';
import { CoupleInfraModule } from '../couple-infra/couple-infra.module';
import {
  COUPLE_COMMAND_SERVICE,
  COUPLE_QUERY_SERVICE,
} from '../couple-core/couple.token';
import { CoupleCommandServiceImpl } from './services/couple-command.service.impl';
import { CoupleQueryServiceImpl } from './services/couple-query.service.impl';

@Module({
  imports: [CoupleInfraModule],
  providers: [
    {
      provide: COUPLE_COMMAND_SERVICE,
      useClass: CoupleCommandServiceImpl,
    },
    {
      provide: COUPLE_QUERY_SERVICE,
      useClass: CoupleQueryServiceImpl,
    },
  ],
  exports: [COUPLE_COMMAND_SERVICE, COUPLE_QUERY_SERVICE],
})
export class CoupleApplicationModule {}
