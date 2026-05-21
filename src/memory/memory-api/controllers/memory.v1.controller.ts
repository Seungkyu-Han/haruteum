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
import { FilesInterceptor } from '@nestjs/platform-express';
import type { MemoryCommandService } from '../../memory-core/input/services/memory_command.service';
import { MEMORY_COMMAND_SERVICE } from '../../memory-core/memory.token';
import { CreateMemoryRequestDto } from '../dto/request/create-memory.request.dto';
import { CreateMemoryResponseDto } from '../dto/response/create-memory.response.dto';
import { ImageVO } from '../../memory-core/vo/image.vo';
import { CreateMemoryCommand } from '../../memory-core/commands/create-memory.command';
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
  @UseInterceptors(FilesInterceptor('files'))
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
      files.map((file) => new ImageVO(file.originalname, file.buffer, '')),
      createMemoryRequestDto.comment,
      new Date(),
    );

    const memory: Memory =
      await this.memoryCommandService.createMemory(createMemoryCommand);

    return {
      summary: memory.summary || '',
      images: memory.images.map((image) => image.url),
    };
  }
}
