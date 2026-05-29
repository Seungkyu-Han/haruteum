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
      createMemoryCommand.images.map(async (image) => {
        const uploadedUrl = await this.memoryImageStorage.saveImage(image);
        return new MemoryImage({
          memoryId,
          filename: image.filename,
          buffer: image.buffer,
          url: uploadedUrl,
        });
      }),
    );

    const memory = new Memory({
      memoryImages,
      comment: createMemoryCommand.comment,
      createdAt: createMemoryCommand.createdAt,
    });

    await memory.summarize(this.imageMoodAgent);

    return memory;
  }
}
