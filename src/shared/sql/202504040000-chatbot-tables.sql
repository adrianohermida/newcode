
-- Criação das tabelas de suporte ao Chatbot Jurídico

CREATE TABLE IF NOT EXISTS chatbot_intents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT UNIQUE NOT NULL,
  descricao TEXT,
  respostas_base TEXT, -- JSON array
  ativo INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS chatbot_entities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT UNIQUE NOT NULL,
  tipo TEXT DEFAULT 'regex',
  exemplos TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Inserir intenções padrão
INSERT OR IGNORE INTO chatbot_intents (nome, descricao, respostas_base)
VALUES 
('status_processo', 'Consulta o andamento de um processo judicial', '["Vou verificar o status do seu processo. Pode me informar o número CNJ ou seu e-mail?", "Um momento, estou buscando as informações do seu processo..."]'),
('agendar_consulta', 'Inicia o fluxo de agendamento de consulta', '["Claro! Posso ajudar você a agendar uma conversa com nossos especialistas. Qual dia seria melhor para você?", "Para agendar, preciso de alguns dados básicos. Vamos começar?"]'),
('financeiro_faturas', 'Consulta faturas pendentes e links de pagamento', '["Vou verificar se existem faturas pendentes em seu nome.", "Aqui estão as informações financeiras que encontrei:"]'),
('abrir_ticket', 'Abre um chamado de suporte ou dúvida técnica', '["Entendi. Vou abrir um ticket para que nossa equipe analise seu caso detalhadamente.", "Pode descrever sua dúvida para que eu registre o chamado?"]'),
('falar_humano', 'Solicita transferência para um atendente humano', '["Vou transferir você para um de nossos advogados agora mesmo.", "Um momento, estou conectando você com nossa equipe de atendimento."]'),
('saudacao', 'Saudação inicial e boas-vindas', '["Olá! Sou o assistente virtual da Hermida Maia Advocacia. Como posso ajudar você hoje?", "Oi! Em que posso ser útil agora?"]');

-- Inserir entidades padrão
INSERT OR IGNORE INTO chatbot_entities (nome, tipo, exemplos)
VALUES 
('numero_cnj', 'regex', '\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}'),
('email', 'regex', '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'),
('data', 'system', 'Amanhã, segunda-feira, 10/10/2024');
