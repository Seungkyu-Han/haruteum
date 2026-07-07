import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UserInfraModule } from '../user-infra/user-infra.module';
import { AUTH_SERVICE } from '../user-core/user.token';
import { AuthServiceImpl } from './services/auth.service.impl';
import { KakaoOauthService } from './services/oauth/kakao/kakao.oauth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    UserInfraModule,
    ConfigModule.forRoot({ isGlobal: false }),
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
