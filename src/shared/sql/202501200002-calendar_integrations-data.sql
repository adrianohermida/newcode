
-- Tabela de integração Google Calendar
CREATE TABLE IF NOT EXISTS calendar_integrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT UNIQUE NOT NULL,
  google_calendar_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expiry TEXT,
  sync_enabled INTEGER DEFAULT 1,
  auto_approve INTEGER DEFAULT 0,
  working_hours_start TEXT DEFAULT '09:00',
  working_hours_end TEXT DEFAULT '18:00',
  appointment_duration_minutes INTEGER DEFAULT 60,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_calendar_email ON calendar_integrations(user_email);
