import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const VERIFY_TOKEN = Deno.env.get('WHATSAPP_VERIFY_TOKEN') ?? 'liberty_verify_token'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  // ── Verificação do webhook pelo Meta ──────────────────────────────────────
  if (req.method === 'GET') {
    const url = new URL(req.url)
    const mode = url.searchParams.get('hub.mode')
    const token = url.searchParams.get('hub.verify_token')
    const challenge = url.searchParams.get('hub.challenge')

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return new Response(challenge, { status: 200 })
    }
    return new Response('Forbidden', { status: 403 })
  }

  // ── Recebe mensagem do lead ───────────────────────────────────────────────
  if (req.method === 'POST') {
    const body = await req.json()
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    try {
      const entry = body?.entry?.[0]
      const changes = entry?.changes?.[0]
      const value = changes?.value
      const messages = value?.messages

      if (!messages || messages.length === 0) {
        return new Response('ok', { status: 200 })
      }

      for (const msg of messages) {
        if (msg.type !== 'text') continue

        const fromPhone = msg.from  // número do lead (ex: 5511999999999)
        const text = msg.text?.body
        const waMessageId = msg.id

        if (!fromPhone || !text) continue

        // Busca lead pelo número de WhatsApp
        const phoneClean = fromPhone.replace(/^55/, '')
        const { data: leads } = await supabase
          .from('leads')
          .select('id')
          .like('whatsapp', `%${phoneClean.slice(-8)}%`)
          .limit(1)

        if (!leads || leads.length === 0) {
          console.log('Lead não encontrado para o número:', fromPhone)
          continue
        }

        const leadId = leads[0].id

        // Busca ou cria conversa ativa
        let conversaId: string
        const { data: existingConversas } = await supabase
          .from('conversas')
          .select('id, ia_ativa')
          .eq('lead_id', leadId)
          .eq('status', 'ativo')
          .limit(1)

        if (existingConversas && existingConversas.length > 0) {
          conversaId = existingConversas[0].id
        } else {
          const { data: novaConversa, error } = await supabase
            .from('conversas')
            .insert({ lead_id: leadId })
            .select('id')
            .single()
          if (error || !novaConversa) {
            console.error('Erro ao criar conversa:', error)
            continue
          }
          conversaId = novaConversa.id
        }

        // Salva mensagem do lead
        await supabase.from('mensagens').insert({
          conversa_id: conversaId,
          remetente: 'lead',
          conteudo: text,
          wa_message_id: waMessageId,
          enviada: true,
        })

        // Verifica se IA está ativa nessa conversa
        const iaAtiva = existingConversas?.[0]?.ia_ativa ?? true

        if (iaAtiva) {
          // Dispara ai-reply de forma assíncrona
          const supabaseUrl = SUPABASE_URL
          fetch(`${supabaseUrl}/functions/v1/ai-reply`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lead_id: leadId, conversa_id: conversaId }),
          }).catch(console.error)
        }
      }

      return new Response('ok', { status: 200 })
    } catch (err) {
      console.error('Webhook error:', err)
      return new Response('ok', { status: 200 }) // sempre retorna 200 pro Meta
    }
  }

  return new Response('Method not allowed', { status: 405 })
})
