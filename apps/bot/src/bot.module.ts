import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from './telegram/telegram.module';
import { RedisModule } from './redis/redis.module';
import { ApiClientModule } from './api-client/api-client.module';
import { CartModule } from './cart/cart.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule,
    ApiClientModule,
    CartModule,
    TelegramModule,
  ],
  controllers: [HealthController],
})
export class BotModule {}
