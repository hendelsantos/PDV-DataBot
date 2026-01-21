import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  image?: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  telegramId: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  total: number;
  status: string;
  items: OrderItem[];
  paymentMethod: string;
  createdAt: string;
}

@Injectable()
export class ApiClientService {
  private readonly logger = new Logger(ApiClientService.name);
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.API_URL || process.env.API_BASE_URL || 'http://localhost:3001',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.logger.log(`API Client initialized: ${process.env.API_URL || process.env.API_BASE_URL}`);
  }

  // Products
  async getProducts(userId: string): Promise<Product[]> {
    try {
      const response = await this.client.get(`/products/public/${userId}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching products:', error.message);
      return [];
    }
  }

  async getProduct(userId: string, productId: string): Promise<Product | null> {
    try {
      const response = await this.client.get(`/products/public/${userId}/${productId}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching product:', error.message);
      return null;
    }
  }

  // Customers
  async findCustomerByTelegramId(telegramId: string): Promise<Customer | null> {
    try {
      const response = await this.client.get(`/customers/telegram/${telegramId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      this.logger.error('Error finding customer:', error.message);
      return null;
    }
  }

  async createCustomer(data: {
    userId: string;
    telegramId: string;
    name: string;
    phone?: string;
  }): Promise<Customer | null> {
    try {
      const response = await this.client.post('/customers', data);
      return response.data;
    } catch (error) {
      this.logger.error('Error creating customer:', error.message);
      return null;
    }
  }

  // Orders
  async createOrder(data: {
    userId: string;
    customerId: string;
    total: number;
    items: OrderItem[];
    paymentMethod: string;
    notes?: string;
  }): Promise<Order | null> {
    try {
      const response = await this.client.post('/orders', data);
      return response.data;
    } catch (error) {
      this.logger.error('Error creating order:', error.message);
      return null;
    }
  }

  async getCustomerOrders(customerId: string): Promise<Order[]> {
    try {
      const response = await this.client.get(`/orders/customer/${customerId}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching customer orders:', error.message);
      return [];
    }
  }

  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const response = await this.client.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching order:', error.message);
      return null;
    }
  }

  // Bot Instance
  async getBotInstance(userId: string): Promise<any> {
    try {
      const response = await this.client.get(`/bot-instances/user/${userId}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching bot instance:', error.message);
      return null;
    }
  }
}
