import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

export interface OrderNotification {
  id: string;
  type: 'new_order' | 'order_update' | 'order_canceled';
  orderId: string;
  customerName: string;
  total: number;
  itemsCount: number;
  status: string;
  createdAt: string;
}

export interface GenericNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  createdAt: string;
}

@Injectable()
export class NotificationsService {
  constructor(private gateway: NotificationsGateway) {}

  // Notify user about new order
  notifyNewOrder(userId: string, order: any) {
    const notification: OrderNotification = {
      id: `order-${order.id}-${Date.now()}`,
      type: 'new_order',
      orderId: order.id,
      customerName: order.customer?.name || 'Cliente',
      total: order.total,
      itemsCount: Array.isArray(order.items) ? order.items.length : 0,
      status: order.status,
      createdAt: new Date().toISOString(),
    };

    this.gateway.sendToUser(userId, 'new_order', notification);
    return notification;
  }

  // Notify user about order status update
  notifyOrderUpdate(userId: string, order: any) {
    const notification: OrderNotification = {
      id: `order-update-${order.id}-${Date.now()}`,
      type: 'order_update',
      orderId: order.id,
      customerName: order.customer?.name || 'Cliente',
      total: order.total,
      itemsCount: Array.isArray(order.items) ? order.items.length : 0,
      status: order.status,
      createdAt: new Date().toISOString(),
    };

    this.gateway.sendToUser(userId, 'order_update', notification);
    return notification;
  }

  // Send generic notification
  sendNotification(userId: string, notification: Omit<GenericNotification, 'id' | 'createdAt'>) {
    const fullNotification: GenericNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    this.gateway.sendToUser(userId, 'notification', fullNotification);
    return fullNotification;
  }
}
