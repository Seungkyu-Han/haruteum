import { JwtTokenSchema } from '../../schema/jwt-token.schema';

export interface IAuthService {
  oauthLogin(code: string, type: 'kakao'): Promise<JwtTokenSchema>;
}
