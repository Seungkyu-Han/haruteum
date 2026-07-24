import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { MemoryModule } from './memory/memory.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path/posix';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { ConfigModule as ConfigModuleLib } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    ConfigModuleLib.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
    }),
    MemoryModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UserModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
