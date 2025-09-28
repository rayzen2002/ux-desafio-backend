import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { EmailConfirmationService } from './email-confirmation.service';
import { RedisHelper } from '../../infra/redis/utils/redis-helpers';

@Module({
  providers: [UsersService, UsersRepository, EmailConfirmationService, RedisHelper],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
