-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE agenda.eventos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tipo text,
  data_inicio timestamp with time zone,
  data_fim timestamp with time zone,
  processo_id uuid,
  cliente_id uuid,
  responsavel_id uuid,
  status text DEFAULT 'agendado'::text,
  prioridade text DEFAULT 'normal'::text,
  created_at timestamp with time zone DEFAULT now(),
  consentimento_id uuid,
  escritorio_id uuid,
  titulo text,
  CONSTRAINT eventos_pkey PRIMARY KEY (id),
  CONSTRAINT eventos_processo_id_fkey FOREIGN KEY (processo_id) REFERENCES processual.processos(id),
  CONSTRAINT eventos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES crm.clientes(id),
  CONSTRAINT eventos_responsavel_id_fkey FOREIGN KEY (responsavel_id) REFERENCES public.usuarios_ext(id),
  CONSTRAINT eventos_consentimento_id_fkey FOREIGN KEY (consentimento_id) REFERENCES lgpd.consentimentos(id),
  CONSTRAINT agenda_eventos_processo_id_fkey FOREIGN KEY (processo_id) REFERENCES judiciario.processos(id)
);