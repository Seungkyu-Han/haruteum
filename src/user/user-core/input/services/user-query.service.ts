import { User } from '../../user';

export interface IUserQueryService {
  userInfoById(userId: string): Promise<User>;
}
