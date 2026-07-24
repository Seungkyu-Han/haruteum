import { Inject } from '@nestjs/common';
import { IAuthService } from '../../user-core/input/services/auth.service';
import type { IUserRepository } from '../../user-core/output/user.repository';
import { USER_REPOSITORY } from '../../user-core/user.token';
import { KakaoOauthService } from './oauth/kakao/kakao.oauth.service';
import { User } from '../../user-core/user';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtTokenSchema } from '../../user-core/schema/jwt-token.schema';

export class AuthServiceImpl implements IAuthService {
  private readonly jwtSecret: string;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly kakaoOauthService: KakaoOauthService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtSecret = this.configService.getOrThrow('JWT_SECRET');
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

    return await this.createTokenByUserId(user.id);
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

  private async createTokenByUserId(userId: string): Promise<JwtTokenSchema> {
    const payload = { sub: userId };

    const accessToken = await this.jwtService.signAsync(
      { ...payload, type: 'access' },
      {
        secret: this.jwtSecret,
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { ...payload, type: 'refresh' },
      {
        secret: this.jwtSecret,
        expiresIn: '20m',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  private async createUserIfNotExists(id: string): Promise<User> {
    let user = await this.userRepository.findById(id);

    if (!user) {
      user = new User({
        id,
      });
      await this.userRepository.save(user);
    }

    return user;
  }
}
