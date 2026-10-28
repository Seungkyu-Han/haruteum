import { CoupleInviteCode } from '../../couple-invite-code';

export interface ICoupleInviteCodeRepository {
  save(inviteCode: CoupleInviteCode): Promise<CoupleInviteCode>;
  findByCode(code: string): Promise<CoupleInviteCode | null>;
  findActiveByInviterId(inviterId: string): Promise<CoupleInviteCode | null>;
  invalidateByInviterId(inviterId: string): Promise<void>;
}
