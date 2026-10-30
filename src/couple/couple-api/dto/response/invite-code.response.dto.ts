import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: '커플 초대 코드 응답 DTO' })
export class InviteCodeResponseDto {
  @ApiProperty({
    description: '생성된 커플 초대 코드',
    example: 'LOVEA7K9PQ',
  })
  code: string;

  @ApiProperty({
    description: '초대 코드 만료 일시',
    example: '2026-10-29T16:40:00.000Z',
  })
  expiresAt: Date;
}
