import { User } from '../../user';

export interface IUserCommandService {
  updateUserInfo(userId: string, name?: string, email?: string): Promise<User>;
}
