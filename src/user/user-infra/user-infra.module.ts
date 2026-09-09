import { Module } from '@nestjs/common';
import { UserRepositoryPg } from './repositories/user.repository.pg';
import {
  KAKAO_OAUTH_REPOSITORY,
  NAME_GENERATOR,
  USER_REPOSITORY,
} from '../user-core/user.token';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KakaoOauthRepositoryPg } from './repositories/kakao-oauth.repository.pg';
import { KakaoOauthEntity } from './entities/kakao-oauth.entity';
import { NameGeneratorList } from './generator/name.generator.list';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, KakaoOauthEntity])],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryPg,
    },
    {
      provide: KAKAO_OAUTH_REPOSITORY,
      useClass: KakaoOauthRepositoryPg,
    },
    {
      provide: NAME_GENERATOR,
      useClass: NameGeneratorList,
    },
  ],
  exports: [USER_REPOSITORY, KAKAO_OAUTH_REPOSITORY, NAME_GENERATOR],
})
export class UserInfraModule {}
