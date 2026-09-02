import { JwtTokenSchema } from '../../schema/jwt-token.schema';

export interface IAuthService {
  oauthLoginByCode(code: string, type: 'kakao'): Promise<JwtTokenSchema>;
  oauthLoginByAccessToken(
    accessToken: string,
    type: 'kakao',
  ): Promise<JwtTokenSchema>;
  reissue(token: string): Promise<JwtTokenSchema>;
  withdraw(userId: string): Promise<void>;
}
