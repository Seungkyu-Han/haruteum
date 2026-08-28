import { Injectable } from '@nestjs/common';
import { IMemoryRepository } from '../../memory-core/output/repositories/memory.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MemoryEntity } from '../entities/memory.entity';
import { Repository } from 'typeorm';
import { Memory } from '../../memory-core/memory';
import { memoryToEntity, memoryToDomain } from '../mappers/memory.mapper';

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

  async findById(id: string): Promise<Memory | null> {
    const memoryEntity = await this.memoryRepository.findOne({
      where: { id },
      relations: {
        memoryCommentEntities: true,
        memoryImageEntities: true,
      },
    });

    if (!memoryEntity) {
      return null;
    }

    return memoryToDomain(memoryEntity);
  }

  async deleteById(id: string): Promise<void> {
    await this.memoryRepository.delete(id);
  }
}
