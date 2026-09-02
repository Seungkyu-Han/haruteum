import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../user-core/output/user.repository';
import { userToDomain, userToEntity } from '../mappers/user.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { User } from '../../user-core/user';

@Injectable()
export class UserRepositoryPg implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const userEntity = userToEntity(user);

    await this.userRepository.save(userEntity);

    return user;
  }

  async findByIdWithDeleted(id: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    return userEntity ? userToDomain(userEntity) : null;
  }

  async deleteById(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.userRepository.restore(id);
  }
}
