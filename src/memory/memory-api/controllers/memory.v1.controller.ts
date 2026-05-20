import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';

import type { MemoryCommandService } from '../../memory-core/input/services/memory_command_service';

import { MEMORY_COMMAND_SERVICE } from '../../memory-core/memory.token';

class CreateMemoryRequestDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file!: any;
}

@ApiTags('memory')
@Controller({ path: 'memory', version: '1' })
export class MemoryController {
  constructor(
    @Inject(MEMORY_COMMAND_SERVICE)
    private readonly memoryCommandService: MemoryCommandService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateMemoryRequestDto,
  })
  @ApiOperation({
    summary: 'summary',
    description: 'description',
  })
  @UseInterceptors(FileInterceptor('file'))
  createMemory(@UploadedFile() file: Express.Multer.File) {
    return this.memoryCommandService.createMemory(file.buffer, '');
  }
}
