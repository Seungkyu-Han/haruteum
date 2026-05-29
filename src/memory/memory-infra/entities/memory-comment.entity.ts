import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MemoryEntity } from './memory.entity';

@Entity('memory_comments')
export class MemoryCommentEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(
    () => MemoryEntity,
    (memoryEntity) => memoryEntity.memoryCommentEntities,
    {
      lazy: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'memory_id' })
  memoryEntity: MemoryEntity;
}
