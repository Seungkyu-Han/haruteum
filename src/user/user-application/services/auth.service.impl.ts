import { Inject } from '@nestjs/common';
import { IAuthService } from '../../user-core/input/services/auth.service';
import type { IUserRepository } from '../../user-core/output/user.repository';
import { USER_REPOSITORY } from '../../user-core/user.token';
import { KakaoOauthService } from './oauth/kakao/kakao.oauth.service';
import { User } from '../../user-core/user';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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

  async oauthLogin(code: string, type: 'kakao') {
    let id: string | null = null;

    switch (type) {
      case 'kakao': {
        id = await this.kakaoOauthService.loginOauth(code);
        break;
      }
      default:
        throw new Error('Invalid OAuth type');
    }

    const user: User = await this.createUserIfNotExists(id);

    const payload = { sub: user.id };

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

  async createUserIfNotExists(id: string): Promise<User> {
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
