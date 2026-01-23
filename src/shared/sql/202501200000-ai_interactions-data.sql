
-- Tabela de rastreamento de interações IA
CREATE TABLE IF NOT EXISTS ai_interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT UNIQUE NOT NULL,
  visitor_email TEXT,
  visitor_phone TEXT,
  message_count INTEGER DEFAULT 0,
  conversation_data TEXT,
  interaction_type TEXT DEFAULT 'general',
  conversion_status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  admin_intervention_at TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ai_visitor_email ON ai_interactions(visitor_email);

CREATE INDEX IF NOT EXISTS idx_ai_status ON ai_interactions(status);

CREATE INDEX IF NOT EXISTS idx_ai_conversion ON ai_interactions(conversion_status);
