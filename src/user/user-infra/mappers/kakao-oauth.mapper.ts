import { KakaoOauth } from '../../user-core/kakao-oauth';
import { KakaoOauthEntity } from '../entities/kakao-oauth.entity';

export function kakaoOauthToDomain(
  kakaoOauthEntity: KakaoOauthEntity,
): KakaoOauth {
  return new KakaoOauth({
    id: kakaoOauthEntity.id,
    kakaoId: kakaoOauthEntity.kakaoId,
    userId: kakaoOauthEntity.userId,
  });
}

export function kakaoOauthToEntity(kakaoOauth: KakaoOauth): KakaoOauthEntity {
  return {
    id: kakaoOauth.id,
    kakaoId: kakaoOauth.kakaoId,
    userId: kakaoOauth.userId,
  };
}
