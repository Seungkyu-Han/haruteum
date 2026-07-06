import type { ImageMoodAgent } from '../../memory-core/output/agents/image-mood.agent';
import type { MemoryImageStorage } from '../../memory-core/output/storages/memory-image.storage';
import { Inject, Injectable } from '@nestjs/common';
import { MemoryCommandService } from '../../memory-core/input/services/memory_command.service';
import {
  IMAGE_MOOD_AGENT,
  MEMORY_IMAGE_STORAGE,
  MEMORY_REPOSITORY,
} from '../../memory-core/memory.token';
import { CreateMemoryCommand } from '../../memory-core/commands/create-memory.command';
import { Memory } from '../../memory-core/memory';
import { MemoryImage } from '../../memory-core/memory-image';
import { MemoryComment } from '../../memory-core/memory-comment';
import { randomUUID } from 'crypto';
import type { IMemoryRepository } from '../../memory-core/output/repositories/memory.repository';

@Injectable()
export class MemoryCommandServiceImpl implements MemoryCommandService {
  constructor(
    @Inject(IMAGE_MOOD_AGENT) private readonly imageMoodAgent: ImageMoodAgent,
    @Inject(MEMORY_IMAGE_STORAGE)
    private readonly memoryImageStorage: MemoryImageStorage,
    @Inject(MEMORY_REPOSITORY)
    private readonly memoryRepository: IMemoryRepository,
  ) {}

  async createMemory(
    createMemoryCommand: CreateMemoryCommand,
  ): Promise<Memory> {
    const memoryId: string = randomUUID();

    const memoryImages = await Promise.all(
      createMemoryCommand.imageCommands.map(async (image) => {
        const uploadedUrl = await this.memoryImageStorage.saveImage(
          image.filename,
          image.buffer,
        );
        return new MemoryImage({
          memoryId,
          filename: image.filename,
          url: uploadedUrl,
        });
      }),
    );

    const memoryComments = createMemoryCommand.commentCommands.map(
      (commentCommand) =>
        new MemoryComment({
          memoryId,
          comment: commentCommand.comment,
        }),
    );

    const memory = new Memory({
      id: memoryId,
      memoryImages,
      memoryComments,
      emotions: [createMemoryCommand.emotion],
      createdAt: createMemoryCommand.createdAt,
    });

    await memory.summarize(
      createMemoryCommand.imageCommands.map((image) => image.buffer),
      this.imageMoodAgent,
    );

    await this.memoryRepository.save(memory);

    return memory;
  }
}
