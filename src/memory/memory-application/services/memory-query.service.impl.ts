import { MemoryQueryService } from '../../memory-core/input/services/memory-query.service';
import { Inject, Injectable } from '@nestjs/common';
import { MEMORY_REPOSITORY } from '../../memory-core/memory.token';
import type { IMemoryRepository } from '../../memory-core/output/repositories/memory.repository';

@Injectable()
export class MemoryQueryServiceImpl implements MemoryQueryService {
  constructor(
    @Inject(MEMORY_REPOSITORY)
    private readonly memoryRepository: IMemoryRepository,
  ) {}

  async existsNextPage(userId: string, memoryId: string): Promise<boolean> {
    return this.memoryRepository.existsByUserIdAndIdGreaterThan(
      userId,
      memoryId,
    );
  }
}
