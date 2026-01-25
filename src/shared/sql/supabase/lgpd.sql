-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE lgpd.consentimentos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid,
  titular_id uuid,
  finalidade text NOT NULL,
  base_legal text NOT NULL,
  escopo text,
  consentido boolean NOT NULL,
  data_consentimento timestamp with time zone DEFAULT now(),
  data_revogacao timestamp with time zone,
  origem text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT consentimentos_pkey PRIMARY KEY (id)
);
CREATE TABLE lgpd.logs_tratamento (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid,
  titular_id uuid,
  tipo_dado text,
  operacao text,
  finalidade text,
  base_legal text,
  origem text,
  usuario_id uuid,
  ip_origem inet,
  user_agent text,
  data_evento timestamp with time zone DEFAULT now(),
  CONSTRAINT logs_tratamento_pkey PRIMARY KEY (id)
);
CREATE TABLE lgpd.mapa_dados (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  schema_nome text,
  tabela_nome text,
  coluna_nome text,
  tipo_dado text,
  sensivel boolean,
  justificativa text,
  base_legal text,
  CONSTRAINT mapa_dados_pkey PRIMARY KEY (id)
);
CREATE TABLE lgpd.solicitacoes_titular (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid,
  titular_id uuid,
  tipo text,
  status text,
  data_solicitacao timestamp with time zone DEFAULT now(),
  data_resposta timestamp with time zone,
  CONSTRAINT solicitacoes_titular_pkey PRIMARY KEY (id)
);