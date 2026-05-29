import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { MemoryEntity } from './memory.entity';

@Entity('memory_comments')
export class MemoryCommentEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'text' })
  comment: string;

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
