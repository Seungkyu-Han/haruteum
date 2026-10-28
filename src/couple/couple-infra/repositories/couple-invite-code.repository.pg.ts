import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { ICoupleInviteCodeRepository } from '../../couple-core/output/repositories/couple-invite-code.repository';
import { CoupleInviteCode } from '../../couple-core/couple-invite-code';
import { CoupleInviteCodeEntity } from '../entities/couple-invite-code.entity';
import {
  coupleInviteCodeToDomain,
  coupleInviteCodeToEntity,
} from '../mappers/couple-invite-code.mapper';

@Injectable()
export class CoupleInviteCodeRepositoryPg
  implements ICoupleInviteCodeRepository
{
  constructor(
    @InjectRepository(CoupleInviteCodeEntity)
    private readonly inviteCodeRepository: Repository<CoupleInviteCodeEntity>,
  ) {}

  async save(inviteCode: CoupleInviteCode): Promise<CoupleInviteCode> {
    const entity = coupleInviteCodeToEntity(inviteCode);
    await this.inviteCodeRepository.save(entity);
    return inviteCode;
  }

  async findByCode(code: string): Promise<CoupleInviteCode | null> {
    const entity = await this.inviteCodeRepository.findOne({
      where: { code },
    });
    return entity ? coupleInviteCodeToDomain(entity) : null;
  }

  async findActiveByInviterId(
    inviterId: string,
  ): Promise<CoupleInviteCode | null> {
    const entity = await this.inviteCodeRepository.findOne({
      where: {
        inviterId,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return entity ? coupleInviteCodeToDomain(entity) : null;
  }

  async invalidateByInviterId(inviterId: string): Promise<void> {
    await this.inviteCodeRepository.update(
      {
        inviterId,
        isUsed: false,
      },
      {
        isUsed: true,
      },
    );
  }
}
