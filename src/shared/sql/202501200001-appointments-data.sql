
-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  visitor_email TEXT NOT NULL,
  visitor_name TEXT,
  visitor_phone TEXT,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  appointment_type TEXT DEFAULT 'consulta_inicial',
  description TEXT,
  status TEXT DEFAULT 'pending',
  google_event_id TEXT,
  admin_notes TEXT,
  reschedule_count INTEGER DEFAULT 0,
  original_date TEXT,
  approved_by TEXT,
  approved_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(visitor_email);

CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

CREATE INDEX IF NOT EXISTS idx_appointments_google_id ON appointments(google_event_id);
