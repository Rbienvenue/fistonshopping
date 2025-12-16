import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminSettings } from '@/lib/types';
import { toast } from 'sonner';

export const useAdminSettings = () => {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      return data as AdminSettings | null;
    },
  });
};

export const useUpdateAdminSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<AdminSettings>) => {
      const { data: existing } = await supabase
        .from('admin_settings')
        .select('id')
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('admin_settings')
          .update(settings)
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('admin_settings')
          .insert(settings)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('Settings updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
