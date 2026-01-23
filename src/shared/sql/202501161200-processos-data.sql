
-- Inserção de dados iniciais para processos
INSERT INTO processos (numero_processo, cliente_nome, cliente_email, status, descricao, created_at, updated_at)
VALUES
  ('5001234-56.2024.8.21.0001', 'Maria Silva', 'maria@example.com', 'Em andamento', 'Ação de repactuação de dívidas - Lei 14.181', datetime('now'), datetime('now')),
  ('5005678-90.2023.8.21.0001', 'João Santos', 'joao@example.com', 'Concluído', 'Revisão de contrato bancário - Redução de juros', datetime('now'), datetime('now')),
  ('5009012-34.2024.8.21.0001', 'Ana Costa', 'ana@example.com', 'Em andamento', 'Defesa contra busca e apreensão', datetime('now'), datetime('now'));
