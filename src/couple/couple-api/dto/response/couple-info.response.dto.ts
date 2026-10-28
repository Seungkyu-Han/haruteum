import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: '커플 정보 응답 DTO' })
export class CoupleInfoResponseDto {
  @ApiProperty({
    description: '커플 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: '상대방 사용자 ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  partnerId: string;

  @ApiProperty({
    description: '상대방 닉네임',
    example: '지은',
    nullable: true,
  })
  partnerNickname?: string;

  @ApiProperty({
    description: '커플 연결 성사 일시',
    example: '2026-10-28T16:40:00.000Z',
  })
  createdAt: Date;
}
