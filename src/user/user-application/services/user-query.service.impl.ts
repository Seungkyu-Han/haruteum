import type { IUserQueryService } from '../../user-core/input/services/user-query.service';
import { User } from '../../user-core/user';
import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../user-core/user.token';
import type { IUserRepository } from '../../user-core/output/user.repository';
import { UserNotFoundException } from '../../user-core/exceptions/user-not-found.exception';

@Injectable()
export class UserQueryServiceImpl implements IUserQueryService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async userInfoById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new UserNotFoundException();

    return user;
  }
}
