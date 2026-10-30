import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@ApiSchema({ name: '캘린더 할 일 수정 요청 DTO' })
export class UpdateCalendarScheduleRequestDto {
  @ApiPropertyOptional({
    description: '할 일 / 일정 제목',
    example: '100일 기념일 데이트 (장소 변경)',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @MaxLength(100, { message: '제목은 100자 이하이어야 합니다.' })
  title?: string;

  @ApiPropertyOptional({
    description: '할 일 / 일정 상세 설명 및 메모',
    example: '저녁 7시 남산타워 레스토랑으로 변경',
  })
  @IsOptional()
  @IsString({ message: '상세 설명은 문자열이어야 합니다.' })
  description?: string;

  @ApiPropertyOptional({
    description: '시작 일시 (ISO 8601 형식)',
    example: '2026-11-15T19:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: '올바른 날짜 형식(ISO 8601)이어야 합니다.' })
  startDate?: string;

  @ApiPropertyOptional({
    description: '종료 일시 (ISO 8601 형식)',
    example: '2026-11-15T22:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: '올바른 날짜 형식(ISO 8601)이어야 합니다.' })
  endDate?: string;

  @ApiPropertyOptional({
    description: '완료 여부',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: '완료 여부는 불리언 값이어야 합니다.' })
  isCompleted?: boolean;
}

