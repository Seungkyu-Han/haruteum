import { Injectable } from '@nestjs/common';
import { IMemoryRepository } from '../../memory-core/output/repositories/memory.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MemoryEntity } from '../entities/memory.entity';
import { Between, Repository, MoreThan } from 'typeorm';
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

  async findByUserId(
    userId: string,
    pageSize?: number,
    page?: number,
  ): Promise<Memory[]> {
    const relations = {
      memoryCommentEntities: true,
      memoryImageEntities: true,
    };

    if (pageSize === undefined && page === undefined) {
      const memoryEntities = await this.memoryRepository.find({
        where: { userId },
        relations,
        order: { createdAt: 'DESC' },
      });

      return memoryEntities.map(memoryToDomain);
    }

    const currentPage = page ?? 1;
    const currentLimit = pageSize ?? 20;
    const skip = (currentPage - 1) * currentLimit;

    const memoryEntities = await this.memoryRepository.find({
      where: { userId },
      relations,
      order: { createdAt: 'DESC' },
      skip,
      take: currentLimit,
    });

    return memoryEntities.map(memoryToDomain);
  }

  async findByUserIdAndCreatedAtBetween(
    userId: string,
    start: Date,
    end: Date,
    pageSize?: number,
    page?: number,
  ): Promise<Memory[]> {
    const relations = {
      memoryCommentEntities: true,
      memoryImageEntities: true,
    };

    const where = {
      userId,
      createdAt: Between(start, end),
    };

    if (pageSize === undefined && page === undefined) {
      const memoryEntities = await this.memoryRepository.find({
        where,
        relations,
        order: { createdAt: 'DESC' },
      });

      return memoryEntities.map(memoryToDomain);
    }

    const currentPage = page ?? 1;
    const currentLimit = pageSize ?? 20;
    const skip = (currentPage - 1) * currentLimit;

    const memoryEntities = await this.memoryRepository.find({
      where,
      relations,
      order: { createdAt: 'DESC' },
      skip,
      take: currentLimit,
    });

    return memoryEntities.map(memoryToDomain);
  }

  async existsByUserIdAndIdGreaterThan(
    userId: string,
    id: string,
  ): Promise<boolean> {
    return await this.memoryRepository.exists({
      where: {
        userId: userId,
        id: MoreThan(id),
      },
    });
  }
}
