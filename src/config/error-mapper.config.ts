import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MapErrorInterceptor } from '@seungkyu/error-mapper';

export function initErrorMapper(app: INestApplication): void {
  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(new MapErrorInterceptor(reflector));
}
