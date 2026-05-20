import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { MemoryModule } from './memory/memory.module';

@Module({
  imports: [ConfigModule, MemoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
