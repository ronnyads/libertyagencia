export interface CrmLeadPayload {
  form_type: 'lead' | 'mentoria' | 'recrutamento_sdr'
  nome: string
  whatsapp: string
  email?: string
  instagram?: string
  faturamento?: string
  servico_interesse?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  situacao?: string
  projeto?: string
  nivel_tech?: string
  objetivo?: string
  horas_semana?: string
  tem_investimento?: string
  consentimento?: boolean
  cidade_estado?: string
  perfil_profissional_url?: string
  situacao_profissional?: string
  experiencia_b2b?: string
  canais_prospeccao?: string
  ferramentas_crm?: string
  disponibilidade?: string
  conforto_metas?: string
  resultado_comercial?: string
  motivo_candidatura?: string
}

export async function sendLeadToCrm(payload: CrmLeadPayload) {
  const response = await fetch('/api/crm-lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      request_id: crypto.randomUUID(),
    }),
  })

  const result = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null
  if (!response.ok || !result?.ok) {
    throw new Error(result?.error || 'crm_unavailable')
  }

  return result
}
