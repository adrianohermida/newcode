
-- Criação das tabelas de helpdesk
CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Aberto',
  priority TEXT NOT NULL DEFAULT 'Média',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL,
  sender_email TEXT NOT NULL,
  message TEXT NOT NULL,
  attachments TEXT, -- JSON array of URLs
  is_admin INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets(client_email);

CREATE INDEX IF NOT EXISTS idx_messages_ticket ON ticket_messages(ticket_id);
