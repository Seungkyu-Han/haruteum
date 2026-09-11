import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@ApiSchema({ name: '사용자 정보 요청 API DTO' })
export class UserMeRequestDto {
  @ApiProperty({
    description: '해당 사용자의 닉네임',
    example: '한승규',
  })
  @IsOptional()
  nickname?: string;
}
