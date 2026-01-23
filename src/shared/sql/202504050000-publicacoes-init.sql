
-- Inicialização da tabela de publicações com suporte a status de leitura e prioridade
CREATE TABLE IF NOT EXISTS publicacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  diario TEXT,
  processo_cnj TEXT NOT NULL,
  data_publicacao TEXT NOT NULL,
  comarca TEXT,
  vara TEXT,
  data_disponibilizacao TEXT,
  palavra_chave TEXT,
  caderno TEXT,
  edicao TEXT,
  pagina_inicial TEXT,
  pagina_final TEXT,
  despacho TEXT,
  conteudo TEXT NOT NULL,
  status_leitura INTEGER DEFAULT 0,
  prioridade TEXT DEFAULT 'Média',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_publicacoes_cnj ON publicacoes(processo_cnj);

CREATE INDEX IF NOT EXISTS idx_publicacoes_data ON publicacoes(data_publicacao);

CREATE INDEX IF NOT EXISTS idx_publicacoes_status ON publicacoes(status_leitura);

-- Inserção de dados de exemplo para teste do módulo
INSERT INTO publicacoes (diario, processo_cnj, data_publicacao, comarca, vara, prioridade, conteudo, status_leitura)
VALUES 
('DJRS', '5001234-56.2024.8.21.0001', date('now'), 'Porto Alegre', '1ª Vara Cível', 'Alta', 'Vistos. Intime-se a parte autora para que se manifeste sobre a contestação apresentada no prazo de 15 dias.', 0),
('DJSP', '5005678-90.2023.8.21.0001', date('now', '-1 day'), 'São Paulo', '2ª Vara da Fazenda Pública', 'Média', 'Sentença proferida. Julgo procedente o pedido inicial para condenar o réu ao pagamento de indenização por danos morais.', 1);
