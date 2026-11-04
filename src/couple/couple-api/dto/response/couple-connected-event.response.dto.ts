import { ApiProperty } from '@nestjs/swagger';

export class CoupleConnectedEventResponseDto {
  @ApiProperty({
    description: '생성된 커플 고유 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  coupleId: string;

  @ApiProperty({
    description: '연결된 파트너 사용자 ID',
    example: '223e4567-e89b-12d3-a456-426614174001',
  })
  partnerId: string;

  @ApiProperty({
    description: '연결된 파트너 사용자 닉네임',
    example: '달콤한토끼',
    required: false,
  })
  partnerNickname?: string;

  @ApiProperty({
    description: '커플 연결 성사 일시',
    example: '2026-11-04T02:00:00.000Z',
  })
  createdAt: Date;
}
