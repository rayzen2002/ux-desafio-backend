import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { RedisHelper } from '../redis/utils/redis-helpers';

@Module({
  providers: [ProductsService, ProductsRepository, RedisHelper],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
