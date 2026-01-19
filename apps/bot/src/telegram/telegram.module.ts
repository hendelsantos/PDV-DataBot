import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { CommandsService } from './commands.service';
import { ApiClientModule } from '../api-client/api-client.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [ApiClientModule, CartModule],
  providers: [TelegramService, CommandsService],
  exports: [TelegramService],
})
export class TelegramModule {}
