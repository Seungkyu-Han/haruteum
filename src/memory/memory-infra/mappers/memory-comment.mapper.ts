import { MemoryComment } from '../../memory-core/memory-comment';
import { MemoryCommentEntity } from '../entities/memory-comment.entity';
import { MemoryEntity } from '../entities/memory.entity';

export function memoryCommentToDomain(
  memoryCommentEntity: MemoryCommentEntity,
): MemoryComment {
  return new MemoryComment({
    id: memoryCommentEntity.id,
    memoryId: memoryCommentEntity.memoryEntity.id,
    comment: memoryCommentEntity.comment,
    createdAt: memoryCommentEntity.createdAt,
  });
}

export function memoryCommentToEntity(
  memoryComment: MemoryComment,
): MemoryCommentEntity {
  return {
    id: memoryComment.id,
    comment: memoryComment.comment,
    memoryEntity: { id: memoryComment.memoryId } as MemoryEntity,
    createdAt: memoryComment.createdAt,
    deletedAt: undefined,
  };
}
