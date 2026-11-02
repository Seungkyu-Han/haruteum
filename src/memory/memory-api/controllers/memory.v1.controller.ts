import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Delete,
  HttpCode,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { MemoryCommandService } from '../../memory-core/input/services/memory-command.service';
import {
  MEMORY_COMMAND_SERVICE,
  MEMORY_QUERY_SERVICE,
} from '../../memory-core/memory.token';
import { CreateMemoryRequestDto } from '../dto/request/create-memory.request.dto';
import { MemoryResponseDto } from '../dto/response/memory.response.dto';
import {
  CreateMemoryCommand,
  CreateMemoryImageCommand,
  createMemoryCommentCommand,
} from '../../memory-core/commands/create-memory.command';
import { Memory } from '../../memory-core/memory';
import {
  Authentication,
  AuthenticationGuard,
  Principal,
  Public,
} from '@seungkyu/guardian';
import { MapError } from '@seungkyu/error-mapper';
import { MemoryUserMismatchException } from '../../memory-application/exceptions/memory-user-mismatch.exception';
import { MemoryNotFoundException } from '../../memory-application/exceptions/memory-not-found.exception';
import { InvalidMemoryDateRangeException } from '../../memory-application/exceptions/invalid-memory-date-range.exception';
import { EmptyMemoryImagesException } from '../../memory-application/exceptions/empty-memory-images.exception';
import { InvalidMemoryModeException } from '../../memory-application/exceptions/invalid-memory-mode.exception';
import { MemoryElementResponseDto } from '../dto/response/memory-element.response.dto';
import type { MemoryQueryService } from '../../memory-core/input/services/memory-query.service';
import { MemoryListResponseDto } from '../dto/response/memory-list.response.dto';

@ApiTags('추억 API')
@UseGuards(AuthenticationGuard)
@Controller({ path: 'memory', version: '1' })
export class MemoryController {
  constructor(
    @Inject(MEMORY_COMMAND_SERVICE)
    private readonly memoryCommandService: MemoryCommandService,
    @Inject(MEMORY_QUERY_SERVICE)
    private readonly memoryQueryService: MemoryQueryService,
  ) {}

  @Get('/list')
  @ApiBearerAuth('jwt')
  @ApiProduces('application/json')
  @ApiOperation({
    summary: '추억 목록 조회',
    description: '로그인한 사용자의 추억 목록을 페이징 및 기간 필터로 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '추억 조회 성공',
    type: MemoryListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '시작일과 종료일은 동시에 지정되어야 하며 시작일은 종료일 이전이어야 합니다.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증되지 않은 사용자입니다.',
  })
  @MapError({
    sourceError: InvalidMemoryDateRangeException,
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiQuery({
    name: 'page',
    description: '페이지의 번호',
    example: '1',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'pageSize',
    description: '한페이지당 개수(default: 20)',
    example: '20',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'start',
    description: '조회 시작일',
    example: '2020-08-18',
    required: false,
    type: Date,
  })
  @ApiQuery({
    name: 'end',
    description: '조회 마지막일',
    example: '2022-02-17',
    required: false,
    type: Date,
  })
  async getMemoriesApi(
    @Authentication() principal: Principal,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('start') start?: Date,
    @Query('end') end?: Date,
  ): Promise<MemoryListResponseDto> {
    const memories = await this.memoryCommandService.retrieveMemories(
      principal.id,
      page,
      pageSize,
      start,
      end,
    );

    const memoryElementDtoList = memories.map((memory) =>
      this.memoryToElementDto(memory),
    );

    const hasNext =
      memories.length > 0
        ? await this.memoryQueryService.existsNextPage(
            principal.id,
            memories.at(-1)!.id,
          )
        : false;

    return {
      memories: memoryElementDtoList,
      hasNext,
    };
  }

  @Get('/:memoryId')
  @Public()
  @ApiBearerAuth('jwt')
  @ApiProduces('application/json')
  @ApiOperation({
    summary: '추억 상세 조회',
    description: '추억 ID를 사용하여 특정 추억의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'memoryId',
    description: '조회할 추억의 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '추억 조회 성공',
    type: MemoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '해당 추억에 대한 접근 권한이 없습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '해당 ID의 추억을 찾을 수 없습니다.',
  })
  @MapError({
    sourceError: MemoryUserMismatchException,
    status: HttpStatus.FORBIDDEN,
  })
  @MapError({
    sourceError: MemoryNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  async getMemory(
    @Param('memoryId') memoryId: string,
    @Authentication() principal?: Principal,
  ): Promise<MemoryResponseDto> {
    const memory = await this.memoryCommandService.retrieveMemory(
      memoryId,
      principal?.id,
    );

    return this.memoryToDto(memory!);
  }

  @Post('/create')
  @Public()
  @ApiBearerAuth('jwt')
  @ApiConsumes('multipart/form-data')
  @ApiProduces('application/json')
  @ApiBody({
    type: CreateMemoryRequestDto,
  })
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({
    summary: '새로운 추억 등록',
    description:
      '이미지 파일들과 감정, 코멘트, 모드(TOGETHER/SOLO)를 전달받아 추억을 생성하고 AI 분석을 진행합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '추억 생성 성공',
    type: MemoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      '첨부 이미지가 1장 이상 필요하거나 유효하지 않은 추억 모드입니다.',
  })
  @MapError({
    sourceError: EmptyMemoryImagesException,
    status: HttpStatus.BAD_REQUEST,
  })
  @MapError({
    sourceError: InvalidMemoryModeException,
    status: HttpStatus.BAD_REQUEST,
  })
  async createMemory(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createMemoryRequestDto: CreateMemoryRequestDto,
    @Authentication() principal?: Principal,
  ): Promise<MemoryResponseDto> {
    const fileList = files || [];

    const createMemoryCommand = new CreateMemoryCommand(
      fileList.map((file) => {
        const fileBuffer: Buffer = file.buffer;

        return new CreateMemoryImageCommand(file.originalname, fileBuffer);
      }),
      [new createMemoryCommentCommand(createMemoryRequestDto.comment)],
      createMemoryRequestDto.emotion,
      createMemoryRequestDto.mode,
      new Date(),
    );

    const memory: Memory = await this.memoryCommandService.createMemory(
      createMemoryCommand,
      principal?.id,
    );

    return this.memoryToDto(memory);
  }

  @Delete('')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('jwt')
  @ApiProduces('application/json')
  @ApiOperation({
    summary: '추억 목록 삭제',
    description: '지정한 추억 ID 목록을 일괄 삭제합니다.',
  })
  @ApiQuery({
    name: 'memoryIds',
    required: true,
    type: [String],
    description: '삭제할 memoryId 목록 (예: 1,2,3)',
    example: '1,2,3',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '추억 삭제 성공',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '본인이 작성한 추억만 삭제할 수 있습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '삭제 대상 추억을 찾을 수 없습니다.',
  })
  @MapError({
    sourceError: MemoryUserMismatchException,
    status: HttpStatus.FORBIDDEN,
  })
  @MapError({
    sourceError: MemoryNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  async deleteMemoryApi(
    @Query(
      'memoryIds',
      new ParseArrayPipe({
        items: String,
        optional: false,
      }),
    )
    memoryIds: string | string[],
    @Authentication() principal: Principal,
  ): Promise<void> {
    const idArray = Array.isArray(memoryIds) ? memoryIds : [memoryIds];

    await this.memoryCommandService.deleteMemories(idArray, principal.id);
  }

  private memoryToDto(memory: Memory): MemoryResponseDto {
    return {
      memoryId: memory.id,
      summary: memory.summary || '',
      images: memory.memoryImages.map((image) => `${image.url}`),
      comments: memory.memoryComments.map((comment) => comment.comment),
      emotions: memory.emotions,
      happyScore: memory.happyScore,
      recommendedSong: memory.recommendedSong,
      mode: memory.mode,
      createdAt: memory.createdAt,
    };
  }

  private memoryToElementDto(memory: Memory): MemoryElementResponseDto {
    return {
      memoryId: memory.id,
      createdAt: memory.createdAt,
      emotions: memory.emotions,
      happyScore: memory.happyScore,
      images: memory.memoryImages.map((memoryImage) => memoryImage.url),
    };
  }
}
