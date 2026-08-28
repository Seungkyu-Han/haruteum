import { ConfigService } from '@nestjs/config';
import { RequestTokenResponseDto } from './dto/response/request-token.response.dto';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { QueryUserInfoResponseDto } from './dto/response/query-user-info.response.dto';
import type { IKakaoOauthRepository } from '../../../../user-core/output/kakao-oauth.repository';
import { KakaoOauth } from '../../../../user-core/kakao-oauth';
import { KAKAO_OAUTH_REPOSITORY } from '../../../../user-core/user.token';

@Injectable()
export class KakaoOauthService {
  private readonly clientId: string;
  private readonly kakaoRedirectUri: string;
  private readonly kakaoTokenServer = 'https://kauth.kakao.com/oauth/token';
  private readonly kakaoUserServer = 'https://kapi.kakao.com/v2/user/me';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(KAKAO_OAUTH_REPOSITORY)
    private readonly kakaoOauthRepository: IKakaoOauthRepository,
  ) {
    this.clientId = this.configService.getOrThrow<string>('KAKAO_CLIENT_ID');
    this.kakaoRedirectUri =
      this.configService.getOrThrow<string>('KAKAO_REDIRECT_URI');
  }

  async requestAccessToken(code: string): Promise<RequestTokenResponseDto> {
    const payload = {
      grant_type: 'authorization_code',
      client_id: this.clientId,
      redirect_uri: this.kakaoRedirectUri,
      code: code,
    };

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };

    const response = await firstValueFrom(
      this.httpService.post<RequestTokenResponseDto>(
        this.kakaoTokenServer,
        payload,
        config,
      ),
    );

    const data = response.data;

    return new RequestTokenResponseDto(
      data.token_type,
      data.access_token,
      data.id_token,
      data.refresh_token,
      data.expires_in,
      data.refresh_token_expires_in,
      data.scope,
    );
  }

  async queryUserInfo(accessToken: string): Promise<QueryUserInfoResponseDto> {
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await firstValueFrom(
      this.httpService.get<QueryUserInfoResponseDto>(
        this.kakaoUserServer,
        config,
      ),
    );

    const data = response.data;

    return new QueryUserInfoResponseDto(data.id);
  }

  async getUserIdByOauthId(oauthId: string): Promise<string> {
    const oauthNumberId = +oauthId;

    const kakaoOauth =
      await this.kakaoOauthRepository.findByKakaoId(oauthNumberId);

    if (kakaoOauth) {
      return kakaoOauth.userId;
    }

    const newKakaoOauth = new KakaoOauth({
      kakaoId: oauthNumberId,
    });

    const savedKakaoOauth = await this.kakaoOauthRepository.save(newKakaoOauth);

    return savedKakaoOauth.userId;
  }

  async loginOauth(code: string): Promise<string> {
    const tokenResponse = await this.requestAccessToken(code);
    const userInfoResponse: QueryUserInfoResponseDto = await this.queryUserInfo(
      tokenResponse.access_token,
    );

    const kakaoOauth = await this.kakaoOauthRepository.findByKakaoId(
      userInfoResponse.id,
    );

    if (kakaoOauth) {
      return kakaoOauth.userId;
    }

    const newKakaoOauth = new KakaoOauth({
      kakaoId: userInfoResponse.id,
    });

    const savedKakaoOauth = await this.kakaoOauthRepository.save(newKakaoOauth);

    return savedKakaoOauth.userId;
  }
}
