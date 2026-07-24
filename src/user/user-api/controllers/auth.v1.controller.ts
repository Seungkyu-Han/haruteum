import {
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { IAuthService } from '../../user-core/input/services/auth.service';
import { AUTH_SERVICE } from '../../user-core/user.token';
import { TokenResponseDto } from '../dto/response/token.response.dto';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { Authentication } from '../../../common/decorators/authentication.decorator';
import { Principal } from '../../../common/types/principal';
import { ApiBearerAuth } from '@nestjs/swagger';

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

  @Post('kakao-login-token')
  async kakaoLoginTokenApi(
    @Headers('authorization') token: string,
  ): Promise<TokenResponseDto> {
    const { accessToken, refreshToken } =
      await this.authService.oauthLoginByAccessToken(token, 'kakao');
    return {
      accessToken,
      refreshToken,
    };
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth('jwt') // 👈 initSwagger의 'jwt' 키와 매칭!
  @Get('check')
  checkApi(@Authentication() principal: Principal) {
    return principal;
  }
}
