import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@ApiSchema({ name: '캘린더 할 일 등록 요청 DTO' })
export class CreateCalendarScheduleRequestDto {
  @ApiProperty({
    description: '할 일 / 일정 제목',
    example: '100일 기념일 데이트',
    maxLength: 100,
  })
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @MaxLength(100, { message: '제목은 100자 이하이어야 합니다.' })
  title: string;

  @ApiPropertyOptional({
    description: '할 일 / 일정 상세 설명 및 메모',
    example: '저녁 7시 한강 레스토랑 예약 완료',
  })
  @IsOptional()
  @IsString({ message: '상세 설명은 문자열이어야 합니다.' })
  description?: string;

  @ApiProperty({
    description: '시작 일시 (ISO 8601 형식)',
    example: '2026-11-15T19:00:00.000Z',
  })
  @IsNotEmpty({ message: '시작 일시를 입력해주세요.' })
  @IsDateString({}, { message: '올바른 날짜 형식(ISO 8601)이어야 합니다.' })
  startDate: string;

  @ApiPropertyOptional({
    description: '종료 일시 (ISO 8601 형식, 미입력 시 시작 일시와 동일)',
    example: '2026-11-15T22:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: '올바른 날짜 형식(ISO 8601)이어야 합니다.' })
  endDate?: string;

  @ApiPropertyOptional({
    description: '완료 여부 (기본값: false)',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: '완료 여부는 불리언 값이어야 합니다.' })
  isCompleted?: boolean;
}

