import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoupleEntity } from './entities/couple.entity';
import { CoupleInviteCodeEntity } from './entities/couple-invite-code.entity';
import { CoupleRepositoryPg } from './repositories/couple.repository.pg';
import { CoupleInviteCodeRepositoryPg } from './repositories/couple-invite-code.repository.pg';
import { RandomCoupleCodeGenerator } from './generators/random-couple-code.generator';
import {
  COUPLE_CODE_GENERATOR,
  COUPLE_INVITE_CODE_REPOSITORY,
  COUPLE_REPOSITORY,
} from '../couple-core/couple.token';

@Module({
  imports: [TypeOrmModule.forFeature([CoupleEntity, CoupleInviteCodeEntity])],
  providers: [
    {
      provide: COUPLE_REPOSITORY,
      useClass: CoupleRepositoryPg,
    },
    {
      provide: COUPLE_INVITE_CODE_REPOSITORY,
      useClass: CoupleInviteCodeRepositoryPg,
    },
    {
      provide: COUPLE_CODE_GENERATOR,
      useClass: RandomCoupleCodeGenerator,
    },
  ],
  exports: [
    COUPLE_REPOSITORY,
    COUPLE_INVITE_CODE_REPOSITORY,
    COUPLE_CODE_GENERATOR,
  ],
})
export class CoupleInfraModule {}
