import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { MemoryCommentEntity } from './memory-comment.entity';
import { MemoryImageEntity } from './memory-image.entity';

@Entity('memories')
export class MemoryEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @OneToMany(
    () => MemoryCommentEntity,
    (commentEntity) => commentEntity.memoryEntity,
    {
      cascade: true,
    },
  )
  memoryCommentEntities: MemoryCommentEntity[];

  @OneToMany(
    () => MemoryImageEntity,
    (imageEntity) => imageEntity.memoryEntity,
    {
      cascade: true,
    },
  )
  memoryImageEntities: MemoryImageEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
