import { Inject, Injectable, Logger, MessageEvent } from '@nestjs/common';
import { Observable, Subject, from, interval, merge } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ICoupleSseService } from '../../couple-core/input/services/couple-sse.service';
import { CoupleConnectedEvent } from '../../couple-core/events/couple-connected.event';
import { COUPLE_REPOSITORY } from '../../couple-core/couple.token';
import type { ICoupleRepository } from '../../couple-core/output/repositories/couple.repository';
import { USER_QUERY_SERVICE } from '../../../user/user-core/user.token';
import type { IUserQueryService } from '../../../user/user-core/input/services/user-query.service';

@Injectable()
export class CoupleSseServiceImpl implements ICoupleSseService {
  private readonly logger = new Logger(CoupleSseServiceImpl.name);
  private readonly userStreams = new Map<string, Subject<MessageEvent>>();
  private readonly connectionCounts = new Map<string, number>();

  constructor(
    @Inject(COUPLE_REPOSITORY)
    private readonly coupleRepository: ICoupleRepository,
    @Inject(USER_QUERY_SERVICE)
    private readonly userQueryService: IUserQueryService,
  ) {}

  subscribe(userId: string): Observable<MessageEvent> {
    let subject = this.userStreams.get(userId);
    if (!subject) {
      subject = new Subject<MessageEvent>();
      this.userStreams.set(userId, subject);
    }
    const currentCount = this.connectionCounts.get(userId) ?? 0;
    this.connectionCounts.set(userId, currentCount + 1);

    this.logger.log(
      `User ${userId} subscribed to couple SSE stream (active connections: ${currentCount + 1})`,
    );

    const initial$ = from(this.buildInitialEvent(userId));

    // 30초마다 연결 유지를 위한 heartbeat (ping) 전송
    const heartbeat$ = interval(30000).pipe(
      map(
        (): MessageEvent => ({
          type: 'ping',
          data: { timestamp: new Date().toISOString() },
        }),
      ),
    );

    return merge(initial$, subject.asObservable(), heartbeat$).pipe(
      finalize(() => {
        const remainingCount = (this.connectionCounts.get(userId) ?? 1) - 1;
        if (remainingCount <= 0) {
          this.connectionCounts.delete(userId);
          const activeSubject = this.userStreams.get(userId);
          if (activeSubject) {
            activeSubject.complete();
            this.userStreams.delete(userId);
          }
          this.logger.log(`User ${userId} unsubscribed from couple SSE stream`);
        } else {
          this.connectionCounts.set(userId, remainingCount);
          this.logger.log(
            `User ${userId} closed one SSE connection (remaining: ${remainingCount})`,
          );
        }
      }),
    );
  }

  emitCoupleConnected(userId: string, event: CoupleConnectedEvent): void {
    const subject = this.userStreams.get(userId);
    if (subject) {
      this.logger.log(`Emitting couple_connected event to user ${userId}`);
      subject.next({
        type: 'couple_connected',
        data: event,
      });
    } else {
      this.logger.log(
        `User ${userId} does not have an active SSE stream to receive couple_connected event`,
      );
    }
  }

  private async buildInitialEvent(userId: string): Promise<MessageEvent> {
    try {
      const couple = await this.coupleRepository.findByUserId(userId);
      if (couple) {
        const partnerId = couple.getPartnerId(userId);
        let partnerNickname: string | undefined;
        try {
          const partner = await this.userQueryService.userInfoById(partnerId);
          partnerNickname = partner?.nickname;
        } catch {
          partnerNickname = undefined;
        }

        return {
          type: 'couple_connected',
          data: {
            coupleId: couple.id,
            partnerId,
            partnerNickname,
            createdAt: couple.createdAt,
          },
        };
      }
    } catch (e) {
      this.logger.warn(
        `Failed to query initial couple state for user ${userId}: ${e}`,
      );
    }

    return {
      type: 'connected',
      data: {
        message: 'SSE stream connected. Waiting for couple connection...',
        userId,
      },
    };
  }
}
