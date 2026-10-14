import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { sendLeadToCrm } from '@/lib/crm-leads'

export interface MentoriaLeadData {
  nome: string
  whatsapp: string
  email?: string
  situacao: string
  projeto: string
  nivel_tech: string
  objetivo: string
  horas_semana: string
  tem_investimento: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export function useCreateMentoriaLead() {
  return useMutation({
    mutationFn: async (data: MentoriaLeadData) => {
      return sendLeadToCrm({ form_type: 'mentoria', ...data })
    },
    onError: () => {
      toast.error('Erro ao enviar candidatura. Tente novamente.')
    },
  })
}
