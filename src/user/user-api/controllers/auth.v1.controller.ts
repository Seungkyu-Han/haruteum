import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { IAuthService } from '../../user-core/input/services/auth.service';
import { AUTH_SERVICE } from '../../user-core/user.token';
import { TokenResponseDto } from '../dto/response/token.response.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import {
  Authentication,
  AuthenticationGuard,
  Principal,
  Public,
} from '@seungkyu/guardian';
import { MapError } from '@seungkyu/error-mapper';
import { WithdrawUserException } from '../../user-core/exceptions/withdraw-user.exception';

@Controller({ path: 'auth', version: '1' })
export class AuthV1Controller {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  @Get('kakao-login-code')
  @ApiOperation({
    summary: '카카오 인가 코드로 로그인',
    description: '카카오 OAuth 인가 코드를 받아 토큰을 발급합니다.',
  })
  @ApiQuery({
    name: 'code',
    required: true,
    description: '카카오 OAuth 인가 코드',
    example: 'abc-123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그인 성공',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '탈퇴한 회원입니다.',
  })
  @MapError({
    sourceError: WithdrawUserException,
    status: HttpStatus.NOT_FOUND,
  })
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
  @ApiOperation({
    summary: '카카오 인가 토큰으로 로그인',
    description: '카카오 OAuth 토큰으로 서비스의 토큰을 발급합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그인 성공',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '탈퇴한 회원입니다.',
  })
  @MapError({
    sourceError: WithdrawUserException,
    status: HttpStatus.NOT_FOUND,
  })
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

  @Delete('me')
  @UseGuards(AuthenticationGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: '해당 사용자를 탈퇴처리합니다.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '탈퇴 성공했습니다.',
  })
  async withdrawApi(@Authentication() principal: Principal) {
    await this.authService.withdraw(principal.id);
  }
}
