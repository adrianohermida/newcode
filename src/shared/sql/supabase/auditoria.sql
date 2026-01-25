-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE auditoria.logs_sistema (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  entidade text,
  entidade_id uuid,
  acao text,
  usuario_id uuid,
  payload jsonb,
  created_at timestamp with time zone DEFAULT now(),
  origem text,
  CONSTRAINT logs_sistema_pkey PRIMARY KEY (id)
);