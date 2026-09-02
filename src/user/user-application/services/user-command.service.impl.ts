import { Inject, Injectable } from '@nestjs/common';
import { IUserCommandService } from '../../user-core/input/services/user-command.service';
import { USER_REPOSITORY } from '../../user-core/user.token';
import type { IUserRepository } from '../../user-core/output/user.repository';
import { User } from '../../user-core/user';
import { UserNotFoundException } from '../../user-core/exceptions/user-not-found.exception';

@Injectable()
export class UserCommandServiceImpl implements IUserCommandService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async updateUserInfo(
    userId: string,
    nickname?: string,
    email?: string,
  ): Promise<User> {
    const user: User | null = await this.userRepository.findById(userId);

    if (!user) throw new UserNotFoundException();

    user.nickname = nickname;
    user.email = email;

    return await this.userRepository.save(user);
  }
}
