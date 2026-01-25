-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE ai_agents.agent_faq (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agent_id uuid,
  pergunta text NOT NULL,
  resposta text NOT NULL,
  origem text DEFAULT 'manual'::text,
  categoria text,
  ativo boolean DEFAULT true,
  aprovado boolean DEFAULT false,
  aprovado_por uuid,
  criado_em timestamp with time zone DEFAULT now(),
  CONSTRAINT agent_faq_pkey PRIMARY KEY (id),
  CONSTRAINT agent_faq_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES ai_agents.agents(id)
);
CREATE TABLE ai_agents.agent_faq_learning (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  faq_id uuid,
  tipo_aprendizado text,
  detalhe text,
  confianca_antes numeric,
  confianca_depois numeric,
  criado_em timestamp with time zone DEFAULT now(),
  CONSTRAINT agent_faq_learning_pkey PRIMARY KEY (id),
  CONSTRAINT agent_faq_learning_faq_id_fkey FOREIGN KEY (faq_id) REFERENCES ai_agents.agent_faq(id)
);
CREATE TABLE ai_agents.agent_learning_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agent_id uuid,
  periodo_inicio date,
  periodo_fim date,
  score_confianca numeric,
  taxa_sucesso numeric,
  taxa_erro numeric,
  interacoes integer DEFAULT 0,
  custo_total_usd numeric DEFAULT 0,
  criado_em timestamp with time zone DEFAULT now(),
  CONSTRAINT agent_learning_metrics_pkey PRIMARY KEY (id),
  CONSTRAINT agent_learning_metrics_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES ai_agents.agents(id)
);
CREATE TABLE ai_agents.agent_tools (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agent_id uuid,
  tool_nome text NOT NULL,
  tool_tipo text NOT NULL,
  descricao text,
  escopo jsonb,
  risco text,
  ativo boolean DEFAULT true,
  criado_em timestamp with time zone DEFAULT now(),
  CONSTRAINT agent_tools_pkey PRIMARY KEY (id),
  CONSTRAINT agent_tools_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES ai_agents.agents(id)
);
CREATE TABLE ai_agents.agent_training_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agent_id uuid,
  tipo_treinamento text NOT NULL,
  descricao text,
  iniciado_por uuid,
  status text DEFAULT 'em_andamento'::text,
  criado_em timestamp with time zone DEFAULT now(),
  finalizado_em timestamp with time zone,
  CONSTRAINT agent_training_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT agent_training_sessions_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES ai_agents.agents(id)
);
CREATE TABLE ai_agents.agent_usage_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agent_id uuid,
  usuario_id uuid,
  escritorio_id uuid,
  acao text,
  sucesso boolean,
  tokens_input integer,
  tokens_output integer,
  custo_usd numeric,
  erro_mensagem text,
  criado_em timestamp with time zone DEFAULT now(),
  CONSTRAINT agent_usage_logs_pkey PRIMARY KEY (id),
  CONSTRAINT agent_usage_logs_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES ai_agents.agents(id)
);
CREATE TABLE ai_agents.agent_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agent_id uuid,
  versao integer NOT NULL,
  persona text,
  estilo_linguagem text,
  nivel_autonomia integer,
  alterado_por uuid,
  motivo text,
  criado_em timestamp with time zone DEFAULT now(),
  CONSTRAINT agent_versions_pkey PRIMARY KEY (id),
  CONSTRAINT agent_versions_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES ai_agents.agents(id)
);
CREATE TABLE ai_agents.agents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  tipo text NOT NULL,
  nivel_autonomia integer NOT NULL DEFAULT 1,
  estilo_linguagem text DEFAULT 'formal'::text,
  persona text,
  ativo boolean DEFAULT true,
  escritorio_id uuid,
  criado_por uuid,
  atualizado_por uuid,
  versao_atual integer DEFAULT 1,
  criado_em timestamp with time zone DEFAULT now(),
  atualizado_em timestamp with time zone DEFAULT now(),
  config_ferramentas jsonb DEFAULT '{"email_ativo": false, "agenda_ativa": false, "calculadora_ativa": false}'::jsonb,
  matriz_permissoes jsonb DEFAULT '{}'::jsonb,
  modulos_conectados ARRAY DEFAULT '{}'::text[],
  prompts_treinamento ARRAY DEFAULT '{}'::text[],
  CONSTRAINT agents_pkey PRIMARY KEY (id)
);