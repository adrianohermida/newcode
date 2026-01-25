-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE contexto.conversas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sessao_id uuid,
  origem text,
  mensagem text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT conversas_pkey PRIMARY KEY (id),
  CONSTRAINT conversas_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES contexto.sessoes(id)
);
CREATE TABLE contexto.decisoes_ia (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  entidade text,
  entidade_id uuid,
  decisao jsonb,
  modelo_ia text,
  created_at timestamp with time zone DEFAULT now(),
  explicacao text,
  CONSTRAINT decisoes_ia_pkey PRIMARY KEY (id)
);
CREATE TABLE contexto.estado_usuario (
  usuario_id uuid NOT NULL,
  etapa_fluxo text,
  ultima_acao text,
  contexto jsonb,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT estado_usuario_pkey PRIMARY KEY (usuario_id)
);
CREATE TABLE contexto.sessoes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid,
  canal text,
  ativa boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sessoes_pkey PRIMARY KEY (id)
);