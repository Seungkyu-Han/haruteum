import { User } from '../../user';

export interface IAuthService {
  oauthLogin(code: string, type: 'kakao'): Promise<User>;
}
