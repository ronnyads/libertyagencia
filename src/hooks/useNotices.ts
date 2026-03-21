import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface DBNotice {
  id: string;
  message: string;
  type: 'update' | 'bonus' | 'mentorship';
  active: boolean;
  created_at: string;
}

export function useNotices(activeOnly = false) {
  return useQuery({
    queryKey: ['notices', activeOnly],
    queryFn: async () => {
      let q = supabase.from('notices').select('*').order('created_at', { ascending: false });
      if (activeOnly) q = q.eq('active', true);
      const { data, error } = await q;
      if (error) throw error;
      return data as DBNotice[];
    },
  });
}

export function useUpsertNotice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notice: Partial<DBNotice>) => {
      const { error } = notice.id
        ? await supabase.from('notices').update(notice).eq('id', notice.id)
        : await supabase.from('notices').insert(notice);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notices'] }),
  });
}

export function useDeleteNotice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notices').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notices'] }),
  });
}
