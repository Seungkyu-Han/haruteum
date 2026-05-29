import type { ImageMoodAgent } from '../../memory-core/output/agents/image-mood.agent';
import type { MemoryImageStorage } from '../../memory-core/output/storages/memory-image.storage';
import { Inject, Injectable } from '@nestjs/common';
import { MemoryCommandService } from '../../memory-core/input/services/memory_command.service';
import {
  IMAGE_MOOD_AGENT,
  MEMORY_IMAGE_STORAGE,
} from '../../memory-core/memory.token';
import { CreateMemoryCommand } from '../../memory-core/commands/create-memory.command';
import { Memory } from '../../memory-core/memory';
import { MemoryImage } from '../../memory-core/memory-image';
import { MemoryComment } from '../../memory-core/memory-comment';
import { randomUUID } from 'crypto';

@Injectable()
export class MemoryCommandServiceImpl implements MemoryCommandService {
  constructor(
    @Inject(IMAGE_MOOD_AGENT) private readonly imageMoodAgent: ImageMoodAgent,
    @Inject(MEMORY_IMAGE_STORAGE)
    private readonly memoryImageStorage: MemoryImageStorage,
  ) {}

  async createMemory(
    createMemoryCommand: CreateMemoryCommand,
  ): Promise<Memory> {
    const memoryId: string = randomUUID();

    const memoryImages = await Promise.all(
      createMemoryCommand.imageCommands.map(async (image) => {
        const uploadedUrl = await this.memoryImageStorage.saveImage(image);
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
      memoryImages,
      memoryComments,
      createdAt: createMemoryCommand.createdAt,
    });

    await memory.summarize(this.imageMoodAgent);

    return memory;
  }
}
