import { Injectable } from '@nestjs/common';
import { IMemoryRepository } from '../../memory-core/output/repositories/memory.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MemoryEntity } from '../entities/memory.entity';
import { Repository } from 'typeorm';
import { Memory } from '../../memory-core/memory';
import { memoryToEntity } from '../mappers/memory.mapper';

@Injectable()
export class MemoryRepositoryPg implements IMemoryRepository {
  constructor(
    @InjectRepository(MemoryEntity)
    private readonly memoryRepository: Repository<MemoryEntity>,
  ) {}

  async save(memory: Memory): Promise<Memory> {
    const memoryEntity = memoryToEntity(memory);

    await this.memoryRepository.save(memoryEntity);

    return memory;
  }
}
