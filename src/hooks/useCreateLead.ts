import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { templateDemoGratuita } from '@/lib/email-templates'

export interface CreateLeadData {
  nome: string
  whatsapp: string
  faturamento: string
  email?: string
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
        email: data.email || null,
        instagram: data.instagram || null,
        servico_interesse: data.servico_interesse || null,
        status: 'novo',
      }])
      if (error) throw error

      if (data.email) {
        const { subject, html } = templateDemoGratuita(data.nome, data.whatsapp)
        await supabase.functions.invoke('send-email', {
          body: { to: data.email, subject, html },
        })
      }
    },
    onError: () => {
      toast.error('Erro ao enviar formulario. Tente novamente.')
    },
  })
}
