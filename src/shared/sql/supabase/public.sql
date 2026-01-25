-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.agent_groups (
  agent_id uuid NOT NULL,
  group_id uuid NOT NULL,
  CONSTRAINT agent_groups_pkey PRIMARY KEY (agent_id, group_id),
  CONSTRAINT agent_groups_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id),
  CONSTRAINT agent_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id)
);
CREATE TABLE public.agents (
  id uuid NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT agents_pkey PRIMARY KEY (id),
  CONSTRAINT agents_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  actor_type text,
  actor_id uuid,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id uuid,
  ip_address inet,
  created_at timestamp with time zone DEFAULT now(),
  hash text,
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.blog (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  category text,
  author text,
  published_at timestamp with time zone DEFAULT now(),
  image text,
  read_time integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT blog_pkey PRIMARY KEY (id)
);
CREATE TABLE public.blog_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT blog_categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.canned_folders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT canned_folders_pkey PRIMARY KEY (id)
);
CREATE TABLE public.canned_responses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  folder_id uuid,
  title text NOT NULL,
  body text NOT NULL,
  availability text NOT NULL,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT canned_responses_pkey PRIMARY KEY (id),
  CONSTRAINT canned_responses_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.canned_folders(id),
  CONSTRAINT canned_responses_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.agents(id)
);
CREATE TABLE public.clientes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT clientes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contacts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  role text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contacts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.crm_v12 (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now(),
  metadata jsonb,
  rls_owner uuid,
  CONSTRAINT crm_v12_pkey PRIMARY KEY (id),
  CONSTRAINT crm_v12_rls_owner_fkey FOREIGN KEY (rls_owner) REFERENCES auth.users(id)
);
CREATE TABLE public.google_calendar_tokens (
  user_email text NOT NULL,
  access_token text NOT NULL,
  refresh_token text,
  expires_at text,
  scope text,
  token_type text,
  id_token text,
  created_at text NOT NULL,
  CONSTRAINT google_calendar_tokens_pkey PRIMARY KEY (user_email)
);
CREATE TABLE public.gov_access_control (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  module_id uuid,
  user_id uuid NOT NULL,
  escritorio_id uuid NOT NULL,
  role_id text NOT NULL,
  client_id uuid,
  permissions jsonb DEFAULT '{"read": true, "write": false}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT gov_access_control_pkey PRIMARY KEY (id),
  CONSTRAINT gov_access_control_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.gov_modules(id)
);
CREATE TABLE public.gov_contracts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  module_id uuid UNIQUE,
  technical_specs jsonb NOT NULL DEFAULT '{}'::jsonb,
  roadmap jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT gov_contracts_pkey PRIMARY KEY (id),
  CONSTRAINT gov_contracts_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.gov_modules(id)
);
CREATE TABLE public.gov_modules (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category USER-DEFINED NOT NULL DEFAULT 'core'::module_category,
  status USER-DEFINED NOT NULL DEFAULT 'PENDING'::module_status,
  metadata jsonb DEFAULT '{}'::jsonb,
  escritorio_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT gov_modules_pkey PRIMARY KEY (id)
);
CREATE TABLE public.gov_sprint_tasks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  module_id uuid,
  title text NOT NULL,
  description text,
  status USER-DEFINED NOT NULL DEFAULT 'BACKLOG'::task_status,
  priority USER-DEFINED NOT NULL DEFAULT 'MEDIUM'::task_priority,
  escritorio_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT gov_sprint_tasks_pkey PRIMARY KEY (id),
  CONSTRAINT gov_sprint_tasks_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.gov_modules(id)
);
CREATE TABLE public.groups (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT groups_pkey PRIMARY KEY (id)
);
CREATE TABLE public.lgpd_consents (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  contact_id uuid,
  purpose text NOT NULL,
  granted boolean DEFAULT true,
  granted_at timestamp with time zone DEFAULT now(),
  revoked_at timestamp with time zone,
  CONSTRAINT lgpd_consents_pkey PRIMARY KEY (id),
  CONSTRAINT lgpd_consents_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id)
);
CREATE TABLE public.newsletter_subscribers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  consent_given boolean NOT NULL DEFAULT true,
  project_id uuid,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.oauth_states (
  state text NOT NULL,
  created_at text NOT NULL,
  CONSTRAINT oauth_states_pkey PRIMARY KEY (state)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id text NOT NULL UNIQUE,
  user_id uuid,
  products jsonb NOT NULL,
  total_amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'BRL'::text,
  status text NOT NULL DEFAULT 'pending'::text,
  checkout_session_id text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT posts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.simulations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  totaldebt text,
  monthlyinstallment text,
  monthlyincome text,
  percentage double precision,
  issuperendividado boolean,
  timestamp timestamp with time zone,
  CONSTRAINT simulations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ticket_attachments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  ticket_id uuid,
  thread_id uuid,
  file_path text NOT NULL,
  file_name text,
  file_size bigint,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ticket_attachments_pkey PRIMARY KEY (id),
  CONSTRAINT ticket_attachments_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id),
  CONSTRAINT ticket_attachments_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES public.ticket_threads(id)
);
CREATE TABLE public.ticket_tasks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  ticket_id uuid,
  title text NOT NULL,
  due_at timestamp with time zone,
  completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ticket_tasks_pkey PRIMARY KEY (id),
  CONSTRAINT ticket_tasks_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id)
);
CREATE TABLE public.ticket_threads (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  ticket_id uuid,
  sender_type text NOT NULL,
  sender_email text,
  body text NOT NULL,
  is_internal boolean DEFAULT false,
  message_id text,
  created_at timestamp with time zone DEFAULT now(),
  user_id uuid,
  CONSTRAINT ticket_threads_pkey PRIMARY KEY (id),
  CONSTRAINT ticket_threads_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id)
);
CREATE TABLE public.tickets (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  protocol integer NOT NULL DEFAULT nextval('tickets_protocol_seq'::regclass),
  subject text NOT NULL,
  status USER-DEFINED DEFAULT 'aberto'::ticket_status,
  priority USER-DEFINED DEFAULT 'media'::ticket_priority,
  contact_id uuid,
  group_id uuid,
  agent_id uuid,
  sla_due_at timestamp with time zone,
  reopened boolean DEFAULT false,
  tags ARRAY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  closed_at timestamp with time zone,
  user_id uuid,
  CONSTRAINT tickets_pkey PRIMARY KEY (id),
  CONSTRAINT tickets_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id),
  CONSTRAINT tickets_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id),
  CONSTRAINT tickets_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id)
);
CREATE TABLE public.usuarios_ext (
  id uuid NOT NULL,
  nome text,
  email text,
  tipo text NOT NULL,
  escritorio_id uuid,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT usuarios_ext_pkey PRIMARY KEY (id),
  CONSTRAINT usuarios_ext_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);