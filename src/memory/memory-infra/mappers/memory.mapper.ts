import { Memory } from '../../memory-core/memory';
import { MemoryEntity } from '../entities/memory.entity';
import {
  memoryCommentToDomain,
  memoryCommentToEntity,
} from './memory-comment.mapper';
import {
  memoryImageToDomain,
  memoryImageToEntity,
} from './memory-image.mapper';

export function memoryToDomain(memoryEntity: MemoryEntity): Memory {
  return new Memory({
    id: memoryEntity.id,
    summary: memoryEntity.summary,
    memoryImages: memoryEntity.memoryImageEntities.map((imageEntity) =>
      memoryImageToDomain(imageEntity),
    ),
    memoryComments: memoryEntity.memoryCommentEntities.map((commentEntity) =>
      memoryCommentToDomain(commentEntity),
    ),
    createdAt: memoryEntity.createdAt,
  });
}

export function memoryToEntity(memory: Memory): MemoryEntity {
  return {
    id: memory.id,
    summary: memory.summary,
    memoryImageEntities: memory.memoryImages.map((memoryImage) =>
      memoryImageToEntity(memoryImage),
    ),
    memoryCommentEntities: memory.memoryComments.map((memoryComment) =>
      memoryCommentToEntity(memoryComment),
    ),
    createdAt: memory.createdAt,
    deletedAt: undefined,
  };
}
