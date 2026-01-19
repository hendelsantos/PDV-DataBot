import { NestFactory } from '@nestjs/core';
import { BotModule } from './bot.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('BotService');
  
  try {
    const app = await NestFactory.create(BotModule);
    
    const port = process.env.BOT_PORT || 3002;
    await app.listen(port);
    
    logger.log(`🤖 Bot service is running on port ${port}`);
    logger.log(`📡 Connected to API: ${process.env.API_BASE_URL}`);
  } catch (error) {
    logger.error('Failed to start bot service', error);
    process.exit(1);
  }
}

bootstrap();
