-- Database Activation
-- Created: 2025-03-25 14:30

-- Registro de ativação do sistema de banco de dados
INSERT INTO configuracoes (tipo, owner_id, data, created_at, updated_at)
VALUES (
  'sistema', 
  'admin', 
  '{"db_status": "active", "version": "1.0.0", "last_check": "2025-03-25"}', 
  datetime('now'), 
  datetime('now')
);

-- Inserção de uma categoria padrão para o blog se não existir
INSERT OR IGNORE INTO blog_posts (titulo, slug, conteudo, resumo, categoria, status, created_at, updated_at)
VALUES (
  'Bem-vindo ao nosso novo portal jurídico',
  'bem-vindo-ao-novo-portal',
  '<p>Estamos felizes em anunciar o lançamento do nosso novo sistema de atendimento e consulta.</p>',
  'Novidades sobre o atendimento digital da Hermida Maia Advocacia.',
  'Institucional',
  'publicado',
  datetime('now'),
  datetime('now')
);
