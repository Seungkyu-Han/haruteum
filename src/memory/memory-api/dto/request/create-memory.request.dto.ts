import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: '추억 생성 요청 API DTO' })
export class CreateMemoryRequestDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: '추억에 첨부할 이미지 또는 영상 파일 리스트',
    required: true,
  })
  files: Express.Multer.File[];
  @ApiProperty({
    description: '추억에 남길 설명',
    example: '카페에 갔다.',
  })
  comment: string;
}
