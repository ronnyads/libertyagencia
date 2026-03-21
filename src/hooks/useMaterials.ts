import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface DBMaterial {
  id: string;
  module_id: string | null;
  name: string;
  description: string;
  type: 'pdf' | 'template' | 'checklist' | 'prompt';
  url: string;
  category: string;
  visible: boolean;
}

export function useMaterials() {
  return useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const { data, error } = await supabase.from('materials').select('*').order('created_at');
      if (error) throw error;
      return data as DBMaterial[];
    },
  });
}

export function useUpsertMaterial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mat: Partial<DBMaterial>) => {
      const { error } = mat.id
        ? await supabase.from('materials').update(mat).eq('id', mat.id)
        : await supabase.from('materials').insert(mat);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['materials'] }),
  });
}

export function useDeleteMaterial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('materials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['materials'] }),
  });
}
