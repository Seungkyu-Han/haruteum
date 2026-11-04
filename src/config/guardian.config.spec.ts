import { getGuardianOptions } from './guardian.config';

describe('getGuardianOptions', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('환경변수가 없을 때 기본 만료 시간(30m, 7d)을 반환해야 한다', () => {
    delete process.env.JWT_ACCESS_TOKEN_EXPIRES_IN;
    delete process.env.ACCESS_TOKEN_EXPIRES_IN;
    delete process.env.JWT_REFRESH_TOKEN_EXPIRES_IN;
    delete process.env.REFRESH_TOKEN_EXPIRES_IN;
    process.env.JWT_SECRET = 'test-secret';

    const options = getGuardianOptions();

    expect(options.accessTokenOptions.secretKey).toBe('test-secret');
    expect(options.accessTokenOptions.expiresIn).toBe('30m');
    expect(options.refreshTokenOptions?.expiresIn).toBe('7d');
  });

  it('환경변수(JWT_ACCESS_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN)가 주어지면 해당 값을 반영해야 한다', () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = '1h';
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN = '14d';

    const options = getGuardianOptions();

    expect(options.accessTokenOptions.expiresIn).toBe('1h');
    expect(options.refreshTokenOptions?.expiresIn).toBe('14d');
  });

  it('보조 환경변수(ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN)도 fallback으로 지원해야 한다', () => {
    delete process.env.JWT_ACCESS_TOKEN_EXPIRES_IN;
    delete process.env.JWT_REFRESH_TOKEN_EXPIRES_IN;
    process.env.ACCESS_TOKEN_EXPIRES_IN = '2h';
    process.env.REFRESH_TOKEN_EXPIRES_IN = '30d';

    const options = getGuardianOptions();

    expect(options.accessTokenOptions.expiresIn).toBe('2h');
    expect(options.refreshTokenOptions?.expiresIn).toBe('30d');
  });
});
