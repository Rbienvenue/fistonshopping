import { useQuery, useMutation } from '@tanstack/react-query';
import { Order, OrderWithItems, CartItem } from '@/lib/types';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => [] as OrderWithItems[],
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (_data: {
      customerName: string;
      phoneNumber: string;
      deliveryAddress: string;
      paymentProofUrl: string;
      items: CartItem[];
      totalAmount: number;
    }) => {
      throw new Error('Not connected');
    },
  });
};

export const useUpdateOrderStatus = () => {
  return useMutation({
    mutationFn: async (_data: { id: string; status: Order['status']; adminComment?: string }) => {
      throw new Error('Not connected');
    },
  });
};

export const useGetOrderById = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => null as OrderWithItems | null,
    enabled: !!orderId,
  });
};

export const useDeleteOrder = () => {
  return useMutation({
    mutationFn: async (_orderId: string) => {
      throw new Error('Not connected');
    },
  });
};
