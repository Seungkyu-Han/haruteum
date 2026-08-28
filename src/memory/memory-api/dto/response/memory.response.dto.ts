import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: '추억 생성 응답 API DTO' })
export class MemoryResponseDto {
  @ApiProperty({
    description: '추억의 아이디',
    example: '1Bdfdh-asdfasf',
  })
  memoryId: string;

  @ApiProperty({
    description: '추억의 요약 정보',
    example: '카페에서의 추억',
  })
  summary: string;

  @ApiProperty({
    description: '사진 주소',
  })
  images: string[];

  @ApiProperty({
    description: '추억에 대한 댓글',
    example: ['즐거웠어!', '다음에 또 가자!'],
  })
  comments: string[];

  @ApiProperty({
    description: '추억에 대한 감정',
    example: ['행복해', '즐거워'],
  })
  emotions: string[];

  @ApiProperty({
    description: '행복 점수',
    example: 85,
  })
  happyScore: number;

  @ApiProperty({
    description: '추억이 생성된 날짜',
    example: '2023-10-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '추억에 맞는 추천 노래',
    example: '아이유 - 좋은 날',
  })
  recommendedSong: string;

  @ApiProperty({
    description: '추억 모드',
  })
  mode: string;
}
