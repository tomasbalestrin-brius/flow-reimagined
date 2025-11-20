-- Execute este SQL no SQL Editor do Supabase (aba SQL no painel)
-- Este script adiciona o campo 'status' à tabela aplicacoes_mentoria

-- Adicionar campo status à tabela aplicacoes_mentoria
ALTER TABLE public.aplicacoes_mentoria 
ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'formulario_preenchido';

-- Criar índice para melhor performance nas queries por status
CREATE INDEX IF NOT EXISTS idx_aplicacoes_mentoria_status_updated 
ON aplicacoes_mentoria(status, updated_at DESC);

-- Atualizar registros existentes que não têm status
UPDATE public.aplicacoes_mentoria 
SET status = 'formulario_preenchido' 
WHERE status IS NULL;

-- Verificar se foi criado corretamente
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'aplicacoes_mentoria' 
AND column_name = 'status';
