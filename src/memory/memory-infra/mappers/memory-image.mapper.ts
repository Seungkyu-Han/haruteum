import { MemoryImage } from '../../memory-core/memory-image';
import { MemoryImageEntity } from '../entities/memory-image.entity';
import { MemoryEntity } from '../entities/memory.entity';

export function memoryImageToDomain(
  memoryImageEntity: MemoryImageEntity,
): MemoryImage {
  return new MemoryImage({
    id: memoryImageEntity.id,
    memoryId: memoryImageEntity.memoryEntity.id,
    filename: memoryImageEntity.filename,
    url: memoryImageEntity.url,
  });
}

export function memoryImageToEntity(
  memoryImage: MemoryImage,
): MemoryImageEntity {
  return {
    id: memoryImage.id,
    url: memoryImage.url,
    filename: memoryImage.filename,
    memoryEntity: { id: memoryImage.memoryId } as MemoryEntity,
    createdAt: memoryImage.createdAt,
    deletedAt: undefined,
  };
}
