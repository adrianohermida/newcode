-- Criação da tabela blog_posts baseada no schema JSON
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id SERIAL PRIMARY KEY,
  project_id TEXT,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  conteudo TEXT NOT NULL,
  resumo TEXT,
  autor_id TEXT,
  autor_nome TEXT,
  imagem_capa_url TEXT,
  categoria_id INTEGER,
  tags TEXT,
  status TEXT DEFAULT 'publicado',
  data_publicacao TIMESTAMP WITH TIME ZONE,
  meta_titulo TEXT,
  meta_descricao TEXT,
  canonical_url TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices e constraints adicionais
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_categoria_id ON public.blog_posts(categoria_id);
