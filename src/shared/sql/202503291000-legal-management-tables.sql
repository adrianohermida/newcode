
-- Criação das tabelas para gestão avançada de processos

CREATE TABLE IF NOT EXISTS process_movements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  processo_id INTEGER NOT NULL,
  data_movimento TEXT NOT NULL,
  descricao TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (processo_id) REFERENCES processos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hearings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  processo_id INTEGER NOT NULL,
  data_audiencia TEXT NOT NULL,
  local TEXT,
  tipo TEXT,
  status TEXT DEFAULT 'Agendada',
  observacoes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (processo_id) REFERENCES processos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  processo_id INTEGER NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  responsavel_email TEXT,
  data_limite TEXT,
  status TEXT DEFAULT 'Pendente',
  prioridade TEXT DEFAULT 'Média',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (processo_id) REFERENCES processos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS deadlines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  processo_id INTEGER NOT NULL,
  titulo TEXT NOT NULL,
  data_vencimento TEXT NOT NULL,
  status TEXT DEFAULT 'Ativo',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (processo_id) REFERENCES processos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS process_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  processo_id INTEGER NOT NULL,
  titulo TEXT NOT NULL,
  tipo TEXT,
  arquivo_url TEXT NOT NULL,
  conteudo_texto TEXT,
  gerado_por_ia INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (processo_id) REFERENCES processos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_movements_processo ON process_movements(processo_id);

CREATE INDEX IF NOT EXISTS idx_hearings_processo ON hearings(processo_id);

CREATE INDEX IF NOT EXISTS idx_tasks_processo ON tasks(processo_id);

CREATE INDEX IF NOT EXISTS idx_deadlines_processo ON deadlines(processo_id);

CREATE INDEX IF NOT EXISTS idx_documents_processo ON process_documents(processo_id);
