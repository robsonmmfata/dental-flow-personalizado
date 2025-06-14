
-- Criar tabela para armazenar tokens push de dispositivos dos usuários
CREATE TABLE public.device_push_tokens (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  token TEXT NOT NULL,
  platform TEXT, -- exemplo: 'web', 'android', 'ios'
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ
);

-- Ativar RLS
ALTER TABLE public.device_push_tokens ENABLE ROW LEVEL SECURITY;

-- Política para inserir tokens push
CREATE POLICY "Permitir inserir tokens push" ON public.device_push_tokens
  FOR INSERT WITH CHECK (true);

-- Política para selecionar tokens
CREATE POLICY "Permitir selecionar tokens" ON public.device_push_tokens
  FOR SELECT USING (true);

-- Política para atualizar tokens
CREATE POLICY "Permitir atualizar tokens" ON public.device_push_tokens
  FOR UPDATE USING (true);

-- Política para excluir tokens
CREATE POLICY "Permitir excluir tokens" ON public.device_push_tokens
  FOR DELETE USING (true);
