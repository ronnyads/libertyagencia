import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface DBFaq {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

export function useFaqs() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('faqs').select('*').order('order_index');
      if (error) throw error;
      return data as DBFaq[];
    },
  });
}

export function useUpsertFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (faq: Partial<DBFaq>) => {
      const { error } = faq.id
        ? await supabase.from('faqs').update(faq).eq('id', faq.id)
        : await supabase.from('faqs').insert(faq);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['faqs'] }),
  });
}

export function useDeleteFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['faqs'] }),
  });
}
