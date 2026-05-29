import { Memory } from '../../memory-core/memory';
import { MemoryEntity } from '../entities/memory.entity';

export function memoryToDomain(memoryEntity: MemoryEntity): Memory {
  const comment = memoryEntity.memoryCommentEntities
    .map((commentEntity) => commentEntity.content)
    .join(' ');

  return new Memory({
    memoryImages: [],
    comment,
    createdAt: memoryEntity.createdAt,
  });
}
