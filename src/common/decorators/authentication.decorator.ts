import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Principal } from '../types/principal';

export const Authentication = createParamDecorator(
  (data: unknown, context: ExecutionContext): Principal => {
    const request: Request = context.switchToHttp().getRequest<Request>();
    return request.principal;
  },
);
