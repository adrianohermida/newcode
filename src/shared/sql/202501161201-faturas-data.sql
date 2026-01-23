
-- Inserção de dados iniciais para faturas
INSERT INTO faturas (numero_fatura, cliente_nome, cliente_email, valor, status, data_vencimento, created_at, updated_at)
VALUES
  ('FAT-2024-001', 'Maria Silva', 'maria@example.com', 1500.00, 'Pago', '2024-05-10', datetime('now'), datetime('now')),
  ('FAT-2024-002', 'João Santos', 'joao@example.com', 2200.50, 'Pendente', '2024-06-15', datetime('now'), datetime('now')),
  ('FAT-2024-003', 'Ana Costa', 'ana@example.com', 850.00, 'Atrasado', '2024-05-01', datetime('now'), datetime('now'));
