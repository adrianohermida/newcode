-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE tickets.balcao_realtime (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ticket_id uuid,
  evento text,
  payload jsonb,
  created_at timestamp with time zone DEFAULT now(),
  origem text,
  CONSTRAINT balcao_realtime_pkey PRIMARY KEY (id),
  CONSTRAINT fk_balcao_ticket FOREIGN KEY (ticket_id) REFERENCES tickets.tickets(id)
);
CREATE TABLE tickets.ticket_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ticket_id uuid,
  autor_id uuid,
  autor_tipo text,
  mensagem text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ticket_comments_pkey PRIMARY KEY (id),
  CONSTRAINT ticket_comments_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES tickets.tickets(id)
);
CREATE TABLE tickets.ticket_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ticket_id uuid,
  campo text,
  valor_anterior text,
  valor_novo text,
  alterado_por uuid,
  alterado_em timestamp with time zone DEFAULT now(),
  CONSTRAINT ticket_history_pkey PRIMARY KEY (id),
  CONSTRAINT ticket_history_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES tickets.tickets(id)
);
CREATE TABLE tickets.ticket_priorities (
  codigo text NOT NULL,
  descricao text,
  nivel integer,
  CONSTRAINT ticket_priorities_pkey PRIMARY KEY (codigo)
);
CREATE TABLE tickets.ticket_sla (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ticket_id uuid,
  prazo_resposta timestamp with time zone,
  prazo_solucao timestamp with time zone,
  violado boolean DEFAULT false,
  CONSTRAINT ticket_sla_pkey PRIMARY KEY (id),
  CONSTRAINT ticket_sla_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES tickets.tickets(id)
);
CREATE TABLE tickets.ticket_status (
  codigo text NOT NULL,
  descricao text,
  ativo boolean DEFAULT true,
  CONSTRAINT ticket_status_pkey PRIMARY KEY (codigo)
);
CREATE TABLE tickets.tickets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cliente_id uuid,
  canal text,
  status text DEFAULT 'aberto'::text,
  prioridade text,
  created_at timestamp with time zone DEFAULT now(),
  dados_sensiveis boolean DEFAULT true,
  escritorio_id uuid,
  responsavel_id uuid,
  updated_at timestamp with time zone,
  closed_at timestamp with time zone,
  titulo text,
  descricao text,
  situacao text DEFAULT 'aberto'::text,
  CONSTRAINT tickets_pkey PRIMARY KEY (id),
  CONSTRAINT tickets_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES crm.clientes(id),
  CONSTRAINT fk_status FOREIGN KEY (status) REFERENCES tickets.ticket_status(codigo),
  CONSTRAINT fk_prioridade FOREIGN KEY (prioridade) REFERENCES tickets.ticket_priorities(codigo)
);