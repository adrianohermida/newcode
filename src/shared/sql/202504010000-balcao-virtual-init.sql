
-- Inicialização das tabelas do Balcão Virtual

CREATE TABLE IF NOT EXISTS channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  credentials TEXT,
  webhook_url TEXT,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel_id INTEGER NOT NULL,
  lead_id INTEGER NOT NULL,
  status TEXT DEFAULT 'novo',
  priority TEXT DEFAULT 'media',
  queue_id INTEGER,
  assigned_agent_email TEXT,
  sla_deadline TEXT,
  last_message_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (channel_id) REFERENCES channels(id),
  FOREIGN KEY (lead_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL,
  author_type TEXT NOT NULL,
  author_id TEXT,
  content TEXT NOT NULL,
  attachments TEXT,
  meta TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS queues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  routing_rule TEXT DEFAULT 'round_robin',
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  payload_hash TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Inserir canais padrão
INSERT OR IGNORE INTO channels (type, name, active) VALUES ('web', 'Chat do Site', 1);

INSERT OR IGNORE INTO channels (type, name, active) VALUES ('whatsapp', 'WhatsApp Business', 0);

-- Inserir filas padrão
INSERT OR IGNORE INTO queues (name, routing_rule) VALUES ('Triagem Geral', 'ia_first');

INSERT OR IGNORE INTO queues (name, routing_rule) VALUES ('Jurídico Especializado', 'round_robin');

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_conv_status ON conversations(status);

CREATE INDEX IF NOT EXISTS idx_conv_lead ON conversations(lead_id);

CREATE INDEX IF NOT EXISTS idx_msg_conv ON messages(conversation_id);
