

/**
 * @description Página de detalhes do processo jurídico reformulada.
 *             Exibe informações completas e integrações com Publicações, Financeiro e Suporte.
 *             Oferece recursos de ação para administradores e clientes.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Scale, 
  Clock, 
  Calendar, 
  CheckSquare, 
  FileText, 
  ArrowLeft, 
  Bot, 
  Zap, 
  ExternalLink, 
  Loader2, 
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  User,
  MapPin,
  Edit2,
  Download,
  Plus,
  MessageSquare,
  CreditCard,
  X,
  Send,
  CheckCircle2,
  MessageCircle,
  TrendingDown
} from 'lucide-react';
import { Header } from '../components/Header';
import { cn } from '../utils';
import { useAuth } from '@hey-boss/users-service/react';
import { CustomForm } from '../components/CustomForm';
import { contactFormTheme } from '../components/CustomForm/themes';
import allConfigs from '../../shared/form-configs.json' with { type: 'json' };

export const ProcessDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'movements' | 'hearings' | 'tasks' | 'documents' | 'publicacoes' | 'financeiro' | 'suporte'>('movements');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  
  // Modais
  const [showAddMovement, setShowAddMovement] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddTicket, setShowAddTicket] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/processos/${id}/details`);
      if (res.ok) {
        setData(await res.json());
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleGenerateAISummary = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch(`/api/admin/processos/${id}/ai-summary`, { method: 'POST' });
      const result = await res.json();
      if (res.ok) {
        setAiSummary(result.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
      </div>
    );
  }

  if (!data) return null;

  const { processo, movements, hearings, tasks, documents, publicacoes, faturas, tickets } = data;
  const isAdmin = (user as any)?.isAdmin;

  return (
    <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-primary selection:text-white">
      <Header />
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Voltar
          </button>
          <div className="flex gap-3 w-full sm:w-auto">
            {isAdmin ? (
              <>
                <button 
                  onClick={handleGenerateAISummary}
                  disabled={loadingAI}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary px-4 py-2 rounded-xl text-sm font-bold border border-brand-primary/20 transition-all"
                >
                  {loadingAI ? <Loader2 className="animate-spin" size={18} /> : <Bot size={18} />}
                  Resumo IA
                </button>
                <button 
                  onClick={() => setShowAddMovement(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-primary/20"
                >
                  <Plus size={18} />
                  Novo Andamento
                </button>
              </>
            ) : (
              <button 
                onClick={() => setShowAddTicket(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-primary/20"
              >
                <MessageSquare size={18} />
                Abrir Chamado
              </button>
            )}
          </div>
        </div>

        {/* Process Header Card */}
        <div className="bg-brand-elevated p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-brand-primary/20">
                    {processo.area || 'Jurídico'}
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-3 py-1 rounded-full",
                    processo.status === 'Concluído' ? "bg-green-500/10 text-green-400" : "bg-brand-primary/10 text-brand-primary"
                  )}>
                    {processo.status}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">{processo.titulo}</h1>
                <p className="text-white/40 font-mono text-lg">{processo.numero_cnj}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 shrink-0">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <User size={16} className="text-brand-primary" />
                    <span className="text-[10px] font-bold text-white/40 uppercase">Cliente</span>
                  </div>
                  <p className="text-sm font-bold">{processo.cliente_email}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin size={16} className="text-brand-primary" />
                    <span className="text-[10px] font-bold text-white/40 uppercase">Tribunal</span>
                  </div>
                  <p className="text-sm font-bold">{processo.tribunal || 'Não informado'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary Section */}
        {aiSummary && (
          <div className="bg-brand-primary/10 border border-brand-primary/30 p-6 rounded-3xl mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-brand-primary p-2 rounded-lg text-white">
                <Bot size={20} />
              </div>
              <h3 className="font-bold text-lg">Análise Inteligente do Caso</h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-8 bg-white/5 p-1.5 rounded-2xl border border-white/5">
          {[
            { id: 'movements', label: 'Andamentos', icon: Clock, count: movements.length },
            { id: 'publicacoes', label: 'Publicações', icon: FileText, count: publicacoes.length },
            { id: 'financeiro', label: 'Financeiro', icon: CreditCard, count: faturas.length },
            { id: 'suporte', label: 'Suporte', icon: MessageSquare, count: tickets.length },
            { id: 'hearings', label: 'Audiências', icon: Calendar, count: hearings.length },
            { id: 'tasks', label: 'Tarefas', icon: CheckSquare, count: tasks.length },
            { id: 'documents', label: 'Documentos', icon: FileText, count: documents.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
              <span className={cn(
                "ml-1 px-2 py-0.5 rounded-md text-[10px]",
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-white/5 text-white/20"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'movements' && (
            <div className="space-y-4">
              {movements.length > 0 ? (
                movements.map((m: any, i: number) => (
                  <div key={i} className="bg-brand-elevated p-6 rounded-2xl border border-white/5 flex gap-6 group hover:border-brand-primary/30 transition-all">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                        <Zap size={20} />
                      </div>
                      {i < movements.length - 1 && <div className="w-0.5 flex-1 bg-white/5 my-2" />}
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-brand-primary uppercase">{new Date(m.data_movimento).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                      <p className="text-white/90 leading-relaxed">{m.descricao}</p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState icon={Clock} message="Nenhuma movimentação registrada ainda." />
              )}
            </div>
          )}

          {activeTab === 'publicacoes' && (
            <div className="grid gap-4">
              {publicacoes.length > 0 ? (
                publicacoes.map((p: any, i: number) => (
                  <div key={i} className="bg-brand-elevated p-6 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-bold text-brand-primary uppercase">{p.diario} • {new Date(p.data_publicacao).toLocaleDateString('pt-BR')}</span>
                        <h4 className="font-bold text-lg mt-1">{p.comarca} • {p.vara}</h4>
                      </div>
                      <span className={cn(
                        "text-[9px] font-bold uppercase px-2 py-0.5 rounded-md",
                        p.prioridade === 'Urgente' ? "bg-red-500/20 text-red-400" : "bg-white/5 text-white/40"
                      )}>{p.prioridade}</span>
                    </div>
                    <p className="text-sm text-white/60 line-clamp-3 italic">{p.conteudo}</p>
                  </div>
                ))
              ) : (
                <EmptyState icon={FileText} message="Nenhuma publicação encontrada para este CNJ." />
              )}
            </div>
          )}

          {activeTab === 'financeiro' && (
            <div className="grid gap-4">
              {faturas.length > 0 ? (
                faturas.map((f: any, i: number) => (
                  <div key={i} className="bg-brand-elevated p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-brand-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        f.status === 'Pago' ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                      )}>
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <p className="font-bold">{f.fatura}</p>
                        <p className="text-xs text-white/40">Vencimento: {new Date(f.data_vencimento).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-extrabold">R$ {Number(f.valor_original).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <span className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded-md",
                        f.status === 'Pago' ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                      )}>{f.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState icon={CreditCard} message="Nenhuma fatura vinculada a este processo." />
              )}
            </div>
          )}

          {activeTab === 'suporte' && (
            <div className="grid gap-4">
              {tickets.length > 0 ? (
                tickets.map((t: any, i: number) => (
                  <Link to={`/account?tab=tickets&id=${t.id}`} key={i} className="bg-brand-elevated p-6 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="bg-brand-primary/10 p-3 rounded-xl text-brand-primary">
                        <MessageSquare size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold">{t.subject}</h4>
                        <p className="text-xs text-white/40">Última atualização: {new Date(t.updated_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-white/20 group-hover:text-brand-primary transition-all" />
                  </Link>
                ))
              ) : (
                <EmptyState icon={MessageSquare} message="Nenhum chamado aberto para este processo." />
              )}
            </div>
          )}

          {activeTab === 'hearings' && (
            <div className="grid gap-4">
              {hearings.length > 0 ? (
                hearings.map((h: any, i: number) => (
                  <div key={i} className="bg-brand-elevated p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                        <Calendar size={28} />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{h.tipo}</p>
                        <p className="text-white/40 text-xs">{new Date(h.data_audiencia).toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <p className="text-xs text-white/60">{h.local || 'Link Virtual'}</p>
                        <span className="text-[10px] font-bold uppercase px-3 py-1 bg-white/5 rounded-full text-white/40">{h.status}</span>
                      </div>
                      <button className="p-2 hover:bg-white/5 rounded-xl text-white/20 hover:text-brand-primary transition-all">
                        <ExternalLink size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState icon={Calendar} message="Nenhuma audiência agendada." />
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="grid gap-4">
              {tasks.length > 0 ? (
                tasks.map((t: any, i: number) => (
                  <div key={i} className="bg-brand-elevated p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-brand-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                        t.status === 'Concluída' ? "bg-brand-primary border-brand-primary" : "border-white/10"
                      )}>
                        {t.status === 'Concluída' && <CheckSquare size={14} className="text-white" />}
                      </div>
                      <div>
                        <p className={cn("font-bold", t.status === 'Concluída' && "text-white/40 line-through")}>{t.titulo}</p>
                        <p className="text-[10px] text-white/40 uppercase font-bold">Prazo: {new Date(t.data_limite).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase px-2 py-1 rounded-md",
                      t.prioridade === 'Crítica' ? "bg-red-500/10 text-red-400" : "bg-white/5 text-white/40"
                    )}>{t.prioridade}</span>
                  </div>
                ))
              ) : (
                <EmptyState icon={CheckSquare} message="Nenhuma tarefa pendente." />
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.length > 0 ? (
                documents.map((d: any, i: number) => (
                  <div key={i} className="bg-brand-elevated p-6 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-all group">
                    <div className="bg-brand-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-brand-primary mb-4 group-hover:bg-brand-primary group-hover:text-white transition-all">
                      <FileText size={24} />
                    </div>
                    <h4 className="font-bold mb-1 truncate">{d.titulo}</h4>
                    <p className="text-[10px] text-white/40 uppercase font-bold mb-4">{d.tipo} • {new Date(d.created_at).toLocaleDateString('pt-BR')}</p>
                    <a 
                      href={d.arquivo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                      <Download size={12} />
                      Visualizar
                    </a>
                  </div>
                ))
              ) : (
                <EmptyState icon={FileText} message="Nenhum documento anexado." />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modais de Ação */}
      {showAddMovement && (
        <ActionModal title="Lançar Novo Andamento" onClose={() => setShowAddMovement(false)}>
          <CustomForm 
            id="movement_form"
            schema={allConfigs.movement_form.jsonSchema}
            onSubmit={async (formData) => {
              const res = await fetch(`/api/admin/processos/${id}/movements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
              });
              if (res.ok) {
                setShowAddMovement(false);
                fetchDetails();
              }
            }}
            theme={contactFormTheme}
          />
        </ActionModal>
      )}

      {showAddTicket && (
        <ActionModal title="Abrir Chamado sobre o Processo" onClose={() => setShowAddTicket(false)}>
          <CustomForm 
            id="process_ticket_form"
            schema={allConfigs.process_ticket_form.jsonSchema}
            onSubmit={async (formData) => {
              const res = await fetch(`/api/processos/${id}/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
              });
              if (res.ok) {
                setShowAddTicket(false);
                fetchDetails();
                alert('Chamado aberto com sucesso!');
              }
            }}
            theme={contactFormTheme}
          />
        </ActionModal>
      )}
    </div>
  );
};

const EmptyState = ({ icon: Icon, message }: { icon: any, message: string }) => (
  <div className="bg-brand-elevated p-16 rounded-[2.5rem] border border-white/5 text-center space-y-6 shadow-2xl">
    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
      <Icon size={40} />
    </div>
    <p className="text-white/40 font-medium">{message}</p>
  </div>
);

const ActionModal = ({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm">
    <div className="bg-brand-elevated w-full max-w-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
      <div className="p-8 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-2xl font-extrabold">{title}</h2>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all"><X size={24} /></button>
      </div>
      <div className="p-8 overflow-y-auto max-h-[70vh]">
        {children}
      </div>
    </div>
  </div>
);

