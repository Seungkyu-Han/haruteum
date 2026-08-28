import { Module } from '@nestjs/common';
import { MemoryCommandServiceImpl } from './services/memory-command.service.impl';
import {
  MEMORY_COMMAND_SERVICE,
  MEMORY_QUERY_SERVICE,
} from '../memory-core/memory.token';
import { MemoryInfraModule } from '../memory-infra/memory-infra.module';
import { MemoryQueryServiceImpl } from './services/memory-query.service.impl';

@Module({
  imports: [MemoryInfraModule],
  providers: [
    {
      provide: MEMORY_COMMAND_SERVICE,
      useClass: MemoryCommandServiceImpl,
    },
    {
      provide: MEMORY_QUERY_SERVICE,
      useClass: MemoryQueryServiceImpl,
    },
  ],
  exports: [MEMORY_COMMAND_SERVICE, MEMORY_QUERY_SERVICE],
})
export class MemoryApplicationModule {}
