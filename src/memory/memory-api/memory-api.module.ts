import { Module } from '@nestjs/common';
import { MemoryController } from './controllers/memory.v1.controller';
import { MemoryApplicationModule } from '../memory-application/memory-application.module';
import { GuardianModule } from '@seungkyu/guardian';

@Module({
  imports: [
    MemoryApplicationModule,
    GuardianModule.forRoot({
      accessTokenOptions: {
        secretKey: process.env.JWT_SECRET ?? '',
      },
    }),
  ],
  controllers: [MemoryController],
})
export class MemoryApiModule {}
