/* eslint-disable @typescript-eslint/unbound-method */
import { CoupleCommandServiceImpl } from './couple-command.service.impl';
import { ICoupleRepository } from '../../couple-core/output/repositories/couple.repository';
import { ICoupleInviteCodeRepository } from '../../couple-core/output/repositories/couple-invite-code.repository';
import { ICoupleCodeGenerator } from '../../couple-core/output/generators/couple-code.generator';
import { ICoupleSseService } from '../../couple-core/input/services/couple-sse.service';
import { IUserQueryService } from '../../../user/user-core/input/services/user-query.service';
import { CoupleInviteCode } from '../../couple-core/couple-invite-code';
import { User } from '../../../user/user-core/user';
import { Couple } from '../../couple-core/couple';

describe('CoupleCommandServiceImpl', () => {
  let service: CoupleCommandServiceImpl;
  let mockCoupleRepo: jest.Mocked<ICoupleRepository>;
  let mockInviteRepo: jest.Mocked<ICoupleInviteCodeRepository>;
  let mockGenerator: jest.Mocked<ICoupleCodeGenerator>;
  let mockSseService: jest.Mocked<ICoupleSseService>;
  let mockUserQueryService: jest.Mocked<IUserQueryService>;

  beforeEach(() => {
    mockCoupleRepo = {
      save: jest.fn().mockImplementation((c: Couple) => Promise.resolve(c)),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      deleteById: jest.fn(),
    };

    mockInviteRepo = {
      save: jest
        .fn()
        .mockImplementation((c: CoupleInviteCode) => Promise.resolve(c)),
      findByCode: jest.fn(),
      findActiveByInviterId: jest.fn(),
      invalidateByInviterId: jest.fn(),
    };

    mockGenerator = {
      generate: jest.fn().mockReturnValue('ABC12345'),
    };

    mockSseService = {
      subscribe: jest.fn(),
      emitCoupleConnected: jest.fn(),
    };

    mockUserQueryService = {
      userInfoById: jest.fn(),
    };

    service = new CoupleCommandServiceImpl(
      mockCoupleRepo,
      mockInviteRepo,
      mockGenerator,
      mockSseService,
      mockUserQueryService,
    );
  });

  describe('connectCouple', () => {
    it('커플 연결 성공 시 초대자에게 SSE couple_connected 이벤트를 발행해야 한다', async () => {
      const inviterId = 'inviter-uuid';
      const receiverId = 'receiver-uuid';
      const inviteCode = new CoupleInviteCode({
        id: 'code-id',
        inviterId,
        code: 'ABC12345',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        isUsed: false,
      });

      mockCoupleRepo.findByUserId.mockResolvedValue(null);
      mockInviteRepo.findByCode.mockResolvedValue(inviteCode);
      mockUserQueryService.userInfoById.mockResolvedValue(
        new User({ id: receiverId, nickname: '수락자닉네임' }),
      );

      const couple = await service.connectCouple(receiverId, 'ABC12345');

      expect(couple.user1Id).toBe(inviterId);
      expect(couple.user2Id).toBe(receiverId);

      expect(mockSseService.emitCoupleConnected).toHaveBeenCalledWith(
        inviterId,
        expect.objectContaining({
          coupleId: couple.id,
          partnerId: receiverId,
          partnerNickname: '수락자닉네임',
        }),
      );
    });
  });
});
