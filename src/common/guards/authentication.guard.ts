import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Principal } from '../types/principal';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly jwtSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtSecret = this.configService.getOrThrow('JWT_SECRET');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    try {
      const payload: { sub: string } = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.jwtSecret,
        },
      );

      request.principal = new Principal(payload.sub);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('token expired');
      }

      throw new UnauthorizedException('invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string {
    const authorization: string | undefined = request.headers.authorization;

    if (!authorization)
      throw new UnauthorizedException('authorization header is missing');

    const splitAuthorization: string[] = authorization.split(' ');

    if (splitAuthorization.length !== 2 || splitAuthorization[0] !== 'Bearer')
      throw new UnauthorizedException('authorization header is malformed');

    return splitAuthorization[1];
  }
}
