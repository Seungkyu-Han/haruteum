import { INestApplication } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/**
 * EventSource(SSE) 등 Authorization 헤더를 직접 설정하기 어려운 클라이언트를 위해
 * 쿼리 파라미터(?token= 또는 ?access_token=)로 전달된 토큰을 Authorization 헤더로 매핑합니다.
 */
export function initTokenQuery(app: INestApplication): void {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      const token =
        (req.query?.token as string | undefined) ??
        (req.query?.access_token as string | undefined);
      if (token) {
        req.headers.authorization = `Bearer ${token}`;
      }
    }
    next();
  });
}
