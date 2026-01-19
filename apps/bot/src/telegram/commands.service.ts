import { Injectable, Logger } from '@nestjs/common';
import { Context, Markup } from 'telegraf';
import { ApiClientService, Product } from '../api-client/api-client.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class CommandsService {
  private readonly logger = new Logger(CommandsService.name);
  
  // Using test user ID - in production this should come from bot instance config
  private userId: string = 'cmklqylsp00000neo3ihej6wm';

  constructor(
    private apiClient: ApiClientService,
    private cartService: CartService,
  ) {}

  setUserId(userId: string) {
    this.userId = userId;
  }

  async handleStart(ctx: Context) {
    const telegramId = ctx.from?.id.toString();
    const name = ctx.from?.first_name || 'Cliente';

    this.logger.log(`User ${telegramId} started the bot`);

    // Check if customer exists, if not create
    let customer = await this.apiClient.findCustomerByTelegramId(telegramId);
    
    if (!customer) {
      customer = await this.apiClient.createCustomer({
        userId: this.userId,
        telegramId,
        name,
      });
    }

    const welcomeMessage = `
🤖 *Bem-vindo ao BotPDV!*

Olá ${name}! 👋

Aqui você pode:
• Ver nossos produtos
• Fazer pedidos
• Acompanhar suas compras

Use o menu abaixo para começar:
    `.trim();

    await ctx.reply(welcomeMessage, {
      parse_mode: 'Markdown',
      ...Markup.keyboard([
        ['🛍️ Ver Produtos', '🛒 Meu Carrinho'],
        ['📦 Meus Pedidos', 'ℹ️ Ajuda'],
      ])
        .resize()
        .persistent(),
    });
  }

  async handleProducts(ctx: Context) {
    await ctx.reply('🔍 Buscando produtos disponíveis...');

    const products = await this.apiClient.getProducts(this.userId);

    if (!products || products.length === 0) {
      await ctx.reply('😔 Nenhum produto disponível no momento.');
      return;
    }

    const activeProducts = products.filter(p => p.isActive && p.stock > 0);

    if (activeProducts.length === 0) {
      await ctx.reply('😔 Todos os produtos estão esgotados no momento.');
      return;
    }

    await ctx.reply(
      `📦 *Produtos Disponíveis* (${activeProducts.length}):\n\nSelecione um produto para ver detalhes:`,
      { parse_mode: 'Markdown' },
    );

    // Send products in batches of 5
    for (let i = 0; i < activeProducts.length; i += 5) {
      const batch = activeProducts.slice(i, i + 5);
      const buttons = batch.map((product) => [
        Markup.button.callback(
          `${product.name} - R$ ${product.price.toFixed(2)}`,
          `product:${product.id}`,
        ),
      ]);

      await ctx.reply('Escolha um produto:', Markup.inlineKeyboard(buttons));
    }
  }

  async handleProductDetail(ctx: Context, productId: string) {
    const product = await this.apiClient.getProduct(this.userId, productId);

    if (!product) {
      await ctx.answerCbQuery('Produto não encontrado');
      return;
    }

    const message = `
🛍️ *${product.name}*

${product.description || 'Sem descrição'}

💰 *Preço:* R$ ${product.price.toFixed(2)}
📦 *Estoque:* ${product.stock} unidades
${product.category ? `🏷️ *Categoria:* ${product.category}` : ''}
    `.trim();

    const buttons = [
      [Markup.button.callback('➕ Adicionar 1', `add:${productId}:1`)],
      [Markup.button.callback('➕ Adicionar 2', `add:${productId}:2`)],
      [Markup.button.callback('➕ Adicionar 3', `add:${productId}:3`)],
      [Markup.button.callback('« Voltar', 'products')],
    ];

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard(buttons),
    });

    await ctx.answerCbQuery();
  }

  async handleAddToCart(
    ctx: Context,
    productId: string,
    quantity: number,
  ) {
    const telegramId = ctx.from?.id.toString();
    const product = await this.apiClient.getProduct(this.userId, productId);

    if (!product) {
      await ctx.answerCbQuery('❌ Produto não encontrado');
      return;
    }

    if (product.stock < quantity) {
      await ctx.answerCbQuery(`❌ Estoque insuficiente (apenas ${product.stock} disponíveis)`);
      return;
    }

    await this.cartService.addItem(
      telegramId,
      productId,
      product.name,
      product.price,
      quantity,
    );

    const itemCount = await this.cartService.getItemCount(telegramId);

    await ctx.answerCbQuery(`✅ ${quantity}x ${product.name} adicionado ao carrinho!`);
    
    await ctx.reply(
      `✅ Produto adicionado!\n\n🛒 Seu carrinho agora tem ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`,
      Markup.inlineKeyboard([
        [Markup.button.callback('🛒 Ver Carrinho', 'cart')],
        [Markup.button.callback('🛍️ Continuar Comprando', 'products')],
      ]),
    );
  }

  async handleCart(ctx: Context) {
    const telegramId = ctx.from?.id.toString();
    const cart = await this.cartService.getCart(telegramId);

    if (cart.items.length === 0) {
      await ctx.reply(
        '🛒 Seu carrinho está vazio.\n\nQue tal adicionar alguns produtos?',
        Markup.inlineKeyboard([
          [Markup.button.callback('🛍️ Ver Produtos', 'products')],
        ]),
      );
      return;
    }

    let message = '🛒 *Seu Carrinho:*\n\n';

    cart.items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   ${item.quantity}x R$ ${item.price.toFixed(2)} = R$ ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    message += `💰 *Total: R$ ${cart.total.toFixed(2)}*`;

    const buttons = [
      [Markup.button.callback('✅ Finalizar Pedido', 'checkout')],
      [Markup.button.callback('🗑️ Limpar Carrinho', 'clear_cart')],
      [Markup.button.callback('🛍️ Continuar Comprando', 'products')],
    ];

    await ctx.reply(message, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard(buttons),
    });
  }

  async handleCheckout(ctx: Context) {
    const telegramId = ctx.from?.id.toString();
    const cart = await this.cartService.getCart(telegramId);

    if (cart.items.length === 0) {
      await ctx.answerCbQuery('❌ Seu carrinho está vazio');
      return;
    }

    await ctx.answerCbQuery();
    
    const message = `
💳 *Finalizar Pedido*

Total: R$ ${cart.total.toFixed(2)}

Escolha a forma de pagamento:
    `.trim();

    const buttons = [
      [Markup.button.callback('💵 Dinheiro', 'payment:CASH')],
      [Markup.button.callback('💳 Cartão de Crédito', 'payment:CREDIT_CARD')],
      [Markup.button.callback('💳 Cartão de Débito', 'payment:DEBIT_CARD')],
      [Markup.button.callback('📱 PIX', 'payment:PIX')],
      [Markup.button.callback('« Voltar', 'cart')],
    ];

    await ctx.reply(message, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard(buttons),
    });
  }

  async handlePayment(ctx: Context, paymentMethod: string) {
    const telegramId = ctx.from?.id.toString();
    const cart = await this.cartService.getCart(telegramId);

    if (cart.items.length === 0) {
      await ctx.answerCbQuery('❌ Seu carrinho está vazio');
      return;
    }

    // Get customer
    const customer = await this.apiClient.findCustomerByTelegramId(telegramId);

    if (!customer) {
      await ctx.answerCbQuery('❌ Erro ao processar pedido');
      return;
    }

    // Create order
    const order = await this.apiClient.createOrder({
      userId: this.userId,
      customerId: customer.id,
      total: cart.total,
      items: cart.items,
      paymentMethod,
    });

    if (!order) {
      await ctx.answerCbQuery('❌ Erro ao criar pedido');
      await ctx.reply('😔 Desculpe, ocorreu um erro ao processar seu pedido. Tente novamente.');
      return;
    }

    // Clear cart
    await this.cartService.clearCart(telegramId);

    await ctx.answerCbQuery('✅ Pedido realizado com sucesso!');

    const paymentMethodNames = {
      CASH: 'Dinheiro',
      CREDIT_CARD: 'Cartão de Crédito',
      DEBIT_CARD: 'Cartão de Débito',
      PIX: 'PIX',
    };

    const message = `
✅ *Pedido Confirmado!*

📋 *Número do Pedido:* #${order.id.slice(0, 8)}
💰 *Total:* R$ ${order.total.toFixed(2)}
💳 *Pagamento:* ${paymentMethodNames[paymentMethod] || paymentMethod}

Seu pedido está sendo preparado! 🎉

Você receberá atualizações sobre o status do seu pedido.
    `.trim();

    await ctx.reply(message, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('📦 Meus Pedidos', 'orders')],
        [Markup.button.callback('🛍️ Fazer Novo Pedido', 'products')],
      ]),
    });
  }

  async handleOrders(ctx: Context) {
    const telegramId = ctx.from?.id.toString();
    const customer = await this.apiClient.findCustomerByTelegramId(telegramId);

    if (!customer) {
      await ctx.reply('❌ Erro ao buscar pedidos');
      return;
    }

    const orders = await this.apiClient.getCustomerOrders(customer.id);

    if (!orders || orders.length === 0) {
      await ctx.reply(
        '📦 Você ainda não fez nenhum pedido.\n\nQue tal fazer seu primeiro pedido?',
        Markup.inlineKeyboard([
          [Markup.button.callback('🛍️ Ver Produtos', 'products')],
        ]),
      );
      return;
    }

    const statusEmojis = {
      PENDING: '⏳',
      CONFIRMED: '✅',
      PREPARING: '👨‍🍳',
      READY: '📦',
      DELIVERED: '🎉',
      CANCELED: '❌',
    };

    const statusNames = {
      PENDING: 'Pendente',
      CONFIRMED: 'Confirmado',
      PREPARING: 'Em Preparação',
      READY: 'Pronto',
      DELIVERED: 'Entregue',
      CANCELED: 'Cancelado',
    };

    let message = '📦 *Seus Pedidos:*\n\n';

    orders.slice(0, 10).forEach((order, index) => {
      const emoji = statusEmojis[order.status] || '📋';
      const status = statusNames[order.status] || order.status;
      const date = new Date(order.createdAt).toLocaleDateString('pt-BR');
      
      message += `${emoji} *Pedido #${order.id.slice(0, 8)}*\n`;
      message += `   Status: ${status}\n`;
      message += `   Total: R$ ${order.total.toFixed(2)}\n`;
      message += `   Data: ${date}\n\n`;
    });

    await ctx.reply(message, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🛍️ Fazer Novo Pedido', 'products')],
      ]),
    });
  }

  async handleClearCart(ctx: Context) {
    const telegramId = ctx.from?.id.toString();
    await this.cartService.clearCart(telegramId);
    
    await ctx.answerCbQuery('🗑️ Carrinho limpo');
    await ctx.reply('🗑️ Seu carrinho foi limpo com sucesso!');
  }

  async handleHelp(ctx: Context) {
    const message = `
ℹ️ *Ajuda - BotPDV*

*Comandos disponíveis:*
/start - Iniciar o bot
/produtos - Ver produtos disponíveis
/carrinho - Ver seu carrinho
/pedidos - Ver seus pedidos
/ajuda - Mostrar esta mensagem

*Como fazer um pedido:*
1. Use /produtos para ver os produtos
2. Clique em um produto para ver detalhes
3. Adicione produtos ao carrinho
4. Use /carrinho para revisar
5. Finalize o pedido escolhendo o pagamento

*Dúvidas?*
Entre em contato com o suporte.
    `.trim();

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }
}
