import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api';
import { Order } from '@/types';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await ordersApi.getAll();
      return response.data as Order[];
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const response = await ordersApi.getOne(id);
      return response.data as Order;
    },
    enabled: !!id,
  });
}
