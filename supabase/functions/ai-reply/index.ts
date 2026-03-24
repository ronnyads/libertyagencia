import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  try {
    const { lead_id, conversa_id } = await req.json()
    if (!lead_id || !conversa_id) {
      return new Response(JSON.stringify({ error: 'lead_id e conversa_id são obrigatórios' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── Busca configurações ───────────────────────────────────────────────────
    const { data: configs } = await supabase
      .from('configuracoes')
      .select('id, valor')
      .in('id', ['openai_api_key', 'ia_nome', 'ia_prompt_sistema', 'ia_auto_envio', 'whatsapp_token', 'whatsapp_phone_id'])

    const cfg = Object.fromEntries((configs ?? []).map((c: any) => [c.id, c.valor]))

    const openaiKey = cfg.openai_api_key
    const iaNome = cfg.ia_nome || 'Ana'
    const promptBase = (cfg.ia_prompt_sistema || '').replace('{ia_nome}', iaNome)
    const autoEnvio = cfg.ia_auto_envio === 'true'
    const waToken = cfg.whatsapp_token
    const waPhoneId = cfg.whatsapp_phone_id

    if (!openaiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key não configurada' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── Busca dados do lead ───────────────────────────────────────────────────
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .single()

    if (!lead) {
      return new Response(JSON.stringify({ error: 'Lead não encontrado' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── Busca histórico da conversa ───────────────────────────────────────────
    const { data: historico } = await supabase
      .from('mensagens')
      .select('remetente, conteudo, created_at')
      .eq('conversa_id', conversa_id)
      .order('created_at', { ascending: true })
      .limit(20)

    // ── Monta contexto do lead ────────────────────────────────────────────────
    const leadContext = `
PERFIL DO LEAD:
- Nome: ${lead.nome}
- WhatsApp: ${lead.whatsapp}
- Faturamento: ${lead.faturamento || 'não informado'}
- Serviço de interesse: ${lead.servico_interesse || 'não informado'}
- Instagram: ${lead.instagram || 'não informado'}
- Origem: ${lead.utm_source || '-'} / ${lead.utm_campaign || '-'}
- Status no CRM: ${lead.status}
`.trim()

    // ── Monta histórico para o prompt ─────────────────────────────────────────
    const historicoTexto = (historico ?? []).map((m: any) => {
      const quem = m.remetente === 'lead' ? lead.nome : iaNome
      return `${quem}: ${m.conteudo}`
    }).join('\n')

    const systemPrompt = `${promptBase}

${leadContext}

SCRIPT DE VENDAS:
1. Quebrar o gelo pelo nome, reconhecer o que ele preencheu no formulário
2. Identificar a dor principal com base no faturamento e serviço de interesse
3. Conectar à solução ideal: demo gratuita (negócios) ou mentoria 1:1 (quem quer aprender)
4. Propor próximo passo claro: "posso te mandar o acesso à demo agora" ou "que tal uma call de 20min?"
5. Nunca mencionar preço antes de qualificar completamente
6. Ser direto, humano, sem formalidades. Sempre terminar com pergunta ou CTA.`

    // ── Monta mensagens para a OpenAI ─────────────────────────────────────────
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPrompt },
    ]

    if (historicoTexto) {
      messages.push({ role: 'user', content: `HISTÓRICO DA CONVERSA:\n${historicoTexto}` })
      messages.push({ role: 'assistant', content: 'Entendido. Vou responder com base nesse contexto.' })
    }

    // Última mensagem do lead
    const ultimaMensagem = (historico ?? []).filter((m: any) => m.remetente === 'lead').slice(-1)[0]
    if (ultimaMensagem) {
      messages.push({ role: 'user', content: ultimaMensagem.conteudo })
    } else {
      // Primeira mensagem — IA aborda o lead
      messages.push({ role: 'user', content: `Gere a primeira mensagem de abordagem para esse lead. Seja natural e personalizado.` })
    }

    // ── Chama OpenAI ──────────────────────────────────────────────────────────
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 400,
        temperature: 0.75,
      }),
    })

    const openaiData = await openaiRes.json()

    if (!openaiRes.ok) {
      console.error('OpenAI error:', openaiData)
      return new Response(JSON.stringify({ error: openaiData }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const resposta = openaiData.choices?.[0]?.message?.content?.trim()
    if (!resposta) {
      return new Response(JSON.stringify({ error: 'Resposta vazia da OpenAI' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── Salva mensagem da IA ──────────────────────────────────────────────────
    let waMessageId: string | null = null
    let enviada = false

    if (autoEnvio && waToken && waPhoneId) {
      // Envia via WhatsApp API
      const waRes = await fetch(`https://graph.facebook.com/v19.0/${waPhoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${waToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: lead.whatsapp.replace(/\D/g, '').replace(/^(?!55)/, '55'),
          type: 'text',
          text: { body: resposta },
        }),
      })
      const waData = await waRes.json()
      if (waRes.ok) {
        waMessageId = waData?.messages?.[0]?.id ?? null
        enviada = true
      } else {
        console.error('WhatsApp send error:', waData)
      }
    }

    await supabase.from('mensagens').insert({
      conversa_id: conversa_id,
      remetente: 'ia',
      conteudo: resposta,
      wa_message_id: waMessageId,
      enviada,
    })

    return new Response(JSON.stringify({ success: true, resposta, enviada }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
