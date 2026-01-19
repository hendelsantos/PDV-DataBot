import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  private readonly CART_TTL = 3600 * 24; // 24 hours

  constructor(private redisService: RedisService) {}

  private getCartKey(telegramId: string): string {
    return `cart:${telegramId}`;
  }

  async getCart(telegramId: string): Promise<Cart> {
    const cartKey = this.getCartKey(telegramId);
    const cartData = await this.redisService.hgetall(cartKey);

    const items: CartItem[] = [];
    let total = 0;

    for (const [productId, itemJson] of Object.entries(cartData)) {
      try {
        const item: CartItem = JSON.parse(itemJson);
        items.push(item);
        total += item.price * item.quantity;
      } catch (error) {
        this.logger.error(`Error parsing cart item: ${error.message}`);
      }
    }

    return { items, total };
  }

  async addItem(
    telegramId: string,
    productId: string,
    name: string,
    price: number,
    quantity: number = 1,
  ): Promise<void> {
    const cartKey = this.getCartKey(telegramId);

    // Check if item already exists
    const existingItemJson = await this.redisService.hget(cartKey, productId);

    let item: CartItem;
    if (existingItemJson) {
      item = JSON.parse(existingItemJson);
      item.quantity += quantity;
    } else {
      item = { productId, name, price, quantity };
    }

    await this.redisService.hset(cartKey, productId, JSON.stringify(item));
    await this.redisService.expire(cartKey, this.CART_TTL);

    this.logger.log(`Added ${quantity}x ${name} to cart for user ${telegramId}`);
  }

  async removeItem(telegramId: string, productId: string): Promise<void> {
    const cartKey = this.getCartKey(telegramId);
    await this.redisService.hdel(cartKey, productId);
    this.logger.log(`Removed product ${productId} from cart for user ${telegramId}`);
  }

  async updateQuantity(
    telegramId: string,
    productId: string,
    quantity: number,
  ): Promise<void> {
    if (quantity <= 0) {
      await this.removeItem(telegramId, productId);
      return;
    }

    const cartKey = this.getCartKey(telegramId);
    const existingItemJson = await this.redisService.hget(cartKey, productId);

    if (!existingItemJson) {
      this.logger.warn(`Product ${productId} not found in cart`);
      return;
    }

    const item: CartItem = JSON.parse(existingItemJson);
    item.quantity = quantity;

    await this.redisService.hset(cartKey, productId, JSON.stringify(item));
    await this.redisService.expire(cartKey, this.CART_TTL);
  }

  async clearCart(telegramId: string): Promise<void> {
    const cartKey = this.getCartKey(telegramId);
    await this.redisService.del(cartKey);
    this.logger.log(`Cleared cart for user ${telegramId}`);
  }

  async getItemCount(telegramId: string): Promise<number> {
    const cart = await this.getCart(telegramId);
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
