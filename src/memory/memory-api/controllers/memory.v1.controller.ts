import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as fs from 'node:fs';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { MemoryCommandService } from '../../memory-core/input/services/memory_command.service';
import { MEMORY_COMMAND_SERVICE } from '../../memory-core/memory.token';
import { CreateMemoryRequestDto } from '../dto/request/create-memory.request.dto';
import { CreateMemoryResponseDto } from '../dto/response/create-memory.response.dto';
import {
  CreateMemoryCommand,
  CreateMemoryImageCommand,
  createMemoryCommentCommand,
} from '../../memory-core/commands/create-memory.command';
import { Memory } from '../../memory-core/memory';

@ApiTags('memory/create')
@Controller({ path: 'memory', version: '1' })
export class MemoryController {
  constructor(
    @Inject(MEMORY_COMMAND_SERVICE)
    private readonly memoryCommandService: MemoryCommandService,
  ) {}

  @Post('/create')
  @ApiConsumes('multipart/form-data')
  @ApiProduces('application/json')
  @ApiBody({
    type: CreateMemoryRequestDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '추억 생성 성공',
    type: CreateMemoryResponseDto,
  })
  @ApiOperation({
    summary: 'summary',
    description: 'description',
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async createMemory(
    @UploadedFiles(
      new ParseFilePipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    files: Express.Multer.File[],
    @Body() createMemoryRequestDto: CreateMemoryRequestDto,
  ): Promise<CreateMemoryResponseDto> {
    const createMemoryCommand = new CreateMemoryCommand(
      files.map((file) => {
        const fileBuffer: Buffer = fs.readFileSync(file.path);

        return new CreateMemoryImageCommand(file.filename, fileBuffer);
      }),
      [new createMemoryCommentCommand(createMemoryRequestDto.comment)],
      createMemoryRequestDto.emotion,
      createMemoryRequestDto.mode,
      new Date(),
    );

    const memory: Memory =
      await this.memoryCommandService.createMemory(createMemoryCommand);

    return {
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
}
