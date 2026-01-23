
-- Criação das tabelas baseadas nos schemas JSON
CREATE TABLE IF NOT EXISTS escritorio (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  endereco TEXT,
  telefone TEXT,
  email_contato TEXT,
  logo_url TEXT,
  redes_sociais TEXT, -- JSON
  site_url TEXT,
  configuracoes_gerais TEXT, -- JSON
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT UNIQUE NOT NULL,
  escritorio_id INTEGER,
  oab_numero TEXT,
  cpf TEXT,
  telefone TEXT,
  area_atuacao TEXT,
  preferencias_notificacao_id INTEGER,
  preferencias_email_id INTEGER,
  preferencias_sistema_id INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (escritorio_id) REFERENCES escritorio(id)
);

CREATE TABLE IF NOT EXISTS configuracoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo TEXT NOT NULL, -- agenda, email, sistema, notificacao
  owner_id TEXT NOT NULL, -- escritorio_id ou user_email
  data TEXT NOT NULL, -- JSON
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS custom_fields (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  escritorio_id INTEGER,
  entidade TEXT NOT NULL, -- cliente, processo, ticket, user, escritorio
  nome_campo TEXT NOT NULL,
  label TEXT,
  tipo_campo TEXT NOT NULL,
  opcoes TEXT, -- JSON
  obrigatorio INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (escritorio_id) REFERENCES escritorio(id)
);

-- Inserção do escritório principal
INSERT INTO escritorio (nome, cnpj, email_contato, site_url)
VALUES ('Hermida Maia Advocacia', '00.000.000/0001-00', 'contato@hermidamaia.adv.br', 'https://hermidamaia.adv.br');

-- Vinculando o admin principal ao escritório
INSERT INTO user_profiles (user_email, escritorio_id, area_atuacao)
VALUES ('contato@hermidamaia.adv.br', 1, 'Bancário');
