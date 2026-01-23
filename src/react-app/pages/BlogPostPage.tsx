

/**
 * @description Página de visualização de post individual para Hermida Maia Advocacia.
 *             Exibe o conteúdo completo, autor, data, imagem de capa e posts relacionados.
 *             Implementa meta tags dinâmicas para SEO e CTAs de conversão.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  MessageCircle,
  ChevronRight,
  Loader2,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
  Mail
} from 'lucide-react';
import { Header } from '../components/Header';
import { CustomForm } from '../components/CustomForm';
import allConfigs from '../../shared/form-configs.json';

export const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    fetch(`/api/blog/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          navigate('/blog');
        } else {
          setPost(data);
          document.title = `${data.meta_titulo || data.titulo} | Blog Hermida Maia`;
          
          // Atualizar meta tags dinamicamente (simulado para SPA)
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute('content', data.meta_descricao || data.resumo || '');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar post:', err);
        setLoading(false);
      });
  }, [slug, navigate]);

  const handleNewsletterSubmit = async (formData: any) => {
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: `blog_post:${slug}` })
      });
      if (res.ok) alert('Obrigado por assinar nossa newsletter!');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center gap-4">
        <Loader2 className="text-brand-primary animate-spin" size={48} />
        <p className="text-white/40 font-medium">Carregando artigo...</p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-primary selection:text-white">
      <Header />

      <main className="pt-32 pb-24">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Post Header */}
          <header className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 px-4 py-2 rounded-full mb-6">
              <span className="text-brand-primary text-xs font-bold uppercase tracking-widest">Artigo Jurídico</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-8 leading-tight">
              {post.titulo}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/50 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-brand-primary" />
                {new Date(post.data_publicacao || post.created_at).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-brand-primary" />
                {post.autor_nome}
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-16 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src={post.imagem_capa_url || 'https://heyboss.heeyo.ai/gemini-image-c5df3e56df0a49fdb468a4708ef7c8a8.png'} 
              alt={`Imagem de capa do artigo: ${post.titulo} - Dr. Adriano Hermida Maia`} 
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-brand max-w-none mb-16">
            <div 
              className="text-white/80 text-lg leading-relaxed space-y-6 blog-content"
              dangerouslySetInnerHTML={{ __html: post.conteudo }}
            />
          </div>

          {/* Share & CTA */}
          <div className="border-t border-white/10 pt-12 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <span className="text-white/40 text-sm font-bold uppercase tracking-widest">Compartilhar:</span>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-brand-elevated rounded-xl flex items-center justify-center text-white/60 hover:text-brand-primary hover:bg-brand-primary/10 transition-all">
                  <Facebook size={18} />
                </button>
                <button className="w-10 h-10 bg-brand-elevated rounded-xl flex items-center justify-center text-white/60 hover:text-brand-primary hover:bg-brand-primary/10 transition-all">
                  <Twitter size={18} />
                </button>
                <button className="w-10 h-10 bg-brand-elevated rounded-xl flex items-center justify-center text-white/60 hover:text-brand-primary hover:bg-brand-primary/10 transition-all">
                  <Linkedin size={18} />
                </button>
              </div>
            </div>

            <a 
              href="https://wa.me/5551996032004"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-brand-primary/20"
            >
              <MessageCircle size={20} />
              Falar com Especialista
            </a>
          </div>
        </article>

        {/* Related Posts */}
        {post.related_posts && post.related_posts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-24 border-t border-white/5">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Artigos Relacionados</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {post.related_posts.map((rel: any) => (
                <Link 
                  key={rel.id} 
                  to={`/blog/${rel.slug}`}
                  className="bg-brand-elevated rounded-3xl overflow-hidden border border-white/5 group hover:border-brand-primary/30 transition-all"
                >
                  <div className="aspect-video overflow-hidden">
                    <img src={rel.imagem_capa_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={rel.titulo} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors line-clamp-2">{rel.titulo}</h3>
                    <div className="mt-4 text-brand-primary font-bold text-sm flex items-center gap-2">
                      Ler mais <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <section className="max-w-4xl mx-auto px-4 mt-24">
          <div className="bg-brand-primary rounded-[2.5rem] p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl shadow-brand-primary/20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,#ffffff15_0%,transparent_50%)]" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-4">Fique por dentro dos seus direitos</h2>
              <p className="text-white/80 mb-8 max-w-md mx-auto">Assine nossa newsletter e receba atualizações semanais sobre a Lei do Superendividamento e defesa do consumidor.</p>
              <div className="max-w-md mx-auto">
                <CustomForm 
                  id="newsletter_form"
                  schema={allConfigs.newsletter_form.jsonSchema}
                  onSubmit={handleNewsletterSubmit}
                  labels={{ submit: "Assinar Agora" }}
                  className="text-left"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-dark py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/20 text-xs">
            © 2024 Hermida Maia Advocacia. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      <style>{`
        .blog-content h2 {
          font-size: 1.875rem;
          font-weight: 800;
          color: white;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
        }
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .blog-content p {
          margin-bottom: 1.5rem;
        }
        .blog-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        .blog-content strong {
          color: #0d9c6e;
        }
      `}</style>
    </div>
  );
};

