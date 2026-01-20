import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Telegraf, Context } from 'telegraf';
import { CommandsService } from './commands.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);
  private bot: Telegraf;

  constructor(private commandsService: CommandsService) {}

  async onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      this.logger.error('❌ TELEGRAM_BOT_TOKEN not found in environment variables');
      return;
    }

    this.bot = new Telegraf(token);

    try {
      // Verify token is valid
      const botInfo = await this.bot.telegram.getMe();
      this.logger.log(`✅ Authorized as @${botInfo.username}`);

      this.registerCommands();
      this.registerCallbacks();
      this.registerTextHandlers();

      // Start bot
      await this.bot.launch();

      this.logger.log('✅ Telegram bot started successfully');

      // Enable graceful stop
      process.once('SIGINT', () => this.bot.stop('SIGINT'));
      process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
    } catch (error) {
      this.logger.error('❌ Failed to start Telegram bot:', error);
      if (error.code === 409) {
        this.logger.error('👉 This usually means another instance is running. Check for zombie processes.');
      }
    }
  }

  private registerCommands() {
    // Command handlers
    this.bot.command('start', (ctx) => this.commandsService.handleStart(ctx));
    this.bot.command('produtos', (ctx) => this.commandsService.handleProducts(ctx));
    this.bot.command('carrinho', (ctx) => this.commandsService.handleCart(ctx));
    this.bot.command('pedidos', (ctx) => this.commandsService.handleOrders(ctx));
    this.bot.command('ajuda', (ctx) => this.commandsService.handleHelp(ctx));

    this.logger.log('Commands registered');
  }

  private registerCallbacks() {
    // Product detail
    this.bot.action(/^product:(.+)$/, async (ctx) => {
      const productId = ctx.match[1];
      await this.commandsService.handleProductDetail(ctx, productId);
    });

    // Add to cart
    this.bot.action(/^add:(.+):(\d+)$/, async (ctx) => {
      const productId = ctx.match[1];
      const quantity = parseInt(ctx.match[2]);
      await this.commandsService.handleAddToCart(ctx, productId, quantity);
    });

    // Navigation callbacks
    this.bot.action('products', (ctx) => this.commandsService.handleProducts(ctx));
    this.bot.action('cart', (ctx) => this.commandsService.handleCart(ctx));
    this.bot.action('orders', (ctx) => this.commandsService.handleOrders(ctx));
    this.bot.action('checkout', (ctx) => this.commandsService.handleCheckout(ctx));
    this.bot.action('clear_cart', (ctx) => this.commandsService.handleClearCart(ctx));

    // Payment methods
    this.bot.action(/^payment:(.+)$/, async (ctx) => {
      const paymentMethod = ctx.match[1];
      await this.commandsService.handlePayment(ctx, paymentMethod);
    });

    this.logger.log('Callbacks registered');
  }

  private registerTextHandlers() {
    // Keyboard button handlers
    this.bot.hears('🛍️ Ver Produtos', (ctx) => this.commandsService.handleProducts(ctx));
    this.bot.hears('🛒 Meu Carrinho', (ctx) => this.commandsService.handleCart(ctx));
    this.bot.hears('📦 Meus Pedidos', (ctx) => this.commandsService.handleOrders(ctx));
    this.bot.hears('ℹ️ Ajuda', (ctx) => this.commandsService.handleHelp(ctx));

    // Default handler for unknown messages
    this.bot.on('text', async (ctx) => {
      await ctx.reply(
        'Desculpe, não entendi. Use o menu abaixo ou /ajuda para ver os comandos disponíveis.',
      );
    });

    this.logger.log('Text handlers registered');
  }

  async sendMessage(chatId: number, message: string) {
    try {
      await this.bot.telegram.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
      });
    } catch (error) {
      this.logger.error(`Error sending message to ${chatId}:`, error.message);
    }
  }

  async sendNotification(chatId: number, message: string) {
    await this.sendMessage(chatId, `🔔 *Notificação*\n\n${message}`);
  }
}
