import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminSettings } from '@/lib/types';

export const useAdminSettings = () => {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => null as AdminSettings | null,
  });
};

export const useUpdateAdminSettings = () => {
  return useMutation({
    mutationFn: async (_settings: Partial<AdminSettings>) => {
      throw new Error('Not connected');
    },
  });
};
