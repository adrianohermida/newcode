-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE solutions.article_feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  article_id uuid,
  is_helpful boolean NOT NULL,
  feedback_text text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT article_feedback_pkey PRIMARY KEY (id),
  CONSTRAINT article_feedback_article_id_fkey FOREIGN KEY (article_id) REFERENCES solutions.articles(id)
);
CREATE TABLE solutions.article_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  article_id uuid,
  viewed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT article_views_pkey PRIMARY KEY (id),
  CONSTRAINT article_views_article_id_fkey FOREIGN KEY (article_id) REFERENCES solutions.articles(id)
);
CREATE TABLE solutions.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid,
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid,
  status text DEFAULT 'published'::text,
  tags ARRAY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT articles_pkey PRIMARY KEY (id),
  CONSTRAINT articles_category_id_fkey FOREIGN KEY (category_id) REFERENCES solutions.categories(id),
  CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id)
);
CREATE TABLE solutions.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text DEFAULT 'BookOpen'::text,
  is_public boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);