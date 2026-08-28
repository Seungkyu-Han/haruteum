import { MemoryElementResponseDto } from './memory-element.response.dto';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: '추억 리스트 응답 API DTO' })
export class MemoryListResponseDto {
  @ApiProperty({
    type: [MemoryElementResponseDto],
    description: '추억 요소들',
  })
  memories: MemoryElementResponseDto[];

  @ApiProperty({
    description: '다음 페이지 존재 여부',
    example: true,
  })
  hasNext: boolean;
}
