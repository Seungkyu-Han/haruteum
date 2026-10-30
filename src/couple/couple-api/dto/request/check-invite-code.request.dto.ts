import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@ApiSchema({ name: '커플 초대 코드 검증 요청 DTO' })
export class CheckInviteCodeRequestDto {
  @ApiProperty({
    description: '확인할 커플 초대 코드',
    example: 'LOVEA7K9PQ',
  })
  @IsNotEmpty({ message: '초대 코드를 입력해주세요.' })
  @IsString({ message: '초대 코드는 문자열이어야 합니다.' })
  @Length(6, 16, { message: '초대 코드는 6자 이상이어야 합니다.' })
  code: string;
}
