import { Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorReporterModule } from '@seungkyu/error-reporter';
import { GuardianModule } from '@seungkyu/guardian';

@Module({
  imports: [
    GuardianModule.forRoot({
      accessTokenOptions: {
        secretKey: process.env.JWT_SECRET ?? '',
      },
    }),
    NestConfigModule.forRoot({
      isGlobal: false,
    }),
    ErrorReporterModule.forRootAsync({
      imports: [NestConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'slack',
        webhookUrl: configService.getOrThrow('WEBHOOK_URL'),
        serverName: configService.getOrThrow('SERVER_NAME'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [NestConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        username: configService.getOrThrow('DB_USERNAME'),
        password: configService.getOrThrow('DB_PASSWORD'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        database: configService.getOrThrow('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class ConfigModule {}
