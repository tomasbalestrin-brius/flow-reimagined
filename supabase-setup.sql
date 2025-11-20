-- Criação das tabelas para o formulário de mentoria

-- Tabela de aplicações de mentoria
CREATE TABLE IF NOT EXISTS aplicacoes_mentoria (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255),
    telefone VARCHAR(20),
    email VARCHAR(255),
    instagram VARCHAR(100),
    nicho VARCHAR(255),
    cargo VARCHAR(50),
    faturamento VARCHAR(50),
    dificuldade TEXT,
    investimento VARCHAR(100),
    data_agendamento DATE,
    horario_agendamento TIME,
    status VARCHAR(20) DEFAULT 'incompleto',
    ultima_pergunta INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    data_agendamento DATE NOT NULL,
    horario_agendamento TIME NOT NULL,
    nome_cliente VARCHAR(255),
    email_cliente VARCHAR(255),
    telefone_cliente VARCHAR(20),
    status VARCHAR(20) DEFAULT 'confirmado',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(data_agendamento, horario_agendamento)
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE aplicacoes_mentoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para aplicacoes_mentoria
CREATE POLICY "Permitir inserção pública" 
ON aplicacoes_mentoria 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir atualização pública" 
ON aplicacoes_mentoria 
FOR UPDATE 
USING (true);

CREATE POLICY "Permitir leitura pública" 
ON aplicacoes_mentoria 
FOR SELECT 
USING (true);

-- Políticas RLS para agendamentos
CREATE POLICY "Permitir inserção pública de agendamentos" 
ON agendamentos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir leitura de agendamentos" 
ON agendamentos 
FOR SELECT 
USING (true);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_aplicacoes_mentoria_status ON aplicacoes_mentoria(status);
CREATE INDEX IF NOT EXISTS idx_aplicacoes_mentoria_created_at ON aplicacoes_mentoria(created_at);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data_agendamento, horario_agendamento);
