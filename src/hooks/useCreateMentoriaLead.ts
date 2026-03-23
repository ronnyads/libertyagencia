import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export interface MentoriaLeadData {
  nome: string
  whatsapp: string
  situacao: string
  projeto: string
  nivel_tech: string
  objetivo: string
  horas_semana: string
  tem_investimento: string
}

export function useCreateMentoriaLead() {
  return useMutation({
    mutationFn: async (data: MentoriaLeadData) => {
      const { error } = await supabase.from('mentoria_leads').insert([{
        ...data,
        status: 'novo',
      }])
      if (error) throw error
    },
    onError: () => {
      toast.error('Erro ao enviar candidatura. Tente novamente.')
    },
  })
}
