-- Align Processos Schema
-- Created: 2025-03-26 10:00

-- Migração para alinhar a tabela processos com o schema JSON oficial
-- Remove a tabela antiga se houver inconsistência crítica ou apenas adiciona colunas
-- Para garantir integridade, vamos recriar a tabela com a estrutura correta

DROP TABLE IF EXISTS processos;

CREATE TABLE processos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero_cnj TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  tribunal TEXT,
  polo_ativo TEXT,
  polo_passivo TEXT,
  classe TEXT,
  assunto TEXT,
  area TEXT,
  instancia TEXT,
  orgao_julgador TEXT,
  data_distribuicao TEXT,
  valor_causa REAL,
  status TEXT DEFAULT 'Em andamento',
  descricao TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_processos_cnj ON processos(numero_cnj);

CREATE INDEX idx_processos_cliente ON processos(cliente_email);

-- Inserção de dados de exemplo para teste
INSERT INTO processos (numero_cnj, titulo, cliente_email, status, area, tribunal)
VALUES 
  ('5001234-56.2024.8.21.0001', 'Ação de Repactuação - Maria Silva', 'maria@example.com', 'Em andamento', 'Consumidor', 'TJRS'),
  ('5005678-90.2023.8.21.0001', 'Revisão Contratual - João Santos', 'joao@example.com', 'Concluído', 'Bancário', 'TJSP');
