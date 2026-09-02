import { Repository } from 'typeorm';
import { IKakaoOauthRepository } from '../../user-core/output/kakao-oauth.repository';
import { KakaoOauth } from '../../user-core/kakao-oauth';
import { KakaoOauthEntity } from '../entities/kakao-oauth.entity';
import {
  kakaoOauthToDomain,
  kakaoOauthToEntity,
} from '../mappers/kakao-oauth.mapper';
import { InjectRepository } from '@nestjs/typeorm';

export class KakaoOauthRepositoryPg implements IKakaoOauthRepository {
  constructor(
    @InjectRepository(KakaoOauthEntity)
    private readonly kakaoOauthRepository: Repository<KakaoOauthEntity>,
  ) {}

  async save(kakaoOauth: KakaoOauth): Promise<KakaoOauth> {
    const kakaoOauthEntity = kakaoOauthToEntity(kakaoOauth);

    await this.kakaoOauthRepository.save(kakaoOauthEntity);

    return kakaoOauth;
  }

  async findByKakaoId(kakaoId: number): Promise<KakaoOauth | null> {
    const kakaoOauthEntity = await this.kakaoOauthRepository.findOne({
      where: { kakaoId: Number(kakaoId) },
    });

    if (!kakaoOauthEntity) {
      return null;
    }

    return kakaoOauthToDomain(kakaoOauthEntity);
  }

  async findByUserId(userId: string): Promise<KakaoOauth | null> {
    const kakaoOauthEntity = await this.kakaoOauthRepository.findOne({
      where: { userId },
    });

    if (!kakaoOauthEntity) {
      return null;
    }

    return kakaoOauthToDomain(kakaoOauthEntity);
  }
}
