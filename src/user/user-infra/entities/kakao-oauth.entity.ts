import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('kakao_oauth')
export class KakaoOauthEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'bigint', unique: true })
  kakaoId: number;

  @Column({ type: 'uuid', unique: true })
  userId: string;
}
