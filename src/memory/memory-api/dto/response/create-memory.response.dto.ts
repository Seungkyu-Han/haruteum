import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: '추억 생성 응답 API DTO' })
export class CreateMemoryResponseDto {
  @ApiProperty({
    description: '추억의 요약 정보',
    example: '카페에서의 추억',
  })
  summary: string;

  @ApiProperty({
    description: '사진 주소',
  })
  images: string[];
}
