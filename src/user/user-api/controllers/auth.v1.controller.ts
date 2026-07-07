import { Controller, Get, Inject, Query } from '@nestjs/common';
import type { IAuthService } from '../../user-core/input/services/auth.service';
import { AUTH_SERVICE } from '../../user-core/user.token';

@Controller({ path: 'auth', version: '1' })
export class AuthV1Controller {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  @Get('kakao-login')
  async kakaoLoginApi(@Query('code') code: string): Promise<any> {
    return this.authService.oauthLogin(code, 'kakao');
  }
}
