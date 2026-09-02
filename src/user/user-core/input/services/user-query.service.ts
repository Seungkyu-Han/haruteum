import { User } from '../../user';

export interface UserQueryService {
  userInfoById(id: string): Promise<User>;
}
