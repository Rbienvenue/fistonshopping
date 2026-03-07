import { useQuery, useMutation } from '@tanstack/react-query';
import { Product } from '@/lib/types';

export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => [] as Product[],
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => null as Product | null,
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: async (_product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
      throw new Error('Not connected');
    },
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: async (_data: Partial<Product> & { id: string }) => {
      throw new Error('Not connected');
    },
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: async (_id: string) => {
      throw new Error('Not connected');
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => [] as string[],
  });
};
