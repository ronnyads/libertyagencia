-- Tabela de conversas (uma por lead)
CREATE TABLE IF NOT EXISTS conversas (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id      uuid REFERENCES leads(id) ON DELETE CASCADE,
  canal        text NOT NULL DEFAULT 'whatsapp',
  status       text NOT NULL DEFAULT 'ativo',   -- ativo | resolvido | pausado
  ia_ativa     boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS mensagens (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversa_id     uuid NOT NULL REFERENCES conversas(id) ON DELETE CASCADE,
  remetente       text NOT NULL,  -- 'lead' | 'ia' | 'humano'
  conteudo        text NOT NULL,
  wa_message_id   text,
  enviada         boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_conversas_lead_id ON conversas(lead_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_conversa_id ON mensagens(conversa_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_created_at ON mensagens(created_at);

-- RLS
ALTER TABLE conversas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;

-- Políticas: leitura/escrita apenas para autenticados (admin)
CREATE POLICY "conversas_auth_all" ON conversas
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "mensagens_auth_all" ON mensagens
  FOR ALL USING (auth.role() = 'authenticated');

-- Edge Functions podem inserir (service role)
CREATE POLICY "conversas_service_all" ON conversas
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "mensagens_service_all" ON mensagens
  FOR ALL USING (auth.role() = 'service_role');

-- Trigger: atualiza updated_at na conversa quando nova mensagem chega
CREATE OR REPLACE FUNCTION update_conversa_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversas SET updated_at = now() WHERE id = NEW.conversa_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_mensagem_update_conversa
  AFTER INSERT ON mensagens
  FOR EACH ROW EXECUTE FUNCTION update_conversa_updated_at();

-- Novas configurações para IA e WhatsApp
INSERT INTO configuracoes (id, valor) VALUES
  ('whatsapp_token',      '')  ON CONFLICT (id) DO NOTHING;
INSERT INTO configuracoes (id, valor) VALUES
  ('whatsapp_phone_id',   '')  ON CONFLICT (id) DO NOTHING;
INSERT INTO configuracoes (id, valor) VALUES
  ('openai_api_key',      '')  ON CONFLICT (id) DO NOTHING;
INSERT INTO configuracoes (id, valor) VALUES
  ('ia_nome',             'Ana') ON CONFLICT (id) DO NOTHING;
INSERT INTO configuracoes (id, valor) VALUES
  ('ia_auto_envio',       'false') ON CONFLICT (id) DO NOTHING;
INSERT INTO configuracoes (id, valor) VALUES
  ('ia_prompt_sistema',   'Você é {ia_nome}, assistente de vendas da Liberty Agência.
Seu objetivo é qualificar leads e converter em clientes (demo gratuita ou mentoria 1:1).

Regras:
- Sempre use o nome do lead
- Seja direto, humano e confiante. Sem formalidades.
- Máximo 3 parágrafos curtos por mensagem
- Sempre termine com uma pergunta ou chamada para ação clara
- Nunca mencione preço antes de entender o problema
- Se o lead quiser falar com humano, diga que vai chamar alguém da equipe') ON CONFLICT (id) DO NOTHING;
