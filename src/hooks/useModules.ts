import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface DBModule {
  id: string;
  number: number;
  title: string;
  short_desc: string;
  full_desc: string;
  result: string;
  duration: string;
  task_count: number;
  progress: number;
  status: 'completed' | 'in-progress' | 'locked';
  published: boolean;
}

export function useModules() {
  return useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('number');
      if (error) throw error;
      return data as DBModule[];
    },
  });
}

export function useUpdateModule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DBModule> & { id: string }) => {
      const { error } = await supabase.from('modules').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['modules'] }),
  });
}
