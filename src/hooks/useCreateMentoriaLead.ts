import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { templateMentoria } from '@/lib/email-templates'

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
      const { error } = await supabase.from('mentoria_leads').insert([{
        ...data,
        email: data.email || null,
        status: 'novo',
      }])
      if (error) throw error

      if (data.email) {
        const { subject, html } = templateMentoria(data.nome, data.whatsapp)
        await supabase.functions.invoke('send-email', {
          body: { to: data.email, subject, html },
        })
      }
    },
    onError: () => {
      toast.error('Erro ao enviar candidatura. Tente novamente.')
    },
  })
}
