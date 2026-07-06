import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { MemoryEntity } from './memory.entity';

@Entity('memory_images')
export class MemoryImageEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'text' })
  filename: string;

  @ManyToOne(
    () => MemoryEntity,
    (memoryEntity) => memoryEntity.memoryImageEntities,
    {
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
