
-- Criação das tabelas de agendamento avançado
CREATE TABLE IF NOT EXISTS profissionais (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  especialidade TEXT,
  bio TEXT,
  avatar_url TEXT,
  ativo INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS horarios_disponiveis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profissional_id INTEGER NOT NULL,
  data TEXT NOT NULL,
  hora_inicio TEXT NOT NULL,
  hora_fim TEXT,
  status TEXT DEFAULT 'disponivel',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (profissional_id) REFERENCES profissionais(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_horarios_data ON horarios_disponiveis(data);

CREATE INDEX IF NOT EXISTS idx_horarios_prof ON horarios_disponiveis(profissional_id);

-- Inserir profissional padrão (Dr. Adriano)
INSERT OR IGNORE INTO profissionais (nome, email, especialidade, bio)
VALUES (
  'Dr. Adriano Hermida Maia', 
  'adrianohermida@gmail.com', 
  'Especialista em Superendividamento', 
  'Advogado com vasta experiência na Lei 14.181/2021 e defesa do consumidor.'
);

-- Gerar alguns horários disponíveis para os próximos dias (Exemplo manual para os próximos 3 dias úteis)
-- Nota: Em produção, isso seria gerado por uma rotina administrativa ou IA.
INSERT OR IGNORE INTO horarios_disponiveis (profissional_id, data, hora_inicio, hora_fim)
VALUES 
  (1, date('now', '+1 day'), '09:00', '10:00'),
  (1, date('now', '+1 day'), '10:00', '11:00'),
  (1, date('now', '+1 day'), '14:00', '15:00'),
  (1, date('now', '+1 day'), '15:00', '16:00'),
  (1, date('now', '+2 days'), '09:00', '10:00'),
  (1, date('now', '+2 days'), '11:00', '12:00'),
  (1, date('now', '+2 days'), '16:00', '17:00'),
  (1, date('now', '+3 days'), '10:00', '11:00'),
  (1, date('now', '+3 days'), '15:00', '16:00');
