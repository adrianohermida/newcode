-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE judiciario.datajud_sync_status (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  numero_processo text NOT NULL UNIQUE,
  tribunal text,
  ultima_execucao timestamp with time zone,
  ultimo_search_after jsonb,
  status text,
  erro text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT datajud_sync_status_pkey PRIMARY KEY (id)
);
CREATE TABLE judiciario.endpoints (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  categoria text,
  metodo text NOT NULL,
  url text NOT NULL,
  versao text,
  ativo boolean DEFAULT true,
  auth_tipo text NOT NULL,
  auth_header text,
  query_params jsonb,
  path_params jsonb,
  headers jsonb,
  body_schema jsonb,
  response_schema jsonb,
  response_exemplo jsonb,
  rate_limit integer,
  timeout_ms integer DEFAULT 10000,
  base_legal text,
  observacoes text,
  tenant_id uuid,
  criado_por uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT endpoints_pkey PRIMARY KEY (id)
);
CREATE TABLE judiciario.financeiro_processual (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  processo_id uuid,
  data timestamp with time zone NOT NULL,
  descricao text NOT NULL,
  categoria text,
  centro_custo text,
  valor numeric NOT NULL DEFAULT 0,
  situacao text DEFAULT 'A pagar'::text,
  criado_em timestamp with time zone DEFAULT now(),
  CONSTRAINT financeiro_processual_pkey PRIMARY KEY (id),
  CONSTRAINT financeiro_processual_processo_id_fkey FOREIGN KEY (processo_id) REFERENCES judiciario.processos(id)
);
CREATE TABLE judiciario.monitoramento_queue (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  processo_id uuid,
  fonte text,
  status text,
  criado_em timestamp with time zone DEFAULT now(),
  CONSTRAINT monitoramento_queue_pkey PRIMARY KEY (id),
  CONSTRAINT monitoramento_queue_processo_id_fkey FOREIGN KEY (processo_id) REFERENCES judiciario.processos(id)
);
CREATE TABLE judiciario.movimentacoes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  processo_id uuid,
  data_movimentacao timestamp with time zone,
  conteudo text,
  fonte text DEFAULT 'DATAJUD'::text,
  hash_integridade text,
  CONSTRAINT movimentacoes_pkey PRIMARY KEY (id),
  CONSTRAINT movimentacoes_processo_id_fkey FOREIGN KEY (processo_id) REFERENCES judiciario.processos(id)
);
CREATE TABLE judiciario.movimentos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  processo_id uuid NOT NULL,
  tenant_id uuid,
  codigo integer,
  descricao text,
  data_movimento timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT movimentos_pkey PRIMARY KEY (id),
  CONSTRAINT movimentos_processo_fk FOREIGN KEY (processo_id) REFERENCES judiciario.processos(id)
);
CREATE TABLE judiciario.partes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  processo_id uuid NOT NULL,
  tenant_id uuid,
  nome text,
  tipo text,
  polo text,
  documento text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT partes_pkey PRIMARY KEY (id),
  CONSTRAINT partes_processo_fk FOREIGN KEY (processo_id) REFERENCES judiciario.processos(id)
);
CREATE TABLE judiciario.processos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid,
  numero_cnj text UNIQUE,
  numero_processo text,
  titulo text,
  classe text,
  assunto text,
  assunto_principal text,
  orgao_julgador text,
  julgador text,
  tribunal text,
  ramo text,
  comarca text,
  grau integer,
  instancia text,
  tipo_acao text,
  tipo_processo_geral text,
  status text,
  status_atual_processo text,
  prioridade text,
  polo_ativo text,
  polo_passivo text,
  outras_partes text,
  valor_causa numeric,
  segredo_justica boolean,
  arquivado boolean,
  data_ajuizamento date,
  data_distribuicao date,
  data_ultima_movimentacao date,
  data_ultimo_movimento date,
  ultimo_movimento_em timestamp with time zone,
  data_ultima_atualizacao_externa timestamp without time zone,
  sistema text,
  area text,
  link_externo_processo text,
  monitorado_escavador boolean DEFAULT false,
  observacoes text,
  cliente_id uuid,
  advogado_responsavel_id uuid,
  escritorio_id uuid,
  created_by_id uuid,
  created_by text,
  is_sample boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp without time zone,
  CONSTRAINT processos_pkey PRIMARY KEY (id)
);
CREATE TABLE judiciario.publicacoes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  processo_id uuid,
  data_publicacao timestamp with time zone,
  conteudo text,
  diario text,
  tem_prazo boolean DEFAULT false,
  prazo_data timestamp with time zone,
  CONSTRAINT publicacoes_pkey PRIMARY KEY (id),
  CONSTRAINT publicacoes_processo_id_fkey FOREIGN KEY (processo_id) REFERENCES judiciario.processos(id)
);
CREATE TABLE judiciario.riscos_processuais (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  processo_id uuid,
  tipo_risco text,
  probabilidade numeric,
  impacto_financeiro numeric,
  analise_ia text,
  CONSTRAINT riscos_processuais_pkey PRIMARY KEY (id),
  CONSTRAINT riscos_processuais_processo_id_fkey FOREIGN KEY (processo_id) REFERENCES judiciario.processos(id)
);