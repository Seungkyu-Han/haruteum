import { Module } from '@nestjs/common';
import { MemoryApiModule } from './memory-api/memory-api.module';

@Module({
  imports: [MemoryApiModule],
})
export class MemoryModule {}
