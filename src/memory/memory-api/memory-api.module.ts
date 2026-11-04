import { Module } from '@nestjs/common';
import { MemoryController } from './controllers/memory.v1.controller';
import { MemoryApplicationModule } from '../memory-application/memory-application.module';
import { GuardianModule } from '@seungkyu/guardian';
import { getGuardianOptions } from '../../config/guardian.config';

@Module({
  imports: [
    MemoryApplicationModule,
    GuardianModule.forRoot(getGuardianOptions()),
  ],
  controllers: [MemoryController],
})
export class MemoryApiModule {}
