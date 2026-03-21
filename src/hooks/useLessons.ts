import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface DBLesson {
  id: string;
  module_id: string;
  number: number;
  title: string;
  duration: string;
  video_url: string;
  objectives: string[];
  summary: string;
  task: string;
  status: 'completed' | 'current' | 'locked';
  published: boolean;
}

export function useLessons(moduleId?: string) {
  return useQuery({
    queryKey: ['lessons', moduleId],
    queryFn: async () => {
      let q = supabase.from('lessons').select('*').order('number');
      if (moduleId) q = q.eq('module_id', moduleId);
      const { data, error } = await q;
      if (error) throw error;
      return data as DBLesson[];
    },
  });
}

export function useAddLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lesson: Omit<DBLesson, 'published'> & { published?: boolean }) => {
      const { error } = await supabase.from('lessons').insert({ ...lesson, published: lesson.published ?? true });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lessons'] }),
  });
}

export function useUpdateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DBLesson> & { id: string }) => {
      const { error } = await supabase.from('lessons').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lessons'] }),
  });
}

export function useDeleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('lessons').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lessons'] }),
  });
}
