import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorReporterModule } from '@seungkyu/error-reporter';

@Module({
  imports: [
    ErrorReporterModule.forRootAsync({
      imports: [ConfigModule],
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
