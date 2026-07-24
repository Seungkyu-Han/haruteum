import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: false }), JwtModule.register({})],
})
export class CommonModule {}
