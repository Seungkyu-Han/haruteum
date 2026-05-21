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
import type { MemoryCommandService } from '../../memory-core/input/services/memory_command_service';
import { MEMORY_COMMAND_SERVICE } from '../../memory-core/memory.token';
import { CreateMemoryRequestDto } from '../dto/request/create-memory.request.dto';
import { CreateMemoryResponseDto } from '../dto/response/create-memory.response.dto';

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
    const summary = await this.memoryCommandService.createMemory(
      files.map((file) => file.buffer),
      createMemoryRequestDto.comment,
    );
    return { summary };
  }
}
