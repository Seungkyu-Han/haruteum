import { Couple } from '../../couple';

export interface ICoupleRepository {
  save(couple: Couple): Promise<Couple>;
  findByUserId(userId: string): Promise<Couple | null>;
  findById(id: string): Promise<Couple | null>;
  deleteById(id: string): Promise<void>;
}
