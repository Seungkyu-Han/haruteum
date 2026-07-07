import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { MemoryModule } from './memory/memory.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path/posix';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule,
    MemoryModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
