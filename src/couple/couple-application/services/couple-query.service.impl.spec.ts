/* eslint-disable @typescript-eslint/unbound-method */
import { CoupleQueryServiceImpl } from './couple-query.service.impl';
import { ICoupleRepository } from '../../couple-core/output/repositories/couple.repository';
import { ICoupleInviteCodeRepository } from '../../couple-core/output/repositories/couple-invite-code.repository';
import { Couple } from '../../couple-core/couple';

describe('CoupleQueryServiceImpl', () => {
  let service: CoupleQueryServiceImpl;
  let mockCoupleRepo: jest.Mocked<ICoupleRepository>;
  let mockInviteRepo: jest.Mocked<ICoupleInviteCodeRepository>;

  beforeEach(() => {
    mockCoupleRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      deleteById: jest.fn(),
    };

    mockInviteRepo = {
      save: jest.fn(),
      findByCode: jest.fn(),
      findActiveByInviterId: jest.fn(),
      invalidateByInviterId: jest.fn(),
    };

    service = new CoupleQueryServiceImpl(mockCoupleRepo, mockInviteRepo);
  });

  describe('findCoupleByUserId', () => {
    it('커플이 존재하면 해당 커플 엔티티를 반환해야 한다', async () => {
      const couple = new Couple({
        id: 'couple-1',
        user1Id: 'user-1',
        user2Id: 'user-2',
      });
      mockCoupleRepo.findByUserId.mockResolvedValue(couple);

      const result = await service.findCoupleByUserId('user-1');

      expect(result).toBe(couple);
      expect(mockCoupleRepo.findByUserId).toHaveBeenCalledWith('user-1');
    });

    it('커플이 존재하지 않으면 null을 반환해야 한다', async () => {
      mockCoupleRepo.findByUserId.mockResolvedValue(null);

      const result = await service.findCoupleByUserId('user-1');

      expect(result).toBeNull();
      expect(mockCoupleRepo.findByUserId).toHaveBeenCalledWith('user-1');
    });
  });
});
