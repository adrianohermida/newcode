
-- Upgrade da tabela de tickets com campos de SLA e gestão
ALTER TABLE tickets ADD COLUMN assigned_agent_email TEXT;

ALTER TABLE tickets ADD COLUMN category TEXT;

ALTER TABLE tickets ADD COLUMN sla_deadline TEXT;

ALTER TABLE tickets ADD COLUMN first_response_at TEXT;

ALTER TABLE tickets ADD COLUMN resolved_at TEXT;

ALTER TABLE tickets ADD COLUMN satisfaction_score INTEGER;

-- Criação da tabela de pastas para organizar templates
CREATE TABLE IF NOT EXISTS ticket_folders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  owner_id TEXT, -- E-mail do usuário ou 'system'
  created_at TEXT DEFAULT (datetime('now'))
);

-- Criação da tabela de templates de resposta
CREATE TABLE IF NOT EXISTS ticket_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  folder_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  availability TEXT DEFAULT 'todos', -- individual, grupo, todos
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (folder_id) REFERENCES ticket_folders(id) ON DELETE CASCADE
);

-- Criação da tabela de tarefas vinculadas a tickets
CREATE TABLE IF NOT EXISTS ticket_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  due_date TEXT,
  status TEXT DEFAULT 'pendente',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON tickets(assigned_agent_email);

CREATE INDEX IF NOT EXISTS idx_tickets_status_priority ON tickets(status, priority);

CREATE INDEX IF NOT EXISTS idx_templates_folder ON ticket_templates(folder_id);

CREATE INDEX IF NOT EXISTS idx_tasks_ticket ON ticket_tasks(ticket_id);

-- Inserção de pastas padrão
INSERT INTO ticket_folders (name, description, owner_id)
VALUES 
  ('Geral', 'Respostas para dúvidas comuns', 'system'),
  ('Agendamento', 'Templates para confirmação de consultas', 'system'),
  ('Processual', 'Informações sobre andamento de processos', 'system');
