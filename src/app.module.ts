import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { MemoryModule } from './memory/memory.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path/posix';

@Module({
  imports: [
    ConfigModule,
    MemoryModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
