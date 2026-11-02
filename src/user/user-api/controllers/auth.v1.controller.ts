import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
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
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import {
  Authentication,
  AuthenticationGuard,
  Principal,
  Public,
} from '@seungkyu/guardian';
import { MapError } from '@seungkyu/error-mapper';
import { TokenExpiredException } from '../../user-core/exceptions/token-expired.exception';
import { InvalidTokenException } from '../../user-core/exceptions/invalid-token.exception';
import { OAuthFailedException } from '../../user-core/exceptions/oauth-failed.exception';
import { KakaoOauthNotFoundException } from '../../user-core/exceptions/kakao-oauth-not-found.exception';
import { UserNotFoundException } from '../../user-core/exceptions/user-not-found.exception';

@ApiTags('인증 API')
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
    status: HttpStatus.BAD_REQUEST,
    description: '유효하지 않은 인가 코드이거나 카카오 인증에 실패했습니다.',
  })
  @MapError({
    sourceError: OAuthFailedException,
    status: HttpStatus.BAD_REQUEST,
  })
  async kakaoLoginCodeApi(
    @Query('code') code: string,
  ): Promise<TokenResponseDto> {
    const { accessToken, refreshToken, withdraw } =
      await this.authService.oauthLoginByCode(code, 'kakao');
    return {
      accessToken,
      refreshToken,
      withdraw,
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
    status: HttpStatus.BAD_REQUEST,
    description: '유효하지 않은 토큰이거나 카카오 인증에 실패했습니다.',
  })
  @MapError({
    sourceError: OAuthFailedException,
    status: HttpStatus.BAD_REQUEST,
  })
  async kakaoLoginTokenApi(@Req() req: Request): Promise<TokenResponseDto> {
    const authorization = req.headers.authorization ?? '';
    const token = authorization?.replace(/^Bearer\s+/i, '');

    const { accessToken, refreshToken, withdraw } =
      await this.authService.oauthLoginByAccessToken(token, 'kakao');

    return {
      accessToken,
      refreshToken,
      withdraw,
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: '토큰 재발급에 성공했습니다',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '해당 토큰이 만료되었거나 유효하지 않습니다.',
  })
  @MapError({
    sourceError: TokenExpiredException,
    status: HttpStatus.UNAUTHORIZED,
  })
  @MapError({
    sourceError: InvalidTokenException,
    status: HttpStatus.UNAUTHORIZED,
  })
  async reissueApi(@Req() req: Request): Promise<TokenResponseDto> {
    const authorization = req.headers.authorization ?? '';
    const token = authorization?.replace(/^Bearer\s+/i, '');

    const { accessToken, refreshToken } = await this.authService.reissue(token);

    return {
      accessToken,
      refreshToken,
      withdraw: false,
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
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '해당 사용자 또는 카카오 연동 정보를 찾을 수 없습니다.',
  })
  @MapError({
    sourceError: UserNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  @MapError({
    sourceError: KakaoOauthNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  async withdrawApi(@Authentication() principal: Principal) {
    await this.authService.withdraw(principal.id);
  }

  @Post('me/restore')
  @UseGuards(AuthenticationGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: '탈퇴한 사용자를 복구합니다..',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '복구 성공했습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '복구할 사용자를 찾을 수 없습니다.',
  })
  @MapError({
    sourceError: UserNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  async restoreUserApi(@Authentication() principal: Principal) {
    await this.authService.restoreUser(principal.id);
  }
}
