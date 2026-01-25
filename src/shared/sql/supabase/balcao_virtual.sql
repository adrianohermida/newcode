-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE balcao_virtual.logs_conversas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sessao_id uuid,
  role text NOT NULL,
  text text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  criado_em timestamp with time zone DEFAULT now(),
  escritorio_id uuid,
  CONSTRAINT logs_conversas_pkey PRIMARY KEY (id),
  CONSTRAINT logs_conversas_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES balcao_virtual.sessoes_ativas(id)
);
CREATE TABLE balcao_virtual.sessoes_ativas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_email text NOT NULL,
  agente_id uuid,
  status text NOT NULL DEFAULT 'IA_TALKING'::text,
  atribuido_a uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  intervencao_em timestamp with time zone,
  criado_em timestamp with time zone DEFAULT now(),
  atualizado_em timestamp with time zone DEFAULT now(),
  escritorio_id uuid,
  CONSTRAINT sessoes_ativas_pkey PRIMARY KEY (id)
);