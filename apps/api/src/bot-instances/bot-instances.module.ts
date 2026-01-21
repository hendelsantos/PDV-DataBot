import { Module } from '@nestjs/common';
import { BotInstancesController } from './bot-instances.controller';
import { BotInstancesService } from './bot-instances.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BotInstancesController],
  providers: [BotInstancesService],
  exports: [BotInstancesService],
})
export class BotInstancesModule {}
