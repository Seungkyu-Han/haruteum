import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UserInfraModule } from '../user-infra/user-infra.module';
import { AUTH_SERVICE } from '../user-core/user.token';
import { AuthServiceImpl } from './services/auth.service.impl';
import { KakaoOauthService } from './services/oauth/kakao/kakao.oauth.service';
import { JwtModule } from '@nestjs/jwt';
import { GuardianModule } from '@seungkyu/guardian';

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
    KakaoOauthService,
  ],
  exports: [AUTH_SERVICE],
})
export class UserApplicationModule {}
