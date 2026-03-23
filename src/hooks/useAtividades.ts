import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase, type Atividade, type AtividadeTipo } from '@/lib/supabase'

async function fetchAtividades(): Promise<Atividade[]> {
  const { data, error } = await supabase
    .from('atividades')
    .select('*, leads(nome)')
    .order('prazo', { ascending: true, nullsFirst: false })
  if (error) throw error
  return (data ?? []).map((row: any) => ({
    ...row,
    lead_nome: row.leads?.nome ?? 'Lead removido',
    leads: undefined,
  }))
}

export function useAtividades() {
  return useQuery({
    queryKey: ['atividades'],
    queryFn: fetchAtividades,
    staleTime: 30 * 1000,
  })
}

export interface CreateAtividadeData {
  lead_id: string
  tipo: AtividadeTipo
  titulo: string
  descricao?: string
  prazo?: string
}

export function useCreateAtividade() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateAtividadeData) => {
      const { error } = await supabase.from('atividades').insert([{
        lead_id: data.lead_id,
        tipo: data.tipo,
        titulo: data.titulo,
        descricao: data.descricao || null,
        prazo: data.prazo || null,
        concluida: false,
      }])
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atividades'] })
      toast.success('Atividade criada!')
    },
    onError: () => toast.error('Erro ao criar atividade.'),
  })
}

export function useConcluirAtividade() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('atividades')
        .update({ concluida: true, concluida_em: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['atividades'] }),
    onError: () => toast.error('Erro ao concluir atividade.'),
  })
}

export function useReabrirAtividade() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('atividades')
        .update({ concluida: false, concluida_em: null })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['atividades'] }),
    onError: () => toast.error('Erro ao reabrir atividade.'),
  })
}

export function useDeleteAtividade() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('atividades').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['atividades'] }),
    onError: () => toast.error('Erro ao excluir atividade.'),
  })
}
