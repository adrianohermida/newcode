
-- Criação das tabelas para o módulo de Plano de Pagamento
CREATE TABLE IF NOT EXISTS plano_pagamento (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_email TEXT NOT NULL,
  uniqueness_check TEXT UNIQUE NOT NULL,
  form_data TEXT NOT NULL,
  status TEXT DEFAULT 'Simulação',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS documentos_plano (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_email TEXT NOT NULL,
  uniqueness_check TEXT UNIQUE NOT NULL,
  form_data TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS servicos_solicitados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_email TEXT NOT NULL,
  uniqueness_check TEXT UNIQUE NOT NULL,
  form_data TEXT NOT NULL,
  status TEXT DEFAULT 'Pendente',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_plano_email ON plano_pagamento(client_email);

CREATE INDEX IF NOT EXISTS idx_docs_email ON documentos_plano(client_email);

CREATE INDEX IF NOT EXISTS idx_servicos_email ON servicos_solicitados(client_email);
