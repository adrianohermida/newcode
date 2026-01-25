-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE ged.documentos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  escritorio_id uuid NOT NULL,
  nome text NOT NULL,
  path text NOT NULL,
  folder_id uuid,
  tamanho bigint DEFAULT 0,
  mime_type text,
  external_provider text DEFAULT 'supabase'::text,
  external_id text,
  external_account_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  criado_por uuid,
  criado_em timestamp with time zone DEFAULT now(),
  atualizado_em timestamp with time zone DEFAULT now(),
  CONSTRAINT documentos_pkey PRIMARY KEY (id)
);
CREATE TABLE ged.google_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  escritorio_id uuid NOT NULL,
  email text NOT NULL,
  access_token text,
  refresh_token text,
  status text DEFAULT 'active'::text,
  metadata jsonb DEFAULT '{}'::jsonb,
  criado_em timestamp with time zone DEFAULT now(),
  CONSTRAINT google_accounts_pkey PRIMARY KEY (id)
);