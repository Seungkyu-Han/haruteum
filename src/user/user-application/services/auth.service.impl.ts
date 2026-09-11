import { Inject } from '@nestjs/common';
import { IAuthService } from '../../user-core/input/services/auth.service';
import type { IUserRepository } from '../../user-core/output/user.repository';
import { NAME_GENERATOR, USER_REPOSITORY } from '../../user-core/user.token';
import { KakaoOauthService } from './oauth/kakao/kakao.oauth.service';
import { User } from '../../user-core/user';
import { ConfigService } from '@nestjs/config';
import { JwtTokenSchema } from '../../user-core/schema/jwt-token.schema';
import { JwtTokenGenerator, Principal } from '@seungkyu/guardian';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredException } from '../../user-core/exceptions/token-expired.exception';
import type { INameGenerator } from '../../user-core/output/name.generator';
import { UserNotFoundException } from '../../user-core/exceptions/user-not-found.exception';

export class AuthServiceImpl implements IAuthService {
  private readonly jwtSecret: string;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(NAME_GENERATOR)
    private readonly nameGenerator: INameGenerator,
    private readonly kakaoOauthService: KakaoOauthService,
    private readonly configService: ConfigService,
    private readonly jwtTokenGenerator: JwtTokenGenerator,
    private readonly jwtService: JwtService,
  ) {
    this.jwtSecret = this.configService.getOrThrow('JWT_SECRET');
  }
  async reissue(token: string): Promise<JwtTokenSchema> {
    try {
      const principal: Principal = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });

      return await this.createTokenByUserId(principal.id, true);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'TokenExpiredError') {
        throw new TokenExpiredException();
      }

      throw new Error('Invalid token');
    }
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

    const name = await this.nameGenerator.generateName();

    if (!user) {
      user = new User({
        id,
        nickname: name,
      });
      await this.userRepository.save(user);
    }

    return user;
  }

  async withdraw(userId: string): Promise<void> {
    const user: User | null = await this.userRepository.findById(userId);

    if (user === null) throw new UserNotFoundException();

    user.withdraw();

    await this.kakaoOauthService.unlink(userId);

    await this.userRepository.save(user);
  }

  async restoreUser(userId: string): Promise<void> {
    const user: User | null =
      await this.userRepository.findByIdWithDeleted(userId);

    if (user === null) throw new UserNotFoundException();

    const nickname = await this.nameGenerator.generateName();

    user.restore(nickname);

    await this.userRepository.save(user);

    await this.userRepository.restore(userId);
  }
}
