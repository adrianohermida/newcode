-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE crm.atividades_crm (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  entidade_id uuid NOT NULL,
  tipo text NOT NULL,
  descricao text NOT NULL,
  usuario_id uuid,
  criado_em timestamp with time zone DEFAULT now(),
  CONSTRAINT atividades_crm_pkey PRIMARY KEY (id),
  CONSTRAINT atividades_crm_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES auth.users(id)
);
CREATE TABLE crm.clientes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text,
  email text,
  telefone text,
  escritorio_id uuid,
  status text DEFAULT 'ativo'::text,
  created_at timestamp with time zone DEFAULT now(),
  dados_sensiveis boolean DEFAULT true,
  tipo_pessoa text CHECK (tipo_pessoa = ANY (ARRAY['PF'::text, 'PJ'::text])),
  documento text UNIQUE,
  tipo_relacao text DEFAULT 'cliente'::text CHECK (tipo_relacao = ANY (ARRAY['cliente'::text, 'advogado'::text, 'adversa'::text, 'banco'::text])),
  metadata_enriquecimento jsonb DEFAULT '{}'::jsonb,
  atualizado_em timestamp with time zone DEFAULT now(),
  nome_completo text,
  criado_em timestamp with time zone DEFAULT now(),
  lifecycle_status text DEFAULT 'lead'::text,
  lifecycle_id uuid,
  status_ciclo_vida text,
  origem text DEFAULT 'site'::text,
  CONSTRAINT clientes_pkey PRIMARY KEY (id),
  CONSTRAINT clientes_lifecycle_id_fkey FOREIGN KEY (lifecycle_id) REFERENCES crm.pipelines(id)
);
CREATE TABLE crm.config (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tipo text NOT NULL,
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  ordem integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  criado_em timestamp with time zone DEFAULT now(),
  pipeline_id uuid,
  is_final boolean DEFAULT false,
  automation_rules jsonb DEFAULT '{}'::jsonb,
  hex_color text,
  CONSTRAINT config_pkey PRIMARY KEY (id),
  CONSTRAINT config_pipeline_id_fkey FOREIGN KEY (pipeline_id) REFERENCES crm.pipelines(id)
);
CREATE TABLE crm.leads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text,
  email text,
  telefone text,
  origem text,
  status text DEFAULT 'novo'::text,
  escritorio_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  contato_id uuid,
  valor_causa numeric DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now(),
  criado_em timestamp with time zone DEFAULT now(),
  assunto text,
  responsavel_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  pipeline_id uuid,
  fechamento_resultado text,
  tags ARRAY DEFAULT '{}'::text[],
  valor_estimado numeric DEFAULT 0,
  CONSTRAINT leads_pkey PRIMARY KEY (id),
  CONSTRAINT leads_contato_id_fkey FOREIGN KEY (contato_id) REFERENCES crm.clientes(id),
  CONSTRAINT leads_responsavel_id_fkey FOREIGN KEY (responsavel_id) REFERENCES auth.users(id),
  CONSTRAINT leads_pipeline_id_fkey FOREIGN KEY (pipeline_id) REFERENCES crm.pipelines(id)
);
CREATE TABLE crm.pipelines (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  ativo boolean DEFAULT true,
  criado_em timestamp with time zone DEFAULT now(),
  tipo text DEFAULT 'vendas'::text,
  configuracao jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT pipelines_pkey PRIMARY KEY (id)
);