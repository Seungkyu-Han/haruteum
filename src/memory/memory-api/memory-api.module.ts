import { Module } from '@nestjs/common';
import { MemoryController } from './controllers/memory.v1.controller';
import { MemoryApplicationModule } from '../memory-application/memory-application.module';

@Module({
  imports: [MemoryApplicationModule],
  controllers: [MemoryController],
})
export class MemoryApiModule {}
