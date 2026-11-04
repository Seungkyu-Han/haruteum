import { GuardianModuleOptions } from '@seungkyu/guardian';
import { StringValue } from 'ms';

/**
 * AccessToken 및 RefreshToken 만료 시간을 환경변수에서 로드하여
 * GuardianModule 옵션을 구성합니다.
 *
 * 환경변수:
 * - JWT_ACCESS_TOKEN_EXPIRES_IN (기본값: '30m')
 * - JWT_REFRESH_TOKEN_EXPIRES_IN (기본값: '7d')
 * - JWT_SECRET
 */
export function getGuardianOptions(): GuardianModuleOptions {
  const secretKey = process.env.JWT_SECRET ?? '';
  const accessTokenExpiresIn = (process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ??
    process.env.ACCESS_TOKEN_EXPIRES_IN ??
    '30m') as StringValue;
  const refreshTokenExpiresIn = (process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ??
    process.env.REFRESH_TOKEN_EXPIRES_IN ??
    '7d') as StringValue;

  return {
    accessTokenOptions: {
      secretKey,
      expiresIn: accessTokenExpiresIn,
    },
    refreshTokenOptions: {
      secretKey,
      expiresIn: refreshTokenExpiresIn,
    },
  };
}
