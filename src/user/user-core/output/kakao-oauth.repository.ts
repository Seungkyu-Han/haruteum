import { KakaoOauth } from '../kakao-oauth';

export interface IKakaoOauthRepository {
  save(kakaoOauth: KakaoOauth): Promise<KakaoOauth>;
  findByKakaoId(kakaoId: number): Promise<KakaoOauth | null>;
}
