/**
 * @description Página de listagem do Blog para Hermida Maia Advocacia.
 *             Exibe uma grade de artigos jurídicos com filtros por categoria e busca.
 *             Integrada ao sistema de SEO e captação de leads.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  MessageCircle, 
  Search,
  ChevronRight,
  Calendar,
  Tag,
  Loader2,
  Filter
} from 'lucide-react';
import { Header } from '../components/Header';
import { SiteChatWidget } from '../components/SiteChatWidget';
import { getBlogPosts, getBlogCategories } from '../controllers/ApiPublic';
import FallbackPage from './FallbackPage';

  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [fallbackError, setFallbackError] = useState<string | null>(null);
  // Teste de conexão manual
  const handleTestConnection = async () => {
    setTestStatus('Testando...');
    try {
      await getBlogPosts(activeCategory ?? undefined);
      await getBlogCategories();
      setTestStatus('Conexão bem-sucedida!');
    } catch (e: any) {
      setTestStatus('Erro ao testar conexão: ' + (e.message || 'Erro desconhecido'));
    }
    setTimeout(() => setTestStatus(null), 3000);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Blog | Hermida Maia Advocacia";
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsData, catsData] = await Promise.all([
          getBlogPosts(activeCategory ?? undefined),
          getBlogCategories()
        ]);
        if (Array.isArray(postsData)) setPosts(postsData);
        if (Array.isArray(catsData)) setCategories(catsData);
        setFallbackError(null);
      } catch (err: any) {
        setPosts([]);
        setCategories([]);
        let blogError = err?.message || 'Erro ao conectar ao blog.';
        if (typeof window !== 'undefined' && window.__BLOG_ERROR__) {
          blogError = window.__BLOG_ERROR__;
        }
        setFallbackError(blogError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeCategory]);
  const filteredPosts = posts.filter(post => 
    post.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.resumo && post.resumo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (fallbackError) {
    return <FallbackPage message={fallbackError} />;
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-primary selection:text-white">
      <Header />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
              <span className="text-brand-primary text-xs font-bold uppercase tracking-widest">Notícias e Artigos Jurídicos</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">Blog de Defesa do Consumidor: Guia para Eliminar Dívidas</h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Informação jurídica de qualidade sobre a Lei 14.181/2021 e superendividamento para ajudar você a renegociar dívidas e recuperar sua paz financeira.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="max-w-4xl mx-auto mb-16 space-y-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
              <input 
                type="text" 
                placeholder="Buscar artigos por título ou assunto..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-brand-elevated border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-brand-primary outline-none transition-all shadow-xl"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${!activeCategory ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${activeCategory === cat.id ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}
                >
                  {cat.nome}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center py-2">
            <button
              onClick={handleTestConnection}
              className="bg-brand-primary text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-brand-primary/90 transition-all"
            >
              Testar conexão Blog
            </button>
            {testStatus && (
              <span className="ml-4 text-white/80 text-sm">{testStatus}</span>
            )}
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="text-brand-primary animate-spin" size={48} />
              <p className="text-white/40 font-medium">Carregando artigos...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, idx) => (
                <article 
                  key={post.id || idx} 
                  className="bg-brand-elevated rounded-[2rem] overflow-hidden border border-white/5 group hover:border-brand-primary/30 transition-all flex flex-col h-full shadow-lg hover:shadow-brand-primary/5"
                >
                  <Link to={`/blog/${post.slug}`} className="aspect-[16/10] overflow-hidden block relative">
                    <img 
                      src={post.imagem_capa_url || 'https://heyboss.heeyo.ai/gemini-image-c5df3e56df0a49fdb468a4708ef7c8a8.png'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={`Artigo sobre ${post.titulo} - Advocacia especializada em dívidas`} 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                        {categories.find(c => c.id === post.categoria_id)?.nome || 'Artigo'}
                      </span>
                    </div>
                  </Link>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-white/40 text-xs font-bold uppercase tracking-wider mb-4">
                      <Calendar size={14} className="text-brand-primary" />
                      {new Date(post.data_publicacao || post.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                        {post.titulo}
                      </h3>
                    </Link>
                    <p className="text-white/50 text-sm leading-relaxed mb-8 line-clamp-3 flex-1">
                      {post.resumo || post.meta_descricao}
                    </p>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-brand-primary font-bold text-sm group/btn"
                    >
                      Ler Artigo Completo
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-brand-elevated rounded-3xl border border-dashed border-white/10">
              <p className="text-white/40 text-lg">Nenhum artigo encontrado para sua busca.</p>
              <button 
                onClick={() => { setSearchTerm(''); setActiveCategory(null); }}
                className="mt-4 text-brand-primary font-bold hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-brand-dark py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/20 text-xs">
            © 2024 Hermida Maia Advocacia. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

