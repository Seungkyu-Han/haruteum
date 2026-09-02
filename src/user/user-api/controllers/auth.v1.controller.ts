import {
  Controller,
  Delete,
  Get,
  Inject,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { IAuthService } from '../../user-core/input/services/auth.service';
import { AUTH_SERVICE } from '../../user-core/user.token';
import { TokenResponseDto } from '../dto/response/token.response.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import {
  Authentication,
  AuthenticationGuard,
  Principal,
  Public,
} from '@seungkyu/guardian';

@Controller({ path: 'auth', version: '1' })
export class AuthV1Controller {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  @Get('kakao-login-code')
  async kakaoLoginCodeApi(
    @Query('code') code: string,
  ): Promise<TokenResponseDto> {
    const { accessToken, refreshToken } =
      await this.authService.oauthLoginByCode(code, 'kakao');
    return {
      accessToken,
      refreshToken,
    };
  }

  @Get('kakao-login-token')
  @ApiBearerAuth('jwt')
  async kakaoLoginTokenApi(@Req() req: Request): Promise<TokenResponseDto> {
    const authorization = req.headers.authorization ?? '';
    const token = authorization?.replace(/^Bearer\s+/i, '');

    const { accessToken, refreshToken } =
      await this.authService.oauthLoginByAccessToken(token, 'kakao');

    return {
      accessToken,
      refreshToken,
    };
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth('jwt')
  @Get('check')
  @Public()
  checkApi(@Authentication() principal?: Principal) {
    console.log('principal', principal);
    return principal;
  }

  @Get('reissue')
  @ApiBearerAuth('jwt')
  async reissueApi(@Req() req: Request): Promise<TokenResponseDto> {
    const authorization = req.headers.authorization ?? '';
    const token = authorization?.replace(/^Bearer\s+/i, '');

    const { accessToken, refreshToken } = await this.authService.reissue(token);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Delete()
  @ApiBearerAuth('jwt')
  async withdrawApi(@Authentication() principal: Principal) {
    await this.authService.withdraw(principal.id);
  }
}
