import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

@ApiSchema({ name: '캘린더 일정 범위 조회 요청 DTO' })
export class GetCalendarSchedulesRequestDto {
  @ApiProperty({
    description: '조회 시작 일시 (ISO 8601 형식)',
    example: '2026-11-01T00:00:00.000Z',
  })
  @IsNotEmpty({ message: '시작 일시를 입력해주세요.' })
  @IsDateString({}, { message: '올바른 날짜 형식(ISO 8601)이어야 합니다.' })
  startDate: string;

  @ApiProperty({
    description: '조회 종료 일시 (ISO 8601 형식)',
    example: '2026-11-30T23:59:59.999Z',
  })
  @IsNotEmpty({ message: '종료 일시를 입력해주세요.' })
  @IsDateString({}, { message: '올바른 날짜 형식(ISO 8601)이어야 합니다.' })
  endDate: string;
}

