import { CreateMemoryCommand } from '../../commands/create-memory.command';
import { Memory } from '../../memory';

export interface MemoryCommandService {
  createMemory(
    createMemoryCommand: CreateMemoryCommand,
    userId: string,
  ): Promise<Memory>;

  retrieveMemory(memoryId: string, userId?: string): Promise<Memory | null>;
}
