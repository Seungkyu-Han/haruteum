import { Inject } from '@nestjs/common';
import { IAuthService } from '../../user-core/input/services/auth.service';
import type { IUserRepository } from '../../user-core/output/user.repository';
import { USER_REPOSITORY } from '../../user-core/user.token';
import { KakaoOauthService } from './oauth/kakao/kakao.oauth.service';
import { User } from '../../user-core/user';

export class AuthServiceImpl implements IAuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly kakaoOauthService: KakaoOauthService,
  ) {}
  async oauthLogin(code: string, type: 'kakao'): Promise<User> {
    let id: string | null = null;

    switch (type) {
      case 'kakao': {
        id = await this.kakaoOauthService.loginOauth(code);
        break;
      }
      default:
        throw new Error('Invalid OAuth type');
    }

    let user: User | null = await this.userRepository.findById(id);

    if (!user) {
      user = new User({
        id,
        createdAt: new Date(),
      });
      await this.userRepository.save(user);
    }

    return user;
  }
}
