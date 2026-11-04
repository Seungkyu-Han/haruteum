import { MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CoupleConnectedEvent } from '../../events/couple-connected.event';

export interface ICoupleSseService {
  subscribe(userId: string): Observable<MessageEvent>;
  emitCoupleConnected(userId: string, event: CoupleConnectedEvent): void;
}
