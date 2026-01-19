import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
