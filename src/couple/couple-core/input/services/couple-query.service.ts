import { Couple } from '../../couple';
import { CoupleInviteCode } from '../../couple-invite-code';

export interface ICoupleQueryService {
  getMyCouple(userId: string): Promise<Couple>;
  getValidInviteCode(userId: string): Promise<CoupleInviteCode | null>;
}
