
-- Tabela de Personas de IA
CREATE TABLE IF NOT EXISTS ai_personas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  tone TEXT DEFAULT 'profissional',
  max_conversation_length INTEGER DEFAULT 50,
  auto_escalate_keywords TEXT,
  enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_personas_project ON ai_personas(project_id);

CREATE INDEX IF NOT EXISTS idx_personas_enabled ON ai_personas(enabled);

-- Tabela de Logs de Consentimento (LGPD)
CREATE TABLE IF NOT EXISTS ai_consent_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  visitor_email TEXT,
  consent_type TEXT NOT NULL,
  consent_given INTEGER DEFAULT 1,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_consent_session ON ai_consent_logs(session_id);

CREATE INDEX IF NOT EXISTS idx_consent_email ON ai_consent_logs(visitor_email);

CREATE INDEX IF NOT EXISTS idx_consent_type ON ai_consent_logs(consent_type);

-- Tabela de Rate Limiting
CREATE TABLE IF NOT EXISTS ai_rate_limits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_identifier TEXT UNIQUE NOT NULL,
  request_count INTEGER DEFAULT 0,
  last_request_at TEXT,
  blocked_until TEXT,
  reason TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ratelimit_identifier ON ai_rate_limits(visitor_identifier);

CREATE INDEX IF NOT EXISTS idx_ratelimit_blocked ON ai_rate_limits(blocked_until);

-- Tabela de Escalações Automáticas
CREATE TABLE IF NOT EXISTS ai_escalations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  trigger_keyword TEXT,
  escalated_to TEXT,
  human_agent_email TEXT,
  resolved INTEGER DEFAULT 0,
  resolution_notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  resolved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_escalation_session ON ai_escalations(session_id);

CREATE INDEX IF NOT EXISTS idx_escalation_resolved ON ai_escalations(resolved);

-- Inserir Persona Padrão
INSERT OR IGNORE INTO ai_personas (name, description, system_prompt, tone, enabled)
VALUES (
  'Padrão Amigável',
  'Persona padrão: Tom empático, acessível, foca em triagem e qualificação',
  'Você é um assistente jurídico amigável do escritório Hermida Maia Advocacia. Sua missão é entender a situação do visitante, fornecer orientação inicial e, se apropriado, agendar uma consulta com advogado especialista. Sempre mantenha tom profissional mas empático. Se detectar urgência ou questão complexa, sugira conversa com humano.',
  'empático',
  1
);

INSERT OR IGNORE INTO ai_personas (name, description, system_prompt, tone, enabled)
VALUES (
  'Formal Jurídico',
  'Tom formal: Respostas estruturadas, referências legais, acesso para advogados',
  'Você é um assistente jurídico formal especializado em Lei 14.181/2021 e defesa do superendividado. Estruture respostas com: (1) Fundamentação legal, (2) Análise caso específico, (3) Próximos passos recomendados. Cite artigos aplicáveis. Mantenha tom profissional e autoritário.',
  'formal',
  1
);
