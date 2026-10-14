import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { sendLeadToCrm } from '@/lib/crm-leads'

export interface CreateLeadData {
  nome: string
  whatsapp: string
  faturamento: string
  email?: string
  instagram?: string
  servico_interesse?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export function useCreateLead() {
  return useMutation({
    mutationFn: async (data: CreateLeadData) => {
      return sendLeadToCrm({ form_type: 'lead', ...data })
    },
    onError: () => {
      toast.error('Erro ao enviar formulario. Tente novamente.')
    },
  })
}
