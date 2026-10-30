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
import { AlreadyInCoupleException } from '../../couple-core/exceptions/already-in-couple.exception';
import { InvalidCoupleCodeException } from '../../couple-core/exceptions/invalid-couple-code.exception';
import { CoupleCodeAlreadyUsedException } from '../../couple-core/exceptions/couple-code-already-used.exception';
import { CoupleCodeExpiredException } from '../../couple-core/exceptions/couple-code-expired.exception';
import { CannotCoupleWithSelfException } from '../../couple-core/exceptions/cannot-couple-with-self.exception';

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

  async validateInviteCode(
    userId: string,
    code: string,
  ): Promise<CoupleInviteCode> {
    const normalizedCode = code.trim().toUpperCase();

    // 1. 요청한 유저가 이미 커플인지 확인
    const userCouple = await this.coupleRepository.findByUserId(userId);
    if (userCouple) {
      throw new AlreadyInCoupleException('이미 커플로 연결되어 있는 사용자입니다.');
    }

    // 2. 초대 코드 조회
    const inviteCode =
      await this.coupleInviteCodeRepository.findByCode(normalizedCode);
    if (!inviteCode) {
      throw new InvalidCoupleCodeException();
    }

    // 3. 코드 유효성 검증
    if (inviteCode.isUsed) {
      throw new CoupleCodeAlreadyUsedException();
    }

    if (inviteCode.isExpired()) {
      throw new CoupleCodeExpiredException();
    }

    if (inviteCode.inviterId === userId) {
      throw new CannotCoupleWithSelfException();
    }

    // 4. 보낸 유저가 이미 커플인지 확인
    const inviterCouple = await this.coupleRepository.findByUserId(
      inviteCode.inviterId,
    );
    if (inviterCouple) {
      throw new AlreadyInCoupleException('초대한 사용자가 이미 커플 상태입니다.');
    }

    return inviteCode;
  }
}
