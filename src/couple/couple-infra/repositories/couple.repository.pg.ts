import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICoupleRepository } from '../../couple-core/output/repositories/couple.repository';
import { Couple } from '../../couple-core/couple';
import { CoupleEntity } from '../entities/couple.entity';
import { coupleToDomain, coupleToEntity } from '../mappers/couple.mapper';

@Injectable()
export class CoupleRepositoryPg implements ICoupleRepository {
  constructor(
    @InjectRepository(CoupleEntity)
    private readonly coupleRepository: Repository<CoupleEntity>,
  ) {}

  async save(couple: Couple): Promise<Couple> {
    const entity = coupleToEntity(couple);
    await this.coupleRepository.save(entity);
    return couple;
  }

  async findByUserId(userId: string): Promise<Couple | null> {
    const entity = await this.coupleRepository.findOne({
      where: [{ user1Id: userId }, { user2Id: userId }],
    });
    return entity ? coupleToDomain(entity) : null;
  }

  async findById(id: string): Promise<Couple | null> {
    const entity = await this.coupleRepository.findOne({
      where: { id },
    });
    return entity ? coupleToDomain(entity) : null;
  }

  async deleteById(id: string): Promise<void> {
    await this.coupleRepository.softDelete(id);
  }
}
