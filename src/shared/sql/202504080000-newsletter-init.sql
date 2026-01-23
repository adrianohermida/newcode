-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  nome TEXT,
  consent_given INTEGER DEFAULT 1,
  consent_timestamp TEXT,
  source TEXT,
  status TEXT DEFAULT 'ativo',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_newsletter_project ON newsletter_subscribers (project_id);

CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers (status);