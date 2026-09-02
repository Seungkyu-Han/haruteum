import { User } from '../user';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findByIdWithDeleted(id: string): Promise<User | null>;
  deleteById(id: string): Promise<void>;
}
