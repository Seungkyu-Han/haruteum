import { Couple } from '../../couple';
import { CoupleInviteCode } from '../../couple-invite-code';

export interface ICoupleCommandService {
  generateInviteCode(userId: string): Promise<CoupleInviteCode>;
  connectCouple(userId: string, code: string): Promise<Couple>;
  disconnectCouple(userId: string): Promise<void>;
}
