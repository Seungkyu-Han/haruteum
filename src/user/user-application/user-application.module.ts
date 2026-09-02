import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UserInfraModule } from '../user-infra/user-infra.module';
import { AUTH_SERVICE, USER_QUERY_SERVICE } from '../user-core/user.token';
import { AuthServiceImpl } from './services/auth.service.impl';
import { KakaoOauthService } from './services/oauth/kakao/kakao.oauth.service';
import { JwtModule } from '@nestjs/jwt';
import { GuardianModule } from '@seungkyu/guardian';
import { UserQueryServiceImpl } from './services/user-query.service.impl';

@Module({
  imports: [
    HttpModule,
    UserInfraModule,
    JwtModule,
    GuardianModule.forRoot({
      accessTokenOptions: {
        secretKey: process.env.JWT_SECRET ?? '',
      },
    }),
  ],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthServiceImpl,
    },
    {
      provide: USER_QUERY_SERVICE,
      useClass: UserQueryServiceImpl,
    },
    KakaoOauthService,
  ],
  exports: [AUTH_SERVICE, USER_QUERY_SERVICE],
})
export class UserApplicationModule {}
