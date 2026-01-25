-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE ai.ai_agents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  system_instruction text,
  model text DEFAULT 'gemini-3-flash-preview'::text,
  temperature double precision DEFAULT 0.1,
  config jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ai_agents_pkey PRIMARY KEY (id)
);
CREATE TABLE ai.ai_audit_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  module_id text NOT NULL,
  title text,
  content text,
  severity_map jsonb,
  recommendations ARRAY,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ai_audit_reports_pkey PRIMARY KEY (id)
);
CREATE TABLE ai.ai_compliance_scores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  module_id text NOT NULL,
  score integer CHECK (score >= 0 AND score <= 100),
  report_json jsonb,
  audited_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ai_compliance_scores_pkey PRIMARY KEY (id)
);
CREATE TABLE ai.prompt_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agent_id uuid,
  prompt text NOT NULL,
  response text,
  execution_id text,
  duration_ms integer,
  tokens_used integer,
  timestamp timestamp with time zone DEFAULT now(),
  CONSTRAINT prompt_history_pkey PRIMARY KEY (id),
  CONSTRAINT prompt_history_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES ai.ai_agents(id)
);