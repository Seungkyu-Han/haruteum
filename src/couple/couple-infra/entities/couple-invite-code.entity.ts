import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('couple_invite_codes')
export class CoupleInviteCodeEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  inviterId: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 16 })
  code: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'timestamp' })
  createdAt: Date;
}
