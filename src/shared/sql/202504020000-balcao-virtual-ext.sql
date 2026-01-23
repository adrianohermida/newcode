
-- Extensão das tabelas do Balcão Virtual

CREATE TABLE IF NOT EXISTS atribuicoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversa_id INTEGER NOT NULL,
  agente_id TEXT NOT NULL,
  tipo TEXT DEFAULT 'humano',
  status TEXT DEFAULT 'ativo',
  iniciado_at TEXT DEFAULT (datetime('now')),
  encerrado_at TEXT,
  FOREIGN KEY (conversa_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chatbot_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  canal_id INTEGER NOT NULL,
  persona_id INTEGER NOT NULL,
  intents TEXT, -- JSON
  fallback_policy TEXT DEFAULT 'transfer_to_human',
  ativo INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (canal_id) REFERENCES channels(id) ON DELETE CASCADE,
  FOREIGN KEY (persona_id) REFERENCES ai_personas(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_atrib_conversa ON atribuicoes(conversa_id);

CREATE INDEX IF NOT EXISTS idx_atrib_agente ON atribuicoes(agente_id);

CREATE INDEX IF NOT EXISTS idx_chatbot_canal ON chatbot_configs(canal_id);

-- Inserir configuração inicial de chatbot para o canal Web
INSERT OR IGNORE INTO chatbot_configs (canal_id, persona_id, intents, fallback_policy, ativo)
VALUES (1, 1, '{"welcome": "Olá! Como posso ajudar?", "status": "Vou verificar o status do seu processo."}', 'transfer_to_human', 1);
