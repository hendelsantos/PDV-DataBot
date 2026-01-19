export class CreateOrderDto {
  userId: string;
  customerId: string;
  total: number;
  items: OrderItemDto[];
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'OTHER';
  notes?: string;
}

export class OrderItemDto {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export class UpdateOrderStatusDto {
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELED';
}
