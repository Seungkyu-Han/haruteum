import { User } from '../../user';

export interface IUserCommandService {
  updateUserInfo(userId: string, name?: string): Promise<User>;
}
