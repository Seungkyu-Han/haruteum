import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: '캘린더 할 일 응답 DTO' })
export class CalendarScheduleResponseDto {
  @ApiProperty({
    description: '할 일 / 일정 고유 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '커플 ID',
    example: '223e4567-e89b-12d3-a456-426614174000',
  })
  coupleId: string;

  @ApiProperty({
    description: '등록한 사용자 ID',
    example: '323e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: '할 일 / 일정 제목',
    example: '100일 기념일 데이트',
  })
  title: string;

  @ApiPropertyOptional({
    description: '할 일 / 일정 상세 설명 및 메모',
    example: '저녁 7시 한강 레스토랑 예약 완료',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: '시작 일시',
    example: '2026-11-15T19:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: '종료 일시',
    example: '2026-11-15T22:00:00.000Z',
  })
  endDate: Date;

  @ApiProperty({
    description: '완료 여부',
    example: false,
  })
  isCompleted: boolean;

  @ApiProperty({
    description: '생성 일시',
    example: '2026-10-30T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 일시',
    example: '2026-10-30T10:00:00.000Z',
  })
  updatedAt: Date;
}

