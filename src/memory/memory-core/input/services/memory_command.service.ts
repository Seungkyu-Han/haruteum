import { CreateMemoryCommand } from '../../commands/create-memory.command';
import { Memory } from '../../memory';

export interface MemoryCommandService {
  createMemory(createMemoryCommand: CreateMemoryCommand): Promise<Memory>;
}
