-- Create availability_rules table
CREATE TABLE IF NOT EXISTS availability_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profissional_id INTEGER UNIQUE NOT NULL,
  dias_semana TEXT DEFAULT '[1,2,3,4,5]',
  hora_inicio TEXT DEFAULT '09:00',
  hora_fim TEXT DEFAULT '19:00',
  intervalo_bloqueado_inicio TEXT DEFAULT '13:00',
  intervalo_bloqueado_fim TEXT DEFAULT '14:00',
  duracao_minima INTEGER DEFAULT 15,
  duracao_maxima INTEGER DEFAULT 60,
  espaco_minimo INTEGER DEFAULT 30,
  antecedencia_avaliacao INTEGER DEFAULT 48,
  antecedencia_tecnica INTEGER DEFAULT 72,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (profissional_id) REFERENCES profissionais(id) ON DELETE CASCADE
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  appointment_id INTEGER NOT NULL,
  user_email TEXT NOT NULL,
  amount REAL,
  currency TEXT DEFAULT 'BRL',
  status TEXT DEFAULT 'pendente',
  stripe_session_id TEXT,
  email_details TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);

-- Insert default availability rules for Dr. Adriano (ID 1)
INSERT OR IGNORE INTO availability_rules (profissional_id) VALUES (1);

-- Update appointments table structure (handled by schema rewrite, but ensuring columns exist)
-- Note: In D1, we usually drop and recreate if structure changes significantly during dev
-- but here we'll assume the schema rewrite handles the logic.;