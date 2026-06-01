import { Memory } from '../../memory';

export interface IMemoryRepository {
  save(memory: Memory): Promise<Memory>;
}
