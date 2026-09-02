import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: '사용자 정보 응답 API DTO' })
export class UserMeResponseDto {
  @ApiProperty({
    description: '해당 사용자의 이메일',
    example: 'trust1204@gmail.com',
  })
  email?: string;

  @ApiProperty({
    description: '해당 사용자의 닉네임',
    example: '한승규',
  })
  nickname?: string;
}
