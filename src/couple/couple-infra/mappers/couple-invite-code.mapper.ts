import { CoupleInviteCode } from '../../couple-core/couple-invite-code';
import { CoupleInviteCodeEntity } from '../entities/couple-invite-code.entity';

export function coupleInviteCodeToDomain(
  entity: CoupleInviteCodeEntity,
): CoupleInviteCode {
  return new CoupleInviteCode({
    id: entity.id,
    inviterId: entity.inviterId,
    code: entity.code,
    expiresAt: entity.expiresAt,
    isUsed: entity.isUsed,
    createdAt: entity.createdAt,
  });
}

export function coupleInviteCodeToEntity(
  domain: CoupleInviteCode,
): CoupleInviteCodeEntity {
  return {
    id: domain.id,
    inviterId: domain.inviterId,
    code: domain.code,
    expiresAt: domain.expiresAt,
    isUsed: domain.isUsed,
    createdAt: domain.createdAt,
  } as CoupleInviteCodeEntity;
}
