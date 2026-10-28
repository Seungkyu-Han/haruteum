import { Inject, Injectable } from '@nestjs/common';
import { ICoupleQueryService } from '../../couple-core/input/services/couple-query.service';
import {
  COUPLE_INVITE_CODE_REPOSITORY,
  COUPLE_REPOSITORY,
} from '../../couple-core/couple.token';
import type { ICoupleRepository } from '../../couple-core/output/repositories/couple.repository';
import type { ICoupleInviteCodeRepository } from '../../couple-core/output/repositories/couple-invite-code.repository';
import { Couple } from '../../couple-core/couple';
import { CoupleInviteCode } from '../../couple-core/couple-invite-code';
import { CoupleNotFoundException } from '../../couple-core/exceptions/couple-not-found.exception';

@Injectable()
export class CoupleQueryServiceImpl implements ICoupleQueryService {
  constructor(
    @Inject(COUPLE_REPOSITORY)
    private readonly coupleRepository: ICoupleRepository,
    @Inject(COUPLE_INVITE_CODE_REPOSITORY)
    private readonly coupleInviteCodeRepository: ICoupleInviteCodeRepository,
  ) {}

  async getMyCouple(userId: string): Promise<Couple> {
    const couple = await this.coupleRepository.findByUserId(userId);
    if (!couple) {
      throw new CoupleNotFoundException();
    }
    return couple;
  }

  async getValidInviteCode(userId: string): Promise<CoupleInviteCode | null> {
    return await this.coupleInviteCodeRepository.findActiveByInviterId(userId);
  }
}
