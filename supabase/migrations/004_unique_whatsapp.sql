-- Remove leads duplicados mantendo apenas o mais recente por WhatsApp
DELETE FROM leads
WHERE id NOT IN (
  SELECT DISTINCT ON (whatsapp) id
  FROM leads
  ORDER BY whatsapp, created_at DESC
);

-- Agora aplica a constraint
ALTER TABLE leads ADD CONSTRAINT leads_whatsapp_unique UNIQUE (whatsapp);
