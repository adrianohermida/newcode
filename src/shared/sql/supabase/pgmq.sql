-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE pgmq.meta (
  queue_name character varying NOT NULL UNIQUE,
  is_partitioned boolean NOT NULL,
  is_unlogged boolean NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);