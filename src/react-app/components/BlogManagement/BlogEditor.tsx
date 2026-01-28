
/**
 * @description Componente de Editor de Blog.
 *             Oferece formulário completo para criação e edición de artigos.
 *             Inclui geração automática de slug, campos de SEO e integração com OSS para imagens.
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Globe, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { CustomForm } from '../CustomForm';
import { contactFormTheme } from '../CustomForm/theme';
import allConfigs from '../../../shared/form-configs.json';

interface BlogEditorProps {
  post?: any;
  categories: any[];
  onBack: () => void;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({ post, categories, onBack }) => {
  import { apiFetch } from '../../controllers/ApiController';
  const [formData, setFormData] = useState<any>(post || { status: 'rascunho' });
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Atualizar enum de categorias dinamicamente
  const schema = JSON.parse(JSON.stringify(allConfigs['blog_post_form'].jsonSchema));
  if (categories.length > 0) {
    schema.properties.categoria_id.enum = categories.map(c => c.id);
    schema.properties.categoria_id.enumNames = categories.map(c => c.nome);
  }

  const handleSlugify = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleFormChange = (data: any) => {
    // Auto-slug se o título mudar e o slug estiver vazio ou for igual ao slug anterior do título
    if (data.titulo !== formData.titulo && (!data.slug || data.slug === handleSlugify(formData.titulo || ''))) {
      data.slug = handleSlugify(data.titulo);
    }
    setFormData(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const res = await apiFetch('https://api.heybossai.com/v1/run', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`
          },
          body: JSON.stringify({
            model: "cloudflare/oss/upload",
            inputs: { base64_data: base64 }
          })
        });
        const data = await res.json();
        if (data.url) {
          setFormData({ ...formData, imagem_capa_url: data.url });
        }
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      const url = post ? `/api/admin/blog/posts/${post.id}` : '/api/admin/blog/posts';
      const method = post ? 'PUT' : 'POST';
      
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        onBack();
      } else {
        const err = await res.json();
        alert(`Erro ao salvar: ${err.error}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAISuggest = async () => {
    if (!formData.titulo) return alert('Digite um título primeiro!');
    
    try {
      const res = await apiFetch('https://api.heybossai.com/v1/run', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          inputs: { 
            prompt: `Sugira uma meta descrição de SEO (máx 160 caracteres) e 5 tags para um artigo jurídico com o título: "${formData.titulo}". Responda apenas JSON: {"meta_descricao": "...", "tags": "tag1, tag2..."}` 
          }
        })
      });
      const data = await res.json();
      const suggestions = JSON.parse(data.output || '{}');
      setFormData({ ...formData, ...suggestions });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button 
          onClick={onBack}
          className="text-white/40 hover:text-white flex items-center gap-2 font-bold transition-all"
        >
          <ArrowLeft size={20} />
          Voltar para Lista
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handleAISuggest}
            className="bg-white/5 hover:bg-white/10 text-brand-primary px-4 py-2 rounded-lg text-sm font-bold transition-all border border-brand-primary/20 flex items-center gap-2"
          >
            <Sparkles size={18} />
            Sugestões IA
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-brand-elevated p-8 rounded-3xl border border-white/5 shadow-xl">
            <CustomForm 
              id="blog_post_form"
              schema={allConfigs['blog_post_form'].jsonSchema}
              formData={formData}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              theme={contactFormTheme}
              labels={{ submit: post ? 'Salvar Alterações' : 'Publicar Artigo' }}
              renderActions={({ isSubmitting, onSubmit }) => (
                <div className="pt-8 border-t border-white/5 flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={onBack}
                    className="px-6 py-3 text-white/40 font-bold hover:text-white transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => onSubmit()}
                    disabled={isSubmitting || isSaving}
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {post ? 'Salvar Artigo' : 'Publicar Agora'}
                  </button>
                </div>
              )}
            />
          </div>
        </div>

        {/* Sidebar / Preview */}
        <div className="space-y-8">
          {/* Image Upload */}
          <div className="bg-brand-elevated p-6 rounded-3xl border border-white/5 shadow-xl">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <ImageIcon size={18} className="text-brand-primary" />
              Imagem de Capa
            </h4>
            <div className="aspect-video bg-brand-dark rounded-2xl border-2 border-dashed border-white/10 overflow-hidden relative group">
              {formData.imagem_capa_url ? (
                <>
                  <img src={formData.imagem_capa_url} className="w-full h-full object-cover" alt="Capa" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-brand-dark px-4 py-2 rounded-lg font-bold text-sm">
                      Alterar Imagem
                      <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </label>
                  </div>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-all">
                  {uploading ? (
                    <Loader2 className="text-brand-primary animate-spin" size={32} />
                  ) : (
                    <>
                      <ImageIcon className="text-white/20 mb-2" size={32} />
                      <span className="text-white/30 text-xs font-bold uppercase">Upload de Imagem</span>
                    </>
                  )}
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              )}
            </div>
          </div>

          {/* SEO Preview */}
          <div className="bg-brand-elevated p-6 rounded-3xl border border-white/5 shadow-xl">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <Globe size={18} className="text-brand-primary" />
              Prévia no Google
            </h4>
            <div className="space-y-1">
              <p className="text-[#1a0dab] text-lg font-medium hover:underline cursor-pointer truncate">
                {formData.meta_titulo || formData.titulo || 'Título do Artigo'}
              </p>
              <p className="text-[#006621] text-sm truncate">
                hermidamaia.adv.br › blog › {formData.slug || '...'}
              </p>
              <p className="text-white/50 text-sm line-clamp-2">
                {formData.meta_descricao || formData.resumo || 'A descrição do seu artigo aparecerá aqui nos resultados de busca...'}
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-brand-primary/10 p-6 rounded-3xl border border-brand-primary/20">
            <h4 className="text-brand-primary font-bold mb-2 flex items-center gap-2">
              <Sparkles size={18} />
              Dica de SEO
            </h4>
            <p className="text-white/70 text-xs leading-relaxed">
              Use palavras-chave como "superendividamento", "lei 14.181" e "renegociação de dívidas" no título e nos primeiros parágrafos para melhorar seu ranking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
