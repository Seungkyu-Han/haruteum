import { Injectable } from '@nestjs/common';
import { ICoupleCodeGenerator } from '../../couple-core/output/generators/couple-code.generator';
import { randomInt } from 'crypto';

@Injectable()
export class RandomCoupleCodeGenerator implements ICoupleCodeGenerator {
  // 헷갈리기 쉬운 I, O, 1, 0 제외한 6자리 코드
  private static readonly CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  private static readonly CODE_LENGTH = 6;

  generate(): string {
    let result = '';
    const charsLength = RandomCoupleCodeGenerator.CHARACTERS.length;
    for (let i = 0; i < RandomCoupleCodeGenerator.CODE_LENGTH; i++) {
      const randomIndex = randomInt(0, charsLength);
      result += RandomCoupleCodeGenerator.CHARACTERS[randomIndex];
    }
    return result;
  }
}
