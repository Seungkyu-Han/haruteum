import { Inject, Injectable } from '@nestjs/common';
import { ICoupleCommandService } from '../../couple-core/input/services/couple-command.service';
import {
  COUPLE_CODE_GENERATOR,
  COUPLE_INVITE_CODE_REPOSITORY,
  COUPLE_REPOSITORY,
} from '../../couple-core/couple.token';
import type { ICoupleRepository } from '../../couple-core/output/repositories/couple.repository';
import type { ICoupleInviteCodeRepository } from '../../couple-core/output/repositories/couple-invite-code.repository';
import type { ICoupleCodeGenerator } from '../../couple-core/output/generators/couple-code.generator';
import { CoupleInviteCode } from '../../couple-core/couple-invite-code';
import { Couple } from '../../couple-core/couple';
import { AlreadyInCoupleException } from '../../couple-core/exceptions/already-in-couple.exception';
import { InvalidCoupleCodeException } from '../../couple-core/exceptions/invalid-couple-code.exception';
import { CoupleCodeExpiredException } from '../../couple-core/exceptions/couple-code-expired.exception';
import { CoupleCodeAlreadyUsedException } from '../../couple-core/exceptions/couple-code-already-used.exception';
import { CannotCoupleWithSelfException } from '../../couple-core/exceptions/cannot-couple-with-self.exception';
import { CoupleNotFoundException } from '../../couple-core/exceptions/couple-not-found.exception';

@Injectable()
export class CoupleCommandServiceImpl implements ICoupleCommandService {
  private static readonly CODE_EXPIRATION_HOURS = 24;

  constructor(
    @Inject(COUPLE_REPOSITORY)
    private readonly coupleRepository: ICoupleRepository,
    @Inject(COUPLE_INVITE_CODE_REPOSITORY)
    private readonly coupleInviteCodeRepository: ICoupleInviteCodeRepository,
    @Inject(COUPLE_CODE_GENERATOR)
    private readonly coupleCodeGenerator: ICoupleCodeGenerator,
  ) {}

  async generateInviteCode(userId: string): Promise<CoupleInviteCode> {
    const existingCouple = await this.coupleRepository.findByUserId(userId);
    if (existingCouple) {
      throw new AlreadyInCoupleException();
    }

    // 기존 활성 코드가 있으면 그대로 재사용
    const activeCode =
      await this.coupleInviteCodeRepository.findActiveByInviterId(userId);
    if (activeCode) {
      return activeCode;
    }

    // 기존 만료/미사용 코드 무효화
    await this.coupleInviteCodeRepository.invalidateByInviterId(userId);

    // 중복되지 않는 새로운 코드 생성 (최대 5회 재시도)
    let code = '';
    for (let i = 0; i < 5; i++) {
      const candidate = this.coupleCodeGenerator.generate();
      const duplicate =
        await this.coupleInviteCodeRepository.findByCode(candidate);
      if (!duplicate) {
        code = candidate;
        break;
      }
    }

    if (!code) {
      throw new Error('초대 코드 생성에 실패했습니다. 다시 시도해주세요.');
    }

    const expiresAt = new Date();
    expiresAt.setHours(
      expiresAt.getHours() + CoupleCommandServiceImpl.CODE_EXPIRATION_HOURS,
    );

    const inviteCode = new CoupleInviteCode({
      inviterId: userId,
      code,
      expiresAt,
    });

    return await this.coupleInviteCodeRepository.save(inviteCode);
  }

  async connectCouple(userId: string, code: string): Promise<Couple> {
    const normalizedCode = code.trim().toUpperCase();

    // 1. 받는 유저가 이미 커플인지 확인
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
      inviteCode.invalidate();
      await this.coupleInviteCodeRepository.save(inviteCode);
      throw new AlreadyInCoupleException(
        '상대방이 이미 다른 사용자와 커플로 연결되어 있습니다.',
      );
    }

    // 5. 커플 성사 및 저장
    const couple = new Couple({
      user1Id: inviteCode.inviterId,
      user2Id: userId,
    });
    await this.coupleRepository.save(couple);

    // 6. 초대 코드 사용 완료 처리
    inviteCode.use();
    await this.coupleInviteCodeRepository.save(inviteCode);

    // 7. 양쪽 유저의 남은 초대 코드들 무효화
    await this.coupleInviteCodeRepository.invalidateByInviterId(
      inviteCode.inviterId,
    );
    await this.coupleInviteCodeRepository.invalidateByInviterId(userId);

    return couple;
  }

  async disconnectCouple(userId: string): Promise<void> {
    const couple = await this.coupleRepository.findByUserId(userId);
    if (!couple) {
      throw new CoupleNotFoundException();
    }
    await this.coupleRepository.deleteById(couple.id);
  }
}
