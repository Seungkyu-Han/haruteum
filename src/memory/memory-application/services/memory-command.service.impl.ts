import type { ImageMoodAgent } from '../../memory-core/output/agents/image-mood.agent';
import { Inject, Injectable } from '@nestjs/common';
import { MemoryCommandService } from '../../memory-core/input/services/memory-command.service';
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
import type { MemoryImageStorage } from '../../memory-core/output/storages/memory-image.storage';
import { MemoryNotFoundException } from '../exceptions/memory-not-found.exception';
import { MemoryUserMismatchException } from '../exceptions/memory-user-mismatch.exception';
import { InvalidMemoryDateRangeException } from '../exceptions/invalid-memory-date-range.exception';
import { EmptyMemoryImagesException } from '../exceptions/empty-memory-images.exception';
import { InvalidMemoryModeException } from '../exceptions/invalid-memory-mode.exception';
import { MemoryMode } from '../../memory-core/models/memory-mode.enum';

@Injectable()
export class MemoryCommandServiceImpl implements MemoryCommandService {
  constructor(
    @Inject(IMAGE_MOOD_AGENT)
    private readonly imageMoodAgent: ImageMoodAgent,
    @Inject(MEMORY_REPOSITORY)
    private readonly memoryRepository: IMemoryRepository,
    @Inject(MEMORY_IMAGE_STORAGE)
    private readonly memoryImageStorage: MemoryImageStorage,
  ) {}

  async retrieveMemory(
    memoryId: string,
    userId?: string,
  ): Promise<Memory | null> {
    const memory = await this.memoryRepository.findById(memoryId);

    if (!memory) {
      throw new MemoryNotFoundException(memoryId);
    }

    if (memory.userId && memory.userId !== userId) {
      throw new MemoryUserMismatchException();
    }

    return memory;
  }

  async retrieveMemories(
    userId: string,
    page?: number,
    pageSize?: number,
    start?: Date,
    end?: Date,
  ): Promise<Memory[]> {
    if ((start && end === undefined) || (start === undefined && end)) {
      throw new InvalidMemoryDateRangeException();
    }

    if (start && end && new Date(start).getTime() > new Date(end).getTime()) {
      throw new InvalidMemoryDateRangeException();
    }

    let modifiedStart: Date | undefined;
    let modifiedEnd: Date | undefined;

    if (start) {
      modifiedStart = new Date(start);
      modifiedStart.setHours(0, 0, 0, 0);
    }

    if (end) {
      modifiedEnd = new Date(end);
      modifiedEnd.setDate(modifiedEnd.getDate() + 1);
      modifiedEnd.setHours(0, 0, 0, 0);
    }
    if (modifiedStart && modifiedEnd) {
      if (page || pageSize)
        return await this.memoryRepository.findByUserIdAndCreatedAtBetween(
          userId,
          modifiedStart,
          modifiedEnd,
          pageSize,
          page,
        );
      else
        return await this.memoryRepository.findByUserIdAndCreatedAtBetween(
          userId,
          modifiedStart,
          modifiedEnd,
        );
    }

    if (page || pageSize) {
      return await this.memoryRepository.findByUserId(userId, pageSize, page);
    } else {
      return await this.memoryRepository.findByUserId(userId);
    }
  }

  async createMemory(
    createMemoryCommand: CreateMemoryCommand,
    userId?: string,
  ): Promise<Memory> {
    if (
      !createMemoryCommand.imageCommands ||
      createMemoryCommand.imageCommands.length === 0
    ) {
      throw new EmptyMemoryImagesException();
    }

    const normalizedMode = createMemoryCommand.mode?.trim().toUpperCase();
    if (
      normalizedMode !== MemoryMode.TOGETHER &&
      normalizedMode !== MemoryMode.SOLO
    ) {
      throw new InvalidMemoryModeException();
    }

    const memoryId: string = randomUUID();

    const memoryImages = await Promise.all(
      createMemoryCommand.imageCommands.map(async (image) => {
        const filePath = await this.memoryImageStorage.saveImage(
          image.filename,
          image.buffer,
        );

        return new MemoryImage({
          memoryId,
          filename: image.filename,
          url: filePath,
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
      userId: userId,
      mode: createMemoryCommand.mode,
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

  async deleteMemory(memoryId: string, userId?: string): Promise<void> {
    const memory = await this.memoryRepository.findById(memoryId);

    if (!memory) throw new MemoryNotFoundException(memoryId);

    if (memory.userId && memory.userId !== userId)
      throw new MemoryUserMismatchException();

    await this.memoryRepository.deleteById(memoryId);
  }

  async deleteMemories(memoryIds: string[], userId: string): Promise<void> {
    const memories = await this.memoryRepository.findByIdIn(memoryIds);

    if (memoryIds.length !== memories.length)
      throw new MemoryNotFoundException('');

    memories.forEach((memory) => {
      if (memory.userId !== userId) throw new MemoryUserMismatchException();
    });

    await this.memoryRepository.deleteByIdIn(memoryIds);
  }
}
