import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface DBStudent {
  id: string;
  name: string;
  role: string;
  created_at: string;
  email?: string;
}

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DBStudent[];
    },
  });
}

export function useStudentProgress(studentId: string) {
  return useQuery({
    queryKey: ['student_progress', studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_progress')
        .select('module_id, lesson_id, completed_at')
        .eq('student_id', studentId);
      if (error) throw error;
      return data;
    },
  });
}

export function useMarkLessonComplete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ studentId, moduleId, lessonId }: { studentId: string; moduleId: string; lessonId: string }) => {
      const { error } = await supabase.from('student_progress').upsert({
        student_id: studentId,
        module_id: moduleId,
        lesson_id: lessonId,
      }, { onConflict: 'student_id,lesson_id' });
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['student_progress', vars.studentId] }),
  });
}
