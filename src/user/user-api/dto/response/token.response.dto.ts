import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: '토큰 응답 API DTO' })
export class TokenResponseDto {
  @ApiProperty({
    example: '...',
    description: '액세스 토큰 (유효기간: 15분)',
  })
  accessToken: string;

  @ApiProperty({
    example: '...',
    description: '리프레시 토큰 (유효기간: 20분)',
  })
  refreshToken: string;

  @ApiProperty({
    example: 'false',
    description: '탈퇴 여부',
  })
  withdraw: boolean;
}
