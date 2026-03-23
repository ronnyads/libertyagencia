import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export type LeadStatus = 'novo' | 'em_contato' | 'qualificado' | 'fechado' | 'perdido'

export interface Lead {
  id: string
  nome: string
  whatsapp: string
  faturamento: string
  instagram: string | null
  servico_interesse: string | null
  status: LeadStatus
  created_at: string
}
