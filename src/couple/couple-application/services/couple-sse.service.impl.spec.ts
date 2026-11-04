import { firstValueFrom, take, toArray } from 'rxjs';
import { CoupleSseServiceImpl } from './couple-sse.service.impl';
import { ICoupleRepository } from '../../couple-core/output/repositories/couple.repository';
import { IUserQueryService } from '../../../user/user-core/input/services/user-query.service';
import { Couple } from '../../couple-core/couple';
import { User } from '../../../user/user-core/user';

describe('CoupleSseServiceImpl', () => {
  let sseService: CoupleSseServiceImpl;
  let mockCoupleRepo: jest.Mocked<ICoupleRepository>;
  let mockUserQueryService: jest.Mocked<IUserQueryService>;

  beforeEach(() => {
    mockCoupleRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      deleteById: jest.fn(),
    };

    mockUserQueryService = {
      userInfoById: jest.fn(),
    };

    sseService = new CoupleSseServiceImpl(mockCoupleRepo, mockUserQueryService);
  });

  it('커플 상태가 아닐 때 구독하면 initial connected 이벤트를 방출해야 한다', async () => {
    mockCoupleRepo.findByUserId.mockResolvedValue(null);

    const stream$ = sseService.subscribe('user-1');
    const firstEvent = await firstValueFrom(stream$);

    expect(firstEvent.type).toBe('connected');
    expect(firstEvent.data).toEqual({
      message: 'SSE stream connected. Waiting for couple connection...',
      userId: 'user-1',
    });
  });

  it('이미 커플 상태일 때 구독하면 couple_connected 이벤트를 즉시 방출해야 한다', async () => {
    const couple = new Couple({
      id: 'couple-1',
      user1Id: 'user-1',
      user2Id: 'user-2',
      createdAt: new Date(),
    });
    mockCoupleRepo.findByUserId.mockResolvedValue(couple);
    mockUserQueryService.userInfoById.mockResolvedValue(
      new User({
        id: 'user-2',
        nickname: '상대방닉네임',
      }),
    );

    const stream$ = sseService.subscribe('user-1');
    const firstEvent = await firstValueFrom(stream$);

    expect(firstEvent.type).toBe('couple_connected');
    expect(firstEvent.data).toEqual({
      coupleId: 'couple-1',
      partnerId: 'user-2',
      partnerNickname: '상대방닉네임',
      createdAt: couple.createdAt,
    });
  });

  it('emitCoupleConnected 호출 시 구독자에게 couple_connected 이벤트가 전달되어야 한다', async () => {
    mockCoupleRepo.findByUserId.mockResolvedValue(null);

    const stream$ = sseService.subscribe('inviter-user');

    const receivedEventsPromise = firstValueFrom(
      stream$.pipe(take(2), toArray()),
    );

    // initial 비동기 이벤트가 먼저 처리된 후 커플 연결 이벤트 방출
    await new Promise((resolve) => setTimeout(resolve, 10));

    const testCreatedAt = new Date();
    sseService.emitCoupleConnected('inviter-user', {
      coupleId: 'couple-xyz',
      partnerId: 'joined-user',
      partnerNickname: '철수',
      createdAt: testCreatedAt,
    });

    const events = await receivedEventsPromise;

    expect(events[0].type).toBe('connected');
    expect(events[1].type).toBe('couple_connected');
    const secondEventData = events[1].data as {
      coupleId: string;
      partnerId: string;
      partnerNickname: string;
      createdAt: Date;
    };
    expect(secondEventData.coupleId).toBe('couple-xyz');
    expect(secondEventData.partnerId).toBe('joined-user');
    expect(secondEventData.partnerNickname).toBe('철수');
    expect(secondEventData.createdAt).toBe(testCreatedAt);
  });
});
