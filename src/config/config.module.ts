import { Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { ErrorReporterModule } from '@seungkyu/error-reporter';

@Module({
  imports: [
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
  ],
})
export class ConfigModule {}
