export class OAuthFailedException extends Error {
  constructor(message = 'OAuth 인증 처리에 실패했습니다.') {
    super(message);
  }
}
