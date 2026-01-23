-- Fix Appointments Table
-- Created: 2025-03-28 10:00

-- Migração para corrigir a estrutura da tabela de agendamentos para o padrão JSONB
-- Focada exclusivamente em consultas jurídicas

DROP TABLE IF EXISTS appointments;

CREATE TABLE appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uniqueness_check TEXT UNIQUE NOT NULL,
  form_data TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  google_event_id TEXT,
  admin_notes TEXT,
  notification_email_sent INTEGER DEFAULT 0,
  reply_email_sent INTEGER DEFAULT 0,
  email_sent_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_appointments_uniqueness ON appointments(uniqueness_check);

CREATE INDEX idx_appointments_status ON appointments(status);

CREATE INDEX idx_appointments_google_id ON appointments(google_event_id);
