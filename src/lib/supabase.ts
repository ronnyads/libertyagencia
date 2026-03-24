import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export type LeadStatus =
  | 'novo'
  | 'em_contato'
  | 'qualificado'
  | 'proposta_enviada'
  | 'negociacao'
  | 'ganho'
  | 'perdido'

export type AtividadeTipo = 'ligacao' | 'whatsapp' | 'email' | 'reuniao' | 'outro'

export interface Atividade {
  id: string
  lead_id: string
  tipo: AtividadeTipo
  titulo: string
  descricao: string | null
  prazo: string | null
  concluida: boolean
  concluida_em: string | null
  created_at: string
  // joined
  lead_nome?: string
}

export interface Lead {
  id: string
  nome: string
  whatsapp: string
  faturamento: string
  instagram: string | null
  servico_interesse: string | null
  status: LeadStatus
  observacoes: string | null
  valor_estimado: number | null
  created_at: string
  email: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
}
