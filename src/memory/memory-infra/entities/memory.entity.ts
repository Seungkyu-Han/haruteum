import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Column,
} from 'typeorm';
import { MemoryCommentEntity } from './memory-comment.entity';
import { MemoryImageEntity } from './memory-image.entity';

@Entity('memories')
export class MemoryEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ type: 'integer' })
  happyScore: number;

  @Column({ type: 'text', nullable: true })
  recommendedSong: string;

  @Column({ type: 'text', nullable: true })
  mode: string;

  @Column({ type: 'text' })
  emotion: string;

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
  deletedAt?: Date;
}
