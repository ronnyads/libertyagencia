import type { IncomingMessage, ServerResponse } from 'node:http'
import { createHash } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const MAX_BODY_SIZE = 16 * 1024

function reply(res: ServerResponse, status: number, body: Record<string, unknown>) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(JSON.stringify(body))
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > MAX_BODY_SIZE) throw new Error('payload_too_large')
    chunks.push(buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST')
    return reply(res, 405, { error: 'Método não permitido' })
  }

  const supabaseUrl = process.env.CRM_SUPABASE_URL?.trim()
  const supabaseSecret = process.env.CRM_SUPABASE_SECRET?.trim()
  const tenantId = process.env.CRM_TENANT_ID?.trim()
  if (!supabaseUrl || !supabaseSecret || !tenantId) {
    return reply(res, 503, { error: 'Integração temporariamente indisponível' })
  }

  try {
    const raw = await readJson(req) as Record<string, unknown>
    const text = (key: string, max = 500) => typeof raw?.[key] === 'string'
      ? (raw[key] as string).trim().slice(0, max) || null
      : null
    const requestId = text('request_id', 36)
    const formType = text('form_type', 20)
    const nome = text('nome', 160)
    const whatsapp = (text('whatsapp', 40) || '').replace(/\D/g, '')
    const normalizedWhatsapp = (whatsapp.length === 10 || whatsapp.length === 11) ? `55${whatsapp}` : whatsapp
    const email = text('email', 254)?.toLowerCase() || null
    if (!requestId || !/^[0-9a-f-]{36}$/i.test(requestId) || !['lead', 'mentoria'].includes(formType || '') ||
        !nome || normalizedWhatsapp.length < 10 || normalizedWhatsapp.length > 15 ||
        (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return reply(res, 400, { error: 'Dados do formulário inválidos' })
    }

    const crm = createClient(supabaseUrl, supabaseSecret, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const forwardedHeader = req.headers['x-forwarded-for']
    const clientAddress = (Array.isArray(forwardedHeader) ? forwardedHeader[0] : forwardedHeader)
      ?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'
    const clientHash = createHash('sha256')
      .update(`${tenantId}:${clientAddress}`)
      .digest('hex')
    const { data: allowed, error: rateLimitError } = await crm.rpc('consume_api_rate_limit', {
      p_key: `form:liberty-agencia:${clientHash}`,
      p_limit: 30,
      p_window_seconds: 3600,
    })
    if (rateLimitError || allowed !== true) {
      return reply(res, rateLimitError ? 503 : 429, {
        error: rateLimitError
          ? 'Integração temporariamente indisponível'
          : 'Muitas tentativas. Tente novamente mais tarde.',
      })
    }

    const { data: submission, error: ledgerError } = await crm.from('form_lead_submissions').insert({
      tenant_id: tenantId,
      request_id: requestId,
      form_type: formType,
      source: 'liberty_agencia',
    }).select('id').single()
    if (ledgerError?.code === '23505') return reply(res, 200, { ok: true, duplicate: true })
    if (ledgerError || !submission) throw new Error(`ledger:${ledgerError?.code || 'missing'}`)

    let existing: Record<string, unknown> | null = null
    const phoneResult = await crm.from('leads').select('*').eq('tenant_id', tenantId)
      .eq('whatsapp', normalizedWhatsapp).limit(1).maybeSingle()
    existing = phoneResult.data
    if (!existing && email) {
      const emailResult = await crm.from('leads').select('*').eq('tenant_id', tenantId)
        .ilike('email', email).limit(1).maybeSingle()
      existing = emailResult.data
    }

    const serviceInterest = text('servico_interesse', 200)
    const isLiberteC = serviceInterest?.toLowerCase().includes('liberte-c') === true
    const details = [
      `Formulário: ${formType === 'mentoria' ? 'Mentoria' : isLiberteC ? 'Lista de espera LIBERTE-C Mercado Livre' : 'Diagnóstico comercial'}`,
      text('faturamento', 160) ? `Segmento/faturamento: ${text('faturamento', 160)}` : null,
      text('situacao') ? `Situação atual: ${text('situacao')}` : null,
      text('projeto', 2000) ? `Projeto: ${text('projeto', 2000)}` : null,
      text('nivel_tech', 200) ? `Nível técnico: ${text('nivel_tech', 200)}` : null,
      text('objetivo', 2000) ? `Objetivo: ${text('objetivo', 2000)}` : null,
      text('horas_semana', 200) ? `Disponibilidade: ${text('horas_semana', 200)}` : null,
      text('tem_investimento', 200) ? `Investimento: ${text('tem_investimento', 200)}` : null,
    ].filter(Boolean).join('\n')
    const service = formType === 'mentoria' ? 'Mentoria Liberty' : (serviceInterest || 'Diagnóstico Liberty Agência')
    let leadId = typeof existing?.id === 'string' ? existing.id : null

    if (leadId) {
      const { error } = await crm.from('leads').update({
        nome,
        whatsapp: normalizedWhatsapp,
        email: email || existing?.email || null,
        instagram: text('instagram', 100)?.replace(/^@/, '') || existing?.instagram || null,
        faturamento: text('faturamento', 160) || existing?.faturamento || null,
        servico_interesse: service,
        utm_source: text('utm_source', 200),
        utm_medium: text('utm_medium', 200),
        utm_campaign: text('utm_campaign', 200),
        updated_at: new Date().toISOString(),
      }).eq('id', leadId).eq('tenant_id', tenantId)
      if (error) {
        await crm.from('form_lead_submissions').delete().eq('id', submission.id)
        throw new Error(`update:${error.code}`)
      }
    } else {
      const { data: lead, error } = await crm.from('leads').insert({
        tenant_id: tenantId,
        nome,
        whatsapp: normalizedWhatsapp,
        email,
        instagram: text('instagram', 100)?.replace(/^@/, '') || null,
        faturamento: text('faturamento', 160),
        servico_interesse: service,
        status: 'novo',
        observacoes: details,
        utm_source: text('utm_source', 200),
        utm_medium: text('utm_medium', 200),
        utm_campaign: text('utm_campaign', 200),
        origem_lead: 'formulario',
      }).select('id').single()
      if (error || !lead) {
        await crm.from('form_lead_submissions').delete().eq('id', submission.id)
        throw new Error(`insert:${error?.code || 'missing'}`)
      }
      leadId = lead.id
    }

    await Promise.all([
      crm.from('atividades').insert({
        tenant_id: tenantId,
        lead_id: leadId,
        tipo: 'outro',
        titulo: formType === 'mentoria'
          ? 'Candidatura de mentoria recebida'
          : isLiberteC ? 'Inscrição na lista LIBERTE-C recebida' : 'Formulário do site recebido',
        descricao: details,
        concluida: false,
      }),
      crm.from('form_lead_submissions').update({ lead_id: leadId }).eq('id', submission.id),
    ])

    return reply(res, 200, { ok: true })
  } catch (error) {
    console.error('CRM form ingestion failed:', error instanceof Error ? error.message : 'unknown')
    const tooLarge = error instanceof Error && error.message === 'payload_too_large'
    return reply(res, tooLarge ? 413 : 502, {
      error: tooLarge ? 'Dados excedem o limite permitido' : 'Não foi possível enviar seus dados. Tente novamente.',
    })
  }
}
