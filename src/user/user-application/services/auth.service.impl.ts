import { Inject } from '@nestjs/common';
import { IAuthService } from '../../user-core/input/services/auth.service';
import type { IUserRepository } from '../../user-core/output/user.repository';
import { USER_REPOSITORY } from '../../user-core/user.token';
import { KakaoOauthService } from './oauth/kakao/kakao.oauth.service';
import { User } from '../../user-core/user';
import { ConfigService } from '@nestjs/config';
import { JwtTokenSchema } from '../../user-core/schema/jwt-token.schema';
import { JwtTokenGenerator, Principal } from '@seungkyu/guardian';
import { JwtService } from '@nestjs/jwt';

export class AuthServiceImpl implements IAuthService {
  private readonly jwtSecret: string;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly kakaoOauthService: KakaoOauthService,
    private readonly configService: ConfigService,
    private readonly jwtTokenGenerator: JwtTokenGenerator,
    private readonly jwtService: JwtService,
  ) {
    this.jwtSecret = this.configService.getOrThrow('JWT_SECRET');
  }
  async reissue(token: string): Promise<JwtTokenSchema> {
    const principal: Principal = await this.jwtService.verifyAsync(token, {
      secret: this.jwtSecret,
    });

    return await this.createTokenByUserId(principal.id, true);
  }

  async oauthLoginByCode(code: string, type: 'kakao') {
    const accessToken = await this.requestAccessToken(code, type);

    return await this.oauthLoginByAccessToken(accessToken, type);
  }

  async oauthLoginByAccessToken(
    accessToken: string,
    type: 'kakao',
  ): Promise<JwtTokenSchema> {
    const oauthId = await this.queryUserInfo(accessToken, type);

    const user = await this.getUserByOauthId(oauthId, type);

    let isEnabled = true;

    if (user.isDeleted()) isEnabled = false;

    return await this.createTokenByUserId(user.id, isEnabled);
  }

  private async requestAccessToken(
    code: string,
    type: 'kakao',
  ): Promise<string> {
    switch (type) {
      case 'kakao': {
        const requestTokenResponseDto =
          await this.kakaoOauthService.requestAccessToken(code);
        return requestTokenResponseDto.access_token;
      }
      default:
        throw new Error('Invalid OAuth type');
    }
  }

  private async queryUserInfo(
    accessToken: string,
    type: 'kakao',
  ): Promise<string> {
    switch (type) {
      case 'kakao': {
        const requestTokenResponseDto =
          await this.kakaoOauthService.queryUserInfo(accessToken);
        return `${requestTokenResponseDto.id}`;
      }
      default:
        throw new Error('Invalid OAuth type');
    }
  }

  private async getUserByOauthId(
    oauthId: string,
    type: 'kakao',
  ): Promise<User> {
    let userId: string | undefined;
    switch (type) {
      case 'kakao': {
        userId = await this.kakaoOauthService.getUserIdByOauthId(oauthId);
        break;
      }
      default:
        throw new Error('Invalid OAuth type');
    }

    return await this.createUserIfNotExists(userId);
  }

  private async createTokenByUserId(
    userId: string,
    isEnabled: boolean,
  ): Promise<JwtTokenSchema> {
    const principal = new Principal(userId, isEnabled);

    const accessToken =
      await this.jwtTokenGenerator.generateAccessToken(principal);

    const refreshToken =
      await this.jwtTokenGenerator.generateRefreshToken(principal);

    return {
      accessToken,
      refreshToken,
      withdraw: !isEnabled,
    };
  }

  private async createUserIfNotExists(id: string): Promise<User> {
    let user = await this.userRepository.findByIdWithDeleted(id);

    if (!user) {
      user = new User({
        id,
      });
      await this.userRepository.save(user);
    }

    return user;
  }

  async withdraw(userId: string): Promise<void> {
    await this.userRepository.deleteById(userId);
  }
}
