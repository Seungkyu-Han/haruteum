import { Couple } from '../../couple-core/couple';
import { CoupleEntity } from '../entities/couple.entity';

export function coupleToDomain(entity: CoupleEntity): Couple {
  return new Couple({
    id: entity.id,
    user1Id: entity.user1Id,
    user2Id: entity.user2Id,
    createdAt: entity.createdAt,
    deletedAt: entity.deletedAt,
  });
}

export function coupleToEntity(domain: Couple): CoupleEntity {
  return {
    id: domain.id,
    user1Id: domain.user1Id,
    user2Id: domain.user2Id,
    createdAt: domain.createdAt,
    deletedAt: domain.deletedAt,
  } as CoupleEntity;
}
