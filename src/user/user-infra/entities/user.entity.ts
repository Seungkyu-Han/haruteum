import { Column, DeleteDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'text', nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  name?: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
