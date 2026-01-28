

/**
 * @description Módulo de Gestão de Blog para o painel administrativo.
 *             Permite listar, filtrar, criar, editar e excluir posts e categorias.
 *             Integra-se com o sistema de auditoria e IA para otimização de conteúdo.
 */

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../controllers/ApiController';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  FileText, 
  Tag, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
  Download,
  Upload
} from 'lucide-react';
import { CustomForm } from '../CustomForm';
import { contactFormTheme } from '../CustomForm/theme';
import allConfigs from '../../../shared/form-configs.json';
import { BlogEditor } from './BlogEditor';

export const BlogManagementModule: React.FC = () => {
  const [view, setView] = useState<'list' | 'editor' | 'categories'>('list');
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/admin/blog/posts');
      if (Array.isArray(data)) setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiFetch('/api/admin/blog/categories');
      if (Array.isArray(data)) setCategories(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return;
    try {
      await apiFetch(`/api/admin/blog/posts/${id}`, { method: 'DELETE' });
      fetchPosts();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (view === 'editor') {
    return (
      <BlogEditor 
        post={selectedPost} 
        categories={categories}
        onBack={() => { setView('list'); setSelectedPost(null); fetchPosts(); }} 
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestão de Blog</h2>
          <p className="text-white/50 text-sm">Crie e gerencie artigos para SEO e captação de leads.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setView('categories')}
            className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all border border-white/10 flex items-center gap-2"
          >
            <Tag size={18} />
            Categorias
          </button>
          <button 
            onClick={() => { setSelectedPost(null); setView('editor'); }}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/20"
          >
            <Plus size={18} />
            Novo Artigo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-brand-elevated p-6 rounded-2xl border border-white/5">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Total de Artigos</p>
          <p className="text-3xl font-bold text-white">{posts.length}</p>
        </div>
        <div className="bg-brand-elevated p-6 rounded-2xl border border-white/5">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Publicados</p>
          <p className="text-3xl font-bold text-brand-primary">{posts.filter(p => p.status === 'publicado').length}</p>
        </div>
        <div className="bg-brand-elevated p-6 rounded-2xl border border-white/5">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Visualizações Totais</p>
          <p className="text-3xl font-bold text-brand-accent">{posts.reduce((acc, p) => acc + (p.view_count || 0), 0)}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-brand-elevated p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por título..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-dark border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white text-sm focus:border-brand-primary outline-none transition-all"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-brand-dark border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-brand-primary"
        >
          <option value="all">Todos os Status</option>
          <option value="publicado">Publicados</option>
          <option value="rascunho">Rascunhos</option>
          <option value="agendado">Agendados</option>
        </select>
      </div>

      {/* List */}
      <div className="bg-brand-elevated rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center gap-4">
            <Loader2 className="text-brand-primary animate-spin" size={40} />
            <p className="text-white/40">Carregando artigos...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Artigo</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Categoria</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Data</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-dark overflow-hidden border border-white/10 shrink-0">
                          {post.imagem_capa_url ? (
                            <img src={post.imagem_capa_url} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <FileText size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm line-clamp-1">{post.titulo}</p>
                          <p className="text-white/30 text-xs">/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/60 text-sm">
                        {categories.find(c => c.id === post.categoria_id)?.nome || 'Sem categoria'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {post.status === 'publicado' ? (
                          <span className="flex items-center gap-1.5 text-brand-primary text-xs font-bold bg-brand-primary/10 px-2 py-1 rounded-full">
                            <CheckCircle2 size={12} /> Publicado
                          </span>
                        ) : post.status === 'agendado' ? (
                          <span className="flex items-center gap-1.5 text-brand-accent text-xs font-bold bg-brand-accent/10 px-2 py-1 rounded-full">
                            <Clock size={12} /> Agendado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-white/40 text-xs font-bold bg-white/5 px-2 py-1 rounded-full">
                            <FileText size={12} /> Rascunho
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white/60 text-xs">
                        {new Date(post.data_publicacao || post.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                          title="Visualizar"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => { setSelectedPost(post); setView('editor'); }}
                          className="p-2 text-white/40 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-white/20" size={32} />
            </div>
            <p className="text-white/40 font-medium">Nenhum artigo encontrado.</p>
            <button 
              onClick={() => { setSelectedPost(null); setView('editor'); }}
              className="mt-4 text-brand-primary font-bold hover:underline"
            >
              Criar meu primeiro artigo
            </button>
          </div>
        )}
      </div>

      {/* Categories Modal (Simplified for this step) */}
      {view === 'categories' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm">
          <div className="bg-brand-elevated w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Gerenciar Categorias</h3>
              <button onClick={() => setView('list')} className="text-white/40 hover:text-white"><Trash2 size={20} /></button>
            </div>
            <div className="p-6 space-y-6">
              <CustomForm 
                id="blog_category_form"
                schema={allConfigs.blog_category_form.jsonSchema}
                onSubmit={async (data) => {
                  try {
                    await apiFetch('/api/admin/blog/categories', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(data)
                    });
                    fetchCategories();
                  } catch (e) {
                    alert('Erro ao adicionar categoria.');
                  }
                }}
                theme={contactFormTheme}
                labels={{ submit: 'Adicionar Categoria' }}
              />
              <div className="space-y-2">
                {categories.map(cat => (
                  <div key={cat.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-white font-medium">{cat.nome}</span>
                    <span className="text-white/30 text-xs">/{cat.slug}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-white/5 text-right">
              <button onClick={() => setView('list')} className="text-white/60 font-bold text-sm hover:text-white">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

