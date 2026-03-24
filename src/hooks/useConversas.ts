import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, type Conversa, type Mensagem } from '@/lib/supabase'

// ── Conversas ──────────────────────────────────────────────────────────────

export function useConversas() {
  return useQuery({
    queryKey: ['conversas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversas')
        .select(`
          *,
          lead:leads(id, nome, whatsapp, email, faturamento, servico_interesse, status, utm_source, utm_campaign)
        `)
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data as Conversa[]
    },
    staleTime: 10 * 1000,
    refetchInterval: 15 * 1000, // polling a cada 15s para inbox em tempo real
  })
}

export function useCreateConversa() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (lead_id: string) => {
      // Verifica se já existe conversa ativa
      const { data: existing } = await supabase
        .from('conversas')
        .select('id')
        .eq('lead_id', lead_id)
        .eq('status', 'ativo')
        .limit(1)
      if (existing && existing.length > 0) return existing[0] as Conversa

      const { data, error } = await supabase
        .from('conversas')
        .insert({ lead_id })
        .select()
        .single()
      if (error) throw error
      return data as Conversa
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversas'] })
    },
  })
}

export function useUpdateConversa() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...fields }: Partial<Conversa> & { id: string }) => {
      const { error } = await supabase
        .from('conversas')
        .update(fields)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversas'] })
    },
  })
}

// ── Mensagens ──────────────────────────────────────────────────────────────

export function useMensagens(conversa_id: string | null) {
  return useQuery({
    queryKey: ['mensagens', conversa_id],
    queryFn: async () => {
      if (!conversa_id) return []
      const { data, error } = await supabase
        .from('mensagens')
        .select('*')
        .eq('conversa_id', conversa_id)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as Mensagem[]
    },
    enabled: !!conversa_id,
    staleTime: 5 * 1000,
    refetchInterval: 8 * 1000, // polling frequente para chat em tempo real
  })
}

export function useEnviarMensagem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      conversa_id,
      conteudo,
      remetente = 'humano',
    }: {
      conversa_id: string
      conteudo: string
      remetente?: 'humano' | 'ia' | 'lead'
    }) => {
      const { data, error } = await supabase
        .from('mensagens')
        .insert({ conversa_id, conteudo, remetente, enviada: remetente !== 'lead' })
        .select()
        .single()
      if (error) throw error
      return data as Mensagem
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['mensagens', vars.conversa_id] })
      queryClient.invalidateQueries({ queryKey: ['conversas'] })
    },
  })
}

export function useGerarRespostaIA() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ lead_id, conversa_id }: { lead_id: string; conversa_id: string }) => {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lead_id, conversa_id }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erro ao gerar resposta')
      return json as { resposta: string; enviada: boolean }
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['mensagens', vars.conversa_id] })
      queryClient.invalidateQueries({ queryKey: ['conversas'] })
    },
  })
}
