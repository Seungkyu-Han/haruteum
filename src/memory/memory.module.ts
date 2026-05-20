import { Module } from '@nestjs/common';
import { MemoryApiModule } from './memory-api/memory-api.module';
import { MemoryApplicationModule } from './memory-application/memory-application.module';
import { MemoryCoreModule } from './memory-core/memory-core.module';
import { MemoryInfraModule } from './memory-infra/memory-infra.module';

@Module({
  imports: [MemoryApiModule, MemoryApplicationModule, MemoryCoreModule, MemoryInfraModule]
})
export class MemoryModule {}
