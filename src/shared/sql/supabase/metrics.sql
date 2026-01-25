-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE metrics.metric_exports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  destination text NOT NULL,
  payload jsonb,
  exported_at timestamp with time zone DEFAULT now(),
  seal_hash text NOT NULL,
  CONSTRAINT metric_exports_pkey PRIMARY KEY (id)
);
CREATE TABLE metrics.module_scores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  module_id text NOT NULL,
  score_arch integer NOT NULL CHECK (score_arch >= 0 AND score_arch <= 100),
  score_func integer NOT NULL CHECK (score_func >= 0 AND score_func <= 100),
  score_ux integer NOT NULL CHECK (score_ux >= 0 AND score_ux <= 100),
  score_gov integer NOT NULL CHECK (score_gov >= 0 AND score_gov <= 100),
  report_metadata jsonb,
  audited_at timestamp with time zone DEFAULT now(),
  CONSTRAINT module_scores_pkey PRIMARY KEY (id)
);
CREATE TABLE metrics.query_performance_agg (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  avg_latency_ms double precision,
  error_rate double precision,
  slow_queries_count integer,
  window_start timestamp with time zone DEFAULT now(),
  CONSTRAINT query_performance_agg_pkey PRIMARY KEY (id)
);
CREATE TABLE metrics.resource_usage_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  metric_type text NOT NULL,
  value double precision NOT NULL,
  unit text,
  timestamp timestamp with time zone DEFAULT now(),
  CONSTRAINT resource_usage_history_pkey PRIMARY KEY (id)
);