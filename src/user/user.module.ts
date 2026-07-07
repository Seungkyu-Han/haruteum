import { Module } from '@nestjs/common';
import { UserApiModule } from './user-api/user-api.module';

@Module({
  controllers: [],
  providers: [],
  imports: [UserApiModule],
})
export class UserModule {}
