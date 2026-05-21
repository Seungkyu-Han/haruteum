import { Module } from '@nestjs/common';
import { MemoryCommandServiceImpl } from './services/memory_command_service_impl';
import { MEMORY_COMMAND_SERVICE } from '../memory-core/memory.token';
import { MemoryInfraModule } from '../memory-infra/memory-infra.module';

@Module({
  imports: [MemoryInfraModule],
  providers: [
    {
      provide: MEMORY_COMMAND_SERVICE,
      useClass: MemoryCommandServiceImpl,
    },
  ],
  exports: [MEMORY_COMMAND_SERVICE],
})
export class MemoryApplicationModule {}
