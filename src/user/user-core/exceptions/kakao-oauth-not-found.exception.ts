export class KakaoOauthNotFoundException extends Error {
  constructor() {
    super('해당 사용자의 카카오 아이디를 찾을 수 없습니다.');
  }
}
