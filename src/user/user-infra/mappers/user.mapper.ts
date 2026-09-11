import { User } from '../../user-core/user';
import { UserEntity } from '../entities/user.entity';

export function userToDomain(userEntity: UserEntity): User {
  return new User({
    id: userEntity.id,
    nickname: userEntity.nickname,
    createdAt: userEntity.createdAt,
    deletedAt: userEntity.deletedAt,
  });
}

export function userToEntity(user: User): UserEntity {
  return {
    id: user.id,
    nickname: user.nickname,
    createdAt: user.createdAt,
    deletedAt: user.deletedAt ?? null,
  } as UserEntity;
}
