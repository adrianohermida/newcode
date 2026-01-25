-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE conhecimento.embeddings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  origem text NOT NULL,
  origem_id uuid NOT NULL,
  embedding USER-DEFINED,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT embeddings_pkey PRIMARY KEY (id)
);
CREATE TABLE conhecimento.jurisprudencias (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tribunal text NOT NULL,
  numero_processo text,
  orgao_julgador text,
  ementa text NOT NULL,
  inteiro_teor text,
  data_julgamento date,
  fonte text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT jurisprudencias_pkey PRIMARY KEY (id)
);
CREATE TABLE conhecimento.textos_juridicos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tipo text NOT NULL,
  titulo text NOT NULL,
  conteudo text NOT NULL,
  formato text DEFAULT 'markdown'::text,
  fonte text,
  tags ARRAY,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT textos_juridicos_pkey PRIMARY KEY (id)
);