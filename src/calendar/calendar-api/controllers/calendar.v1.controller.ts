import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Authentication,
  AuthenticationGuard,
  Principal,
} from '@seungkyu/guardian';
import { MapError } from '@seungkyu/error-mapper';
import {
  CALENDAR_COMMAND_SERVICE,
  CALENDAR_QUERY_SERVICE,
} from '../../calendar-core/calendar.token';
import type { ICalendarCommandService } from '../../calendar-core/input/services/calendar-command.service';
import type { ICalendarQueryService } from '../../calendar-core/input/services/calendar-query.service';
import { CreateCalendarScheduleRequestDto } from '../dto/request/create-calendar-schedule.request.dto';
import { UpdateCalendarScheduleRequestDto } from '../dto/request/update-calendar-schedule.request.dto';
import { GetCalendarSchedulesRequestDto } from '../dto/request/get-calendar-schedules.request.dto';
import { CalendarScheduleResponseDto } from '../dto/response/calendar-schedule.response.dto';
import { CalendarSchedule } from '../../calendar-core/calendar-schedule';
import { CoupleNotFoundException } from '../../../couple/couple-core/exceptions/couple-not-found.exception';
import { CalendarScheduleNotFoundException } from '../../calendar-core/exceptions/calendar-schedule-not-found.exception';
import { InvalidDateRangeException } from '../../calendar-core/exceptions/invalid-date-range.exception';
import { UnauthorizedScheduleAccessException } from '../../calendar-core/exceptions/unauthorized-schedule-access.exception';

@ApiTags('캘린더 API')
@Controller({ path: 'calendar', version: '1' })
@ApiBearerAuth('jwt')
@UseGuards(AuthenticationGuard)
export class CalendarV1Controller {
  constructor(
    @Inject(CALENDAR_COMMAND_SERVICE)
    private readonly calendarCommandService: ICalendarCommandService,
    @Inject(CALENDAR_QUERY_SERVICE)
    private readonly calendarQueryService: ICalendarQueryService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '커플 캘린더에 새로운 할 일 / 일정을 등록합니다.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '할 일 / 일정 등록 성공',
    type: CalendarScheduleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '날짜 범위가 올바르지 않습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '커플로 연결되어 있지 않습니다.',
  })
  @MapError({
    sourceError: InvalidDateRangeException,
    status: HttpStatus.BAD_REQUEST,
  })
  @MapError({
    sourceError: CoupleNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  async createSchedule(
    @Authentication() principal: Principal,
    @Body() dto: CreateCalendarScheduleRequestDto,
  ): Promise<CalendarScheduleResponseDto> {
    const schedule = await this.calendarCommandService.createSchedule(
      principal.id,
      {
        title: dto.title,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        isCompleted: dto.isCompleted,
      },
    );
    return this.toResponseDto(schedule);
  }

  @Get()
  @ApiOperation({
    summary: '지정한 날짜 범위 내의 커플 할 일 / 일정 목록을 조회합니다.',
    description:
      '조회 기간(startDate ~ endDate)과 겹치는 모든 커플의 할 일 / 일정을 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '일정 목록 조회 성공',
    type: [CalendarScheduleResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '시작일이 종료일보다 이후입니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '커플로 연결되어 있지 않습니다.',
  })
  @MapError({
    sourceError: InvalidDateRangeException,
    status: HttpStatus.BAD_REQUEST,
  })
  @MapError({
    sourceError: CoupleNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  async getSchedules(
    @Authentication() principal: Principal,
    @Query() query: GetCalendarSchedulesRequestDto,
  ): Promise<CalendarScheduleResponseDto[]> {
    const schedules = await this.calendarQueryService.getSchedulesByRange(
      principal.id,
      new Date(query.startDate),
      new Date(query.endDate),
    );
    return schedules.map(this.toResponseDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 캘린더 할 일 / 일정의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '할 일 / 일정 ID (UUID)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '상세 정보 조회 성공',
    type: CalendarScheduleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '해당 일정에 대한 접근 권한이 없습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '일정을 찾을 수 없거나 커플이 아닙니다.',
  })
  @MapError({
    sourceError: UnauthorizedScheduleAccessException,
    status: HttpStatus.FORBIDDEN,
  })
  @MapError({
    sourceError: CalendarScheduleNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  @MapError({
    sourceError: CoupleNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  async getScheduleById(
    @Authentication() principal: Principal,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CalendarScheduleResponseDto> {
    const schedule = await this.calendarQueryService.getScheduleById(
      principal.id,
      id,
    );
    return this.toResponseDto(schedule);
  }

  @Put(':id')
  @ApiOperation({
    summary: '커플 캘린더 할 일 / 일정을 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '할 일 / 일정 ID (UUID)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '할 일 / 일정 수정 성공',
    type: CalendarScheduleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '날짜 범위가 올바르지 않습니다.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '해당 일정에 대한 접근 권한이 없습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '일정을 찾을 수 없거나 커플이 아닙니다.',
  })
  @MapError({
    sourceError: InvalidDateRangeException,
    status: HttpStatus.BAD_REQUEST,
  })
  @MapError({
    sourceError: UnauthorizedScheduleAccessException,
    status: HttpStatus.FORBIDDEN,
  })
  @MapError({
    sourceError: CalendarScheduleNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  @MapError({
    sourceError: CoupleNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  async updateSchedule(
    @Authentication() principal: Principal,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCalendarScheduleRequestDto,
  ): Promise<CalendarScheduleResponseDto> {
    const schedule = await this.calendarCommandService.updateSchedule(
      principal.id,
      id,
      {
        title: dto.title,
        description: dto.description,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        isCompleted: dto.isCompleted,
      },
    );
    return this.toResponseDto(schedule);
  }

  @Patch(':id/complete')
  @ApiOperation({
    summary: '커플 캘린더 할 일의 완료 여부를 토글합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '할 일 / 일정 ID (UUID)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '완료 상태 토글 성공',
    type: CalendarScheduleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '해당 일정에 대한 접근 권한이 없습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '일정을 찾을 수 없거나 커플이 아닙니다.',
  })
  @MapError({
    sourceError: UnauthorizedScheduleAccessException,
    status: HttpStatus.FORBIDDEN,
  })
  @MapError({
    sourceError: CalendarScheduleNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  @MapError({
    sourceError: CoupleNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  async toggleComplete(
    @Authentication() principal: Principal,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CalendarScheduleResponseDto> {
    const schedule = await this.calendarCommandService.toggleScheduleComplete(
      principal.id,
      id,
    );
    return this.toResponseDto(schedule);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '커플 캘린더 할 일 / 일정을 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '할 일 / 일정 ID (UUID)',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '할 일 / 일정 삭제 성공',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '해당 일정에 대한 접근 권한이 없습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '일정을 찾을 수 없거나 커플이 아닙니다.',
  })
  @MapError({
    sourceError: UnauthorizedScheduleAccessException,
    status: HttpStatus.FORBIDDEN,
  })
  @MapError({
    sourceError: CalendarScheduleNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  @MapError({
    sourceError: CoupleNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  async deleteSchedule(
    @Authentication() principal: Principal,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.calendarCommandService.deleteSchedule(principal.id, id);
  }

  private toResponseDto(
    schedule: CalendarSchedule,
  ): CalendarScheduleResponseDto {
    return {
      id: schedule.id,
      coupleId: schedule.coupleId,
      userId: schedule.userId,
      title: schedule.title,
      description: schedule.description,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      isCompleted: schedule.isCompleted,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    };
  }
}

