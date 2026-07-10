import { User } from '../../user-core/user';
import { UserEntity } from '../entities/user.entity';

export function userToDomain(userEntity: UserEntity): User {
  return new User({
    id: userEntity.id,
    email: userEntity.email,
    name: userEntity.name,
    createdAt: userEntity.createdAt,
  });
}

export function userToEntity(user: User): UserEntity {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}
