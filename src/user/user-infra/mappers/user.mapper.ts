import { User } from '../../user-core/user';
import { UserEntity } from '../entities/user.entity';

export function userToDomain(userEntity: UserEntity): User {
  return new User({
    id: userEntity.id,
    email: userEntity.email,
    nickname: userEntity.nickname,
    createdAt: userEntity.createdAt,
    deletedAt: userEntity.deletedAt,
  });
}

export function userToEntity(user: User): UserEntity {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    createdAt: user.createdAt,
    deletedAt: user.deletedAt,
  };
}
