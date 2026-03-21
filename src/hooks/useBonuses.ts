import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface DBBonus {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  cta_label: string;
  badge: string;
  visible: boolean;
}

export function useBonuses() {
  return useQuery({
    queryKey: ['bonuses'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bonuses').select('*').order('created_at');
      if (error) throw error;
      return data as DBBonus[];
    },
  });
}

export function useUpsertBonus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bonus: Partial<DBBonus>) => {
      const { error } = bonus.id
        ? await supabase.from('bonuses').update(bonus).eq('id', bonus.id)
        : await supabase.from('bonuses').insert(bonus);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bonuses'] }),
  });
}

export function useDeleteBonus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('bonuses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bonuses'] }),
  });
}
