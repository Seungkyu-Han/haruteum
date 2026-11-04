import { ApiProperty } from '@nestjs/swagger';

export class CoupleConnectStatusResponseDto {
  @ApiProperty({
    description: '커플 연결 성사 여부',
    example: true,
  })
  isConnected: boolean;

  @ApiProperty({
    description: '연결된 커플 고유 ID (연결된 경우에만 포함)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  coupleId?: string;

  @ApiProperty({
    description: '연결된 파트너 사용자 ID (연결된 경우에만 포함)',
    example: '223e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  partnerId?: string;

  @ApiProperty({
    description: '연결된 파트너 닉네임 (연결된 경우에만 포함)',
    example: '달콤한토끼',
    required: false,
  })
  partnerNickname?: string;

  @ApiProperty({
    description: '커플 연결 성사 일시 (연결된 경우에만 포함)',
    example: '2026-11-04T02:00:00.000Z',
    required: false,
  })
  createdAt?: Date;
}
