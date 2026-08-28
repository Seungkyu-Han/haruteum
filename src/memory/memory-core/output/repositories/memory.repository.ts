import { Memory } from '../../memory';

export interface IMemoryRepository {
  save(memory: Memory): Promise<Memory>;
  findById(id: string): Promise<Memory | null>;
  deleteById(id: string): Promise<void>;
  findByUserId(
    userId: string,
    pageSize?: number,
    page?: number,
  ): Promise<Memory[]>;
  findByUserIdAndCreatedAtBetween(
    userId: string,
    start: Date,
    end: Date,
    pageSize?: number,
    page?: number,
  ): Promise<Memory[]>;
  existsByUserIdAndIdGreaterThan(userId: string, id: string): Promise<boolean>;
}
