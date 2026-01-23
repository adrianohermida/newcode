
/**
 * @description Módulo de Gestão de Publicações Jurídicas.
 *             Permite visualizar, filtrar e analisar publicações de diários oficiais.
 *             Integra com IA para detecção automática de prazos e tarefas.
 *             Utiliza CustomForm para edição e criação manual.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2, 
  Eye, 
  Sparkles, 
  Calendar, 
  Plus, 
  ChevronRight,
  X,
  Scale,
  ArrowRight,
  Download
} from 'lucide-react';
import { CustomForm } from '../CustomForm';
import { contactFormTheme } from '../CustomForm/themes';
import allConfigs from '../../../shared/form-configs.json';
import { cn } from '../../utils';

export const PublicacoesModule: React.FC = () => {
  const [publicacoes, setPublicacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPub, setSelectedPub] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [analyzing, setAnalysis] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [isCreatingDeadline, setIsCreatingDeadline] = useState(false);

  const fetchPublicacoes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/publicacoes?search=${searchTerm}&status=${statusFilter}`);
      const data = await res.json();
      if (Array.isArray(data)) setPublicacoes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchPublicacoes(), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const handleMarkAsRead = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/publicacoes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_leitura: !currentStatus })
      });
      if (res.ok) fetchPublicacoes();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnalyze = async (pub: any) => {
    setAnalysis(pub.id);
    setAiResult(null);
    try {
      const res = await fetch(`/api/admin/publicacoes/${pub.id}/analyze`, { method: 'POST' });
      const data = await res.json();
      setAiResult(data);
    } catch (e) {
      alert("Erro na análise IA");
    } finally {
      setAnalysis(null);
    }
  };

  const handleCreateDeadline = async (analysis: any) => {
    setIsCreatingDeadline(true);
    try {
      // Calcula a data de vencimento baseada nos dias sugeridos pela IA a partir de hoje
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (analysis.days || 15));
      
      const res = await fetch('/api/admin/deadlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processo_cnj: selectedPub.processo_cnj,
          titulo: analysis.title || "Prazo de Publicação",
          data_vencimento: dueDate.toISOString()
        })
      });

      if (res.ok) {
        alert(`Prazo de ${analysis.days} dias criado com sucesso para o processo ${selectedPub.processo_cnj}`);
        setAiResult(null);
      } else {
        const err = await res.json();
        alert(err.error || "Erro ao criar prazo");
      }
    } catch (e) {
      alert("Erro de rede ao criar prazo");
    } finally {
      setIsCreatingDeadline(false);
    }
  };

  const handleExport = () => {
    window.open('/api/admin/publicacoes/export', '_blank');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Publicações e Intimações</h2>
          <p className="text-white/50 text-sm">Monitore andamentos processuais capturados nos diários oficiais.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={handleExport}
            className="flex-1 sm:flex-none bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold border border-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Exportar
          </button>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex-1 sm:flex-none bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20"
          >
            <Plus size={18} />
            Lançar Manual
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-brand-elevated p-6 rounded-2xl border border-white/5">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Pendentes de Leitura</p>
          <p className="text-3xl font-bold text-brand-accent">{publicacoes.filter(p => !p.status_leitura).length}</p>
        </div>
        <div className="bg-brand-elevated p-6 rounded-2xl border border-white/5">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Total Capturado</p>
          <p className="text-3xl font-bold text-white">{publicacoes.length}</p>
        </div>
        <div className="bg-brand-elevated p-6 rounded-2xl border border-white/5">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Urgentes</p>
          <p className="text-3xl font-bold text-red-400">{publicacoes.filter(p => p.prioridade === 'Urgente').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-brand-elevated p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por CNJ ou conteúdo..." 
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
          <option value="pendente">Pendentes</option>
          <option value="lido">Lidos</option>
        </select>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="p-20 flex flex-col items-center gap-4">
            <Loader2 className="text-brand-primary animate-spin" size={40} />
            <p className="text-white/40">Buscando publicações...</p>
          </div>
        ) : publicacoes.length > 0 ? (
          publicacoes.map((pub) => (
            <div 
              key={pub.id} 
              className={cn(
                "bg-brand-elevated p-6 rounded-2xl border transition-all group relative overflow-hidden",
                pub.status_leitura ? "border-white/5 opacity-60" : "border-brand-primary/20 shadow-lg shadow-brand-primary/5"
              )}
            >
              <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-[10px] font-bold uppercase px-2 py-0.5 rounded-md",
                      pub.prioridade === 'Urgente' ? "bg-red-500/20 text-red-400" : "bg-brand-primary/10 text-brand-primary"
                    )}>
                      {pub.diario || 'Diário Oficial'}
                    </span>
                    <p className="text-white/40 text-xs font-mono">{pub.processo_cnj}</p>
                    {!pub.status_leitura && (
                      <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors line-clamp-1">
                    {pub.comarca} • {pub.vara}
                  </h3>
                  <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
                    {pub.conteudo}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(pub.data_publicacao).toLocaleDateString('pt-BR')}</span>
                    {pub.palavra_chave && <span className="flex items-center gap-1"><FileText size={12} /> {pub.palavra_chave}</span>}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 shrink-0">
                  <button 
                    onClick={() => handleMarkAsRead(pub.id, pub.status_leitura)}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      pub.status_leitura ? "text-brand-primary bg-brand-primary/10" : "text-white/20 hover:text-white hover:bg-white/5"
                    )}
                    title={pub.status_leitura ? "Marcar como não lido" : "Marcar como lido"}
                  >
                    <CheckCircle2 size={24} />
                  </button>
                  <button 
                    onClick={() => setSelectedPub(pub)}
                    className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold border border-white/10 transition-all flex items-center gap-2"
                  >
                    Ver Detalhes <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center bg-brand-elevated rounded-3xl border border-dashed border-white/10">
            <FileText className="mx-auto text-white/10 mb-4" size={48} />
            <p className="text-white/40">Nenhuma publicação encontrada para os filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPub && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm">
          <div className="bg-brand-elevated w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-white">Detalhes da Publicação</h2>
                <p className="text-brand-primary text-xs font-mono">{selectedPub.processo_cnj}</p>
              </div>
              <button onClick={() => { setSelectedPub(null); setAiResult(null); }} className="p-2 hover:bg-white/5 rounded-full transition-all text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Tribunal / Comarca</p>
                  <p className="text-white font-medium">{selectedPub.diario} • {selectedPub.comarca}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Data de Publicação</p>
                  <p className="text-white font-medium">{new Date(selectedPub.data_publicacao).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white/70 uppercase tracking-widest">Conteúdo Integral</h4>
                  <button 
                    onClick={() => handleAnalyze(selectedPub)}
                    disabled={analyzing === selectedPub.id}
                    className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-brand-primary/20"
                  >
                    {analyzing === selectedPub.id ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    Analisar com IA
                  </button>
                </div>

                {aiResult && (
                  <div className="bg-brand-primary/10 border border-brand-primary/30 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-brand-primary text-white p-2 rounded-lg">
                        <Sparkles size={20} />
                      </div>
                      <div className="flex-1 space-y-3">
                        <h5 className="font-bold text-white">Análise Inteligente</h5>
                        {aiResult.has_deadline ? (
                          <>
                            <p className="text-sm text-white/80">Identificamos um prazo de <span className="text-brand-primary font-bold">{aiResult.days} dias</span> para <span className="font-bold">{aiResult.title}</span>.</p>
                            <button 
                              onClick={() => handleCreateDeadline(aiResult)}
                              disabled={isCreatingDeadline}
                              className="bg-brand-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                              {isCreatingDeadline ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                              Vincular Prazo ao Processo
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-white/80">Nenhum prazo processual explícito detectado nesta publicação.</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-brand-dark/50 p-6 rounded-3xl border border-white/5 text-white/80 text-sm leading-relaxed whitespace-pre-wrap font-serif italic">
                  {selectedPub.conteudo}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end gap-4">
              <button 
                onClick={() => handleMarkAsRead(selectedPub.id, selectedPub.status_leitura)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-all"
              >
                {selectedPub.status_leitura ? 'Marcar como Pendente' : 'Marcar como Lido'}
              </button>
              <button 
                onClick={() => window.open(`https://www.google.com/search?q=${selectedPub.processo_cnj}`, '_blank')}
                className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <Scale size={18} />
                Ver no Tribunal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm">
          <div className="bg-brand-elevated w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-white">Lançar Publicação Manual</h2>
              <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-white/5 rounded-full transition-all"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <CustomForm 
                id="publicacao_form"
                schema={allConfigs.publicacao_form.jsonSchema}
                onSubmit={async (data) => {
                  const res = await fetch('/api/admin/publicacoes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                  });
                  if (res.ok) {
                    setIsCreating(false);
                    fetchPublicacoes();
                  }
                }}
                theme={contactFormTheme}
                labels={{ submit: "Salvar Publicação" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
