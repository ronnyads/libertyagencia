import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export interface CreateLeadData {
  nome: string
  whatsapp: string
  faturamento: string
  instagram?: string
  servico_interesse?: string
}

export function useCreateLead() {
  return useMutation({
    mutationFn: async (data: CreateLeadData) => {
      const { error } = await supabase.from('leads').insert([{
        nome: data.nome,
        whatsapp: data.whatsapp,
        faturamento: data.faturamento,
        instagram: data.instagram || null,
        servico_interesse: data.servico_interesse || null,
        status: 'novo',
      }])
      if (error) throw error
    },
    onError: () => {
      toast.error('Erro ao enviar formulário. Tente novamente.')
    },
  })
}
