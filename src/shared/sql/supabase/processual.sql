-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE processual.processos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  numero_processo text,
  tribunal text,
  classe text,
  assunto text,
  cliente_id uuid,
  status text,
  data_distribuicao date,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT processos_pkey PRIMARY KEY (id),
  CONSTRAINT processos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES crm.clientes(id)
);
CREATE TABLE processual.publicacoes_legacy (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  processo_id uuid,
  data_publicacao date,
  conteudo text,
  origem text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT publicacoes_legacy_pkey PRIMARY KEY (id),
  CONSTRAINT publicacoes_processo_id_fkey FOREIGN KEY (processo_id) REFERENCES processual.processos(id)
);