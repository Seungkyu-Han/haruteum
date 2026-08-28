import { Memory } from '../../memory';

export interface IMemoryRepository {
  save(memory: Memory): Promise<Memory>;
  findById(id: string): Promise<Memory | null>;
  deleteById(id: string): Promise<void>;
}
