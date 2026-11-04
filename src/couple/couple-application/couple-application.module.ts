import { Module } from '@nestjs/common';
import { CoupleInfraModule } from '../couple-infra/couple-infra.module';
import { UserApplicationModule } from '../../user/user-application/user-application.module';
import {
  COUPLE_COMMAND_SERVICE,
  COUPLE_QUERY_SERVICE,
  COUPLE_SSE_SERVICE,
} from '../couple-core/couple.token';
import { CoupleCommandServiceImpl } from './services/couple-command.service.impl';
import { CoupleQueryServiceImpl } from './services/couple-query.service.impl';
import { CoupleSseServiceImpl } from './services/couple-sse.service.impl';

@Module({
  imports: [CoupleInfraModule, UserApplicationModule],
  providers: [
    {
      provide: COUPLE_COMMAND_SERVICE,
      useClass: CoupleCommandServiceImpl,
    },
    {
      provide: COUPLE_QUERY_SERVICE,
      useClass: CoupleQueryServiceImpl,
    },
    {
      provide: COUPLE_SSE_SERVICE,
      useClass: CoupleSseServiceImpl,
    },
  ],
  exports: [COUPLE_COMMAND_SERVICE, COUPLE_QUERY_SERVICE, COUPLE_SSE_SERVICE],
})
export class CoupleApplicationModule {}
