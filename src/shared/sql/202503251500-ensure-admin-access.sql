
-- Ativação do sistema de banco de dados e painel
INSERT OR REPLACE INTO configuracoes (tipo, owner_id, data, created_at, updated_at)
VALUES (
  'sistema', 
  'admin', 
  '{\"db_status\": \"active\", \"version\": \"1.1.0\", \"last_check\": \"2025-03-25\", \"activated\": true}', 
  datetime('now'), 
  datetime('now')
);

-- Garantir que o escritório principal exista
INSERT OR IGNORE INTO escritorio (id, nome, cnpj, email_contato, site_url)
VALUES (1, 'Hermida Maia Advocacia', '00.000.000/0001-00', 'contato@hermidamaia.adv.br', 'https://hermidamaia.adv.br');

-- Garantir perfil administrativo para o usuário principal
INSERT OR REPLACE INTO user_profiles (user_email, escritorio_id, area_atuacao, oab_numero, created_at, updated_at)
VALUES (
  'adrianohermida@gmail.com', 
  1, 
  'Bancário', 
  '476.963', 
  datetime('now'), 
  datetime('now')
);

-- Garantir perfil administrativo para o e-mail de contato
INSERT OR REPLACE INTO user_profiles (user_email, escritorio_id, area_atuacao, oab_numero, created_at, updated_at)
VALUES (
  'contato@hermidamaia.adv.br', 
  1, 
  'Bancário', 
  '476.963', 
  datetime('now'), 
  datetime('now')
);
