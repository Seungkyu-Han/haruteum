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
  NotFoundException,
  UseGuards,
  Delete,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { MemoryCommandService } from '../../memory-core/input/services/memory-command.service';
import { MEMORY_COMMAND_SERVICE } from '../../memory-core/memory.token';
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

@ApiTags('memory')
@UseGuards(AuthenticationGuard)
@Controller({ path: 'memory', version: '1' })
export class MemoryController {
  constructor(
    @Inject(MEMORY_COMMAND_SERVICE)
    private readonly memoryCommandService: MemoryCommandService,
  ) {}

  @Get('/:memoryId')
  @Public()
  @ApiBearerAuth('jwt')
  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.OK,
    description: '추억 조회 성공',
    type: MemoryResponseDto,
  })
  @ApiOperation({
    summary: '조회',
    description: '지난 추억을 id를 사용해 조회',
  })
  @ApiParam({
    name: 'memoryId',
    description: '조회할 추억의 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
    type: String,
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
  ) {
    const memory: Memory | null =
      await this.memoryCommandService.retrieveMemory(memoryId, principal?.id);

    if (!memory)
      throw new NotFoundException(`Memory with ID ${memoryId} not found`);

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

  @Post('/create')
  @Public()
  @ApiBearerAuth('jwt')
  @ApiConsumes('multipart/form-data')
  @ApiProduces('application/json')
  @ApiBody({
    type: CreateMemoryRequestDto,
  })
  @UseInterceptors(FilesInterceptor('files'))
  @ApiResponse({
    status: HttpStatus.OK,
    description: '추억 생성 성공',
    type: MemoryResponseDto,
  })
  @ApiOperation({
    summary: 'summary',
    description: 'description',
  })
  async createMemory(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createMemoryRequestDto: CreateMemoryRequestDto,
    @Authentication() principal?: Principal,
  ): Promise<MemoryResponseDto> {
    const createMemoryCommand = new CreateMemoryCommand(
      files.map((file) => {
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

  @Delete('/:memoryId')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('jwt')
  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '추억 삭제 성공',
  })
  @ApiOperation({
    summary: '추억을 삭제합니다.',
    description: 'description',
  })
  async deleteMemoryApi(
    @Param('memoryId') memoryId: string,
    @Authentication() principal?: Principal,
  ): Promise<undefined> {
    await this.memoryCommandService.deleteMemory(memoryId, principal?.id);
  }
}
