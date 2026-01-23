
-- Garantindo que o usuário adrianohermida@gmail.com tenha um perfil de administrador
-- Isso permite que ele acesse o módulo admin mesmo que as variáveis de ambiente falhem
-- Usamos INSERT OR REPLACE para garantir que os dados estejam atualizados
INSERT OR REPLACE INTO user_profiles (user_email, escritorio_id, area_atuacao, oab_numero, created_at, updated_at)
VALUES (
  'adrianohermida@gmail.com', 
  1, 
  'Bancário', 
  '476.963', 
  datetime('now'), 
  datetime('now')
);

-- Também garantimos o e-mail de contato oficial como admin
INSERT OR REPLACE INTO user_profiles (user_email, escritorio_id, area_atuacao, oab_numero, created_at, updated_at)
VALUES (
  'contato@hermidamaia.adv.br', 
  1, 
  'Bancário', 
  '476.963', 
  datetime('now'), 
  datetime('now')
);
