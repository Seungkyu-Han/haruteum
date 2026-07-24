import { Module } from '@nestjs/common';
import { AuthenticationGuard } from './guards/authentication.guard';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: false }), JwtModule.register({})],
  providers: [AuthenticationGuard],
  exports: [AuthenticationGuard],
})
export class CommonModule {}
