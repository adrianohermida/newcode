-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE governanca.admins (
  user_id uuid NOT NULL,
  role text DEFAULT 'admin'::text,
  CONSTRAINT admins_pkey PRIMARY KEY (user_id),
  CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE governanca.agents (
  id uuid NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'agent'::text,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT agents_pkey PRIMARY KEY (id)
);
CREATE TABLE governanca.audit_history (
  id uuid NOT NULL,
  module_id text,
  score integer,
  summary text,
  CONSTRAINT audit_history_pkey PRIMARY KEY (id)
);
CREATE TABLE governanca.audit_ledger (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  execution_id text UNIQUE,
  modulo text,
  log text,
  hash text,
  parent_hash text,
  signature_seal text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_ledger_pkey PRIMARY KEY (id)
);
CREATE TABLE governanca.audit_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  actor_type text,
  actor_id uuid,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id uuid,
  ip_address inet,
  created_at timestamp with time zone DEFAULT now(),
  hash text,
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE governanca.contacts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  role text DEFAULT 'cliente'::text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contacts_pkey PRIMARY KEY (id)
);
CREATE TABLE governanca.devstudio_acoes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  codigo text NOT NULL UNIQUE,
  descricao text NOT NULL,
  tipo text NOT NULL CHECK (tipo = ANY (ARRAY['modulo'::text, 'blueprint'::text, 'auditoria'::text, 'regressao'::text, 'infraestrutura'::text])),
  edge_function text,
  ativa boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT devstudio_acoes_pkey PRIMARY KEY (id)
);
CREATE TABLE governanca.devstudio_execution_ledger (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  execution_id text NOT NULL UNIQUE,
  modulo text NOT NULL,
  sprint text,
  etapa text,
  executado_por text NOT NULL CHECK (executado_por = ANY (ARRAY['ia'::text, 'usuario'::text, 'sistema'::text])),
  usuario_email text,
  status text NOT NULL CHECK (status = ANY (ARRAY['planejado'::text, 'em_execucao'::text, 'bloqueado'::text, 'concluido'::text, 'falhou'::text])),
  progresso integer DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
  input_payload jsonb,
  output_payload jsonb,
  logs text,
  risco_identificado boolean DEFAULT false,
  requer_confirmacao_humana boolean DEFAULT true,
  started_at timestamp with time zone,
  finished_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  acao_id uuid,
  edge_function text,
  CONSTRAINT devstudio_execution_ledger_pkey PRIMARY KEY (id),
  CONSTRAINT devstudio_execution_ledger_acao_id_fkey FOREIGN KEY (acao_id) REFERENCES governanca.devstudio_acoes(id)
);
CREATE TABLE governanca.devstudio_pendencias (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  modulo_id uuid,
  origem text NOT NULL CHECK (origem = ANY (ARRAY['homologacao'::text, 'regressao'::text, 'execucao'::text, 'infraestrutura'::text])),
  referencia_id uuid,
  descricao text NOT NULL,
  nivel text NOT NULL CHECK (nivel = ANY (ARRAY['informativa'::text, 'atencao'::text, 'critica'::text])),
  status text DEFAULT 'aberta'::text CHECK (status = ANY (ARRAY['aberta'::text, 'em_tratamento'::text, 'resolvida'::text, 'ignorada'::text])),
  responsavel text,
  created_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone,
  CONSTRAINT devstudio_pendencias_pkey PRIMARY KEY (id),
  CONSTRAINT devstudio_pendencias_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES governanca.modulos(id)
);
CREATE TABLE governanca.devstudio_sprint_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  modulo_id uuid NOT NULL,
  titulo text NOT NULL,
  tipo text CHECK (tipo = ANY (ARRAY['estrutura'::text, 'seguranca'::text, 'ia'::text, 'ux'::text, 'edge'::text])),
  status text CHECK (status = ANY (ARRAY['backlog'::text, 'todo'::text, 'doing'::text, 'done'::text])),
  bloqueia_homologacao boolean DEFAULT true,
  edge_function text,
  created_at timestamp with time zone DEFAULT now(),
  criterio_done jsonb,
  validado_em timestamp with time zone,
  validado_por text,
  CONSTRAINT devstudio_sprint_tasks_pkey PRIMARY KEY (id),
  CONSTRAINT devstudio_sprint_tasks_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES governanca.modulos(id)
);
CREATE TABLE governanca.execucoes_homologacao (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  plano_id uuid NOT NULL,
  resultado text NOT NULL CHECK (resultado = ANY (ARRAY['aderente'::text, 'parcial'::text, 'divergente'::text])),
  divergencias jsonb,
  riscos jsonb,
  parecer_ia text,
  validado_por text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT execucoes_homologacao_pkey PRIMARY KEY (id),
  CONSTRAINT execucoes_homologacao_plano_id_fkey FOREIGN KEY (plano_id) REFERENCES governanca.planos_estruturais(id)
);
CREATE TABLE governanca.groups (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT groups_pkey PRIMARY KEY (id)
);
CREATE TABLE governanca.ledger (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  execution_id text NOT NULL UNIQUE,
  modulo text NOT NULL,
  executado_por text,
  status text,
  progresso integer,
  logs text,
  hash text,
  parent_hash text,
  signature_seal text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ledger_pkey PRIMARY KEY (id)
);
CREATE TABLE governanca.ledger_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL,
  action_type character varying NOT NULL,
  target_entity character varying NOT NULL,
  sql_executed text,
  status character varying CHECK (status::text = ANY (ARRAY['PENDING'::character varying, 'SUCCESS'::character varying, 'FAILED'::character varying, 'ROLLBACK'::character varying]::text[])),
  metadata jsonb DEFAULT '{}'::jsonb,
  executed_by uuid DEFAULT auth.uid(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ledger_entries_pkey PRIMARY KEY (id)
);
CREATE TABLE governanca.modulo_ai_control (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  modulo_id uuid NOT NULL,
  agente_nome text NOT NULL,
  papel text NOT NULL,
  escopo_permitido ARRAY,
  escopo_bloqueado ARRAY,
  fonte_verdade text CHECK (fonte_verdade = ANY (ARRAY['supabase'::text, 'blueprint'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT modulo_ai_control_pkey PRIMARY KEY (id),
  CONSTRAINT modulo_ai_control_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES governanca.modulos(id)
);
CREATE TABLE governanca.modulo_buckets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  modulo_id uuid NOT NULL,
  bucket_nome text NOT NULL,
  contem_dados_pessoais boolean DEFAULT false,
  politica_acesso text,
  tempo_retentao_dias integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT modulo_buckets_pkey PRIMARY KEY (id),
  CONSTRAINT modulo_buckets_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES governanca.modulos(id)
);
CREATE TABLE governanca.modulo_compliance (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  modulo_id uuid NOT NULL,
  base_legal ARRAY,
  dados_sensiveis boolean DEFAULT false,
  exige_logs boolean DEFAULT true,
  permite_anonimizacao boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT modulo_compliance_pkey PRIMARY KEY (id),
  CONSTRAINT modulo_compliance_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES governanca.modulos(id)
);
CREATE TABLE governanca.modulo_design_contract (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  modulo_id uuid NOT NULL,
  usa_design_tokens boolean DEFAULT true,
  atomic_design_nivel text CHECK (atomic_design_nivel = ANY (ARRAY['atoms'::text, 'molecules'::text, 'organisms'::text, 'pages'::text])),
  permite_css_livre boolean DEFAULT false,
  observacoes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT modulo_design_contract_pkey PRIMARY KEY (id),
  CONSTRAINT modulo_design_contract_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES governanca.modulos(id)
);
CREATE TABLE governanca.modulo_edge_functions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  modulo_id uuid NOT NULL,
  nome_funcao text NOT NULL,
  endpoint_url text NOT NULL,
  descricao text,
  exige_confirmacao_humana boolean DEFAULT false,
  logs_habilitados boolean DEFAULT true,
  ultimo_deploy timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT modulo_edge_functions_pkey PRIMARY KEY (id),
  CONSTRAINT modulo_edge_functions_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES governanca.modulos(id)
);
CREATE TABLE governanca.modulo_engine_db (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  modulo_id uuid NOT NULL,
  schema_nome text NOT NULL,
  tabela_nome text NOT NULL,
  tipo text DEFAULT 'core'::text CHECK (tipo = ANY (ARRAY['core'::text, 'apoio'::text, 'auditoria'::text])),
  contem_dados_sensiveis boolean DEFAULT false,
  rls_ativo boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT modulo_engine_db_pkey PRIMARY KEY (id),
  CONSTRAINT modulo_engine_db_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES governanca.modulos(id)
);
CREATE TABLE governanca.modulo_performance (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  modulo_id uuid NOT NULL,
  usa_realtime boolean DEFAULT false,
  volume_estimado text,
  pontos_criticos text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT modulo_performance_pkey PRIMARY KEY (id),
  CONSTRAINT modulo_performance_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES governanca.modulos(id)
);
CREATE TABLE governanca.modulos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  dominio text NOT NULL,
  critico boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  progresso integer DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
  status_geral text DEFAULT 'em_construcao'::text CHECK (status_geral = ANY (ARRAY['em_construcao'::text, 'bloqueado'::text, 'em_validacao'::text, 'homologado'::text])),
  CONSTRAINT modulos_pkey PRIMARY KEY (id)
);
CREATE TABLE governanca.planos_estruturais (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  modulo_id uuid NOT NULL,
  versao text NOT NULL,
  schema_snapshot jsonb NOT NULL,
  rls_snapshot jsonb,
  views_snapshot jsonb,
  funcoes_snapshot jsonb,
  status text DEFAULT 'proposto'::text CHECK (status = ANY (ARRAY['proposto'::text, 'em_validacao'::text, 'homologado'::text, 'revogado'::text])),
  homologado_por text,
  homologado_em timestamp with time zone,
  observacoes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT planos_estruturais_pkey PRIMARY KEY (id),
  CONSTRAINT planos_estruturais_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES governanca.modulos(id)
);
CREATE TABLE governanca.regressoes_estruturais (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  modulo text NOT NULL,
  dominio text NOT NULL,
  blueprint_versao text NOT NULL,
  plano_estrutural_id uuid,
  tipo_evento text NOT NULL CHECK (tipo_evento = ANY (ARRAY['regressao_estrutural'::text, 'mudanca_nao_homologada'::text, 'quebra_homologacao'::text])),
  nivel text NOT NULL CHECK (nivel = ANY (ARRAY['informativa'::text, 'atencao'::text, 'critica'::text])),
  alteracoes_detectadas jsonb NOT NULL,
  impacto_tecnico text,
  impacto_juridico text,
  homologacao_afetada boolean DEFAULT false,
  requer_acao_humana boolean DEFAULT true,
  detectado_por text DEFAULT 'ia_regressao'::text,
  detectado_em timestamp with time zone DEFAULT now(),
  decisao_humana text CHECK (decisao_humana = ANY (ARRAY['aceita'::text, 'rejeitada'::text, 'em_analise'::text])),
  decidido_por text,
  decidido_em timestamp with time zone,
  observacoes text,
  CONSTRAINT regressoes_estruturais_pkey PRIMARY KEY (id),
  CONSTRAINT regressoes_estruturais_plano_estrutural_id_fkey FOREIGN KEY (plano_estrutural_id) REFERENCES governanca.planos_estruturais(id)
);
CREATE TABLE governanca.sync_status (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  modulo_id uuid NOT NULL,
  ultimo_snapshot timestamp with time zone,
  divergencias_detectadas boolean DEFAULT false,
  resumo_divergencias jsonb,
  status text CHECK (status = ANY (ARRAY['ok'::text, 'pendente'::text, 'divergente'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sync_status_pkey PRIMARY KEY (id),
  CONSTRAINT sync_status_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES governanca.modulos(id)
);
CREATE TABLE governanca.ticket_audit_log (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  modulo_id character varying DEFAULT 'HELP_DESK'::character varying,
  action character varying NOT NULL,
  actor_id uuid,
  details jsonb,
  ip_address inet,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ticket_audit_log_pkey PRIMARY KEY (id)
);
CREATE TABLE governanca.ticket_threads (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  ticket_id uuid,
  author_id uuid,
  author_name text,
  author_type character varying,
  content text NOT NULL,
  is_internal boolean DEFAULT false,
  attachments jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ticket_threads_pkey PRIMARY KEY (id),
  CONSTRAINT ticket_threads_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES governanca.tickets(id)
);
CREATE TABLE governanca.tickets (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  protocol character varying NOT NULL UNIQUE,
  subject text NOT NULL,
  description text,
  status character varying DEFAULT 'OPEN'::character varying,
  priority character varying DEFAULT 'MEDIUM'::character varying,
  category character varying,
  client_id uuid NOT NULL,
  assigned_agent_id uuid,
  last_message_at timestamp with time zone DEFAULT now(),
  sla_deadline timestamp with time zone,
  metadata jsonb DEFAULT '{"source": "WEB", "lgpd_consent": true}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tickets_pkey PRIMARY KEY (id)
);