/**
 * Dashboard Administrativo – Hermida Maia Advocacia
 * Template original restaurado + integração real de módulos existentes
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@hey-boss/users-service/react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { apiFetch } from '../controllers/ApiController';
import FallbackPage from './FallbackPage';

import {
  Users,
  Scale,
  CreditCard,
  MessageSquare,
  FileText,
  Settings,
  LayoutDashboard,
  Search,
  Loader2,
  Bot,
  Calendar,
  TrendingUp,
  Zap,
  ChevronRight,
  ArrowLeft,
  Layers,
  MoreVertical,
  Download,
  Clock,
  Folder,
} from 'lucide-react';

/* ===== MÓDULOS EXISTENTES ===== */
// Removed broken imports for non-existent modules. All components are defined in this file.

import { PublicacoesModule } from '../components/Publicacoes/PublicacoesModule';
import { BlogManagementModule } from '../components/BlogManagement/BlogManagementModule';
import { AIMonitoringModule } from '../components/AIMonitoring/AIMonitoringModule';
import { ChatbotConfigModule } from '../components/ChatbotConfigModule';

/* ===== UTILS ===== */
const clsx = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(' ');

/* ===== TYPES ===== */
type DashboardTab =
  | 'overview'
  | 'crm'
  | 'processos'
  | 'documentos'
  | 'planos_pagamento'
  | 'faturas'
  | 'tickets'
  | 'publicacoes'
  | 'gestaoblog'
  | 'agenda'
  | 'ia'
  | 'chatbot'
  | 'config';

/* =========================================================
 * DASHBOARD
 * ========================================================= */
export const Dashboard = () => {
    // ChatWidget logic: show admin, client, or visitor mode
    let chatMode: 'admin' | 'client' | 'visitor' = 'visitor';
    if (!isPending && user) {
      chatMode = (user as any).isAdmin ? 'admin' : 'client';
    }
  const { user, isPending } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [selectedProcesso, setSelectedProcesso] = useState<any | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [fallbackError, setFallbackError] = useState<string | null>(null);

  /* ===== ADMIN GUARD ===== */
  useEffect(() => {
    if (!isPending && user && !(user as any).isAdmin) {
      navigate('/account', { replace: true });
    }
  }, [user, isPending, navigate]);

  /* ===== FETCH SIMPLES (LEGADOS) ===== */
  /* =========================================================
 * FETCH POR ABA + RESET DE ESTADOS DEPENDENTES
 * ========================================================= */
useEffect(() => {
  let aborted = false;

  // ===============================
  // RESET DE ESTADOS INLINE
  // ===============================
  if (activeTab !== 'processos') {
    setSelectedProcesso(null);
  }

  if (activeTab !== 'tickets') {
    setSelectedTicket(null);
  }

  // reset de busca ao trocar de aba
  setSearchTerm('');

  // ===============================
  // ABAS SEM FETCH
  // ===============================
  const tabsWithoutFetch: DashboardTab[] = [
    'overview',
    'publicacoes',
    'gestaoblog',
    'ia',
    'chatbot',
    'config',
  ];

  if (tabsWithoutFetch.includes(activeTab)) {
    setData([]);
    return (
      <div className="min-h-screen bg-brand-dark selection:bg-brand-primary selection:text-white">
        <Header />
        {/* ...existing dashboard code... */}
        <ChatWidget mode={chatMode} />
      </div>
    );
  const endpoints: Partial<Record<DashboardTab, string>> = {
    crm: '/api/admin/leads',
    processos: '/api/admin/processos',
    documentos: '/api/admin/documents',
    planos_pagamento: '/api/admin/planos-pagamento',
    faturas: '/api/admin/faturas',
    tickets: '/api/tickets',
    agenda: '/api/admin/appointments',
  };

  const endpoint = endpoints[activeTab];
  if (!endpoint) return;

  // ===============================
  // FETCH CONTROLADO
  // ===============================
  const fetchData = async () => {
    setLoading(true);
    try {
      const json = await apiFetch(endpoint);
      const normalized =
        activeTab === 'tickets'
          ? Array.isArray(json)
            ? json
            : Array.isArray(json?.data)
            ? json.data
            : []
          : Array.isArray(json)
          ? json
          : [];
      if (!aborted) {
        setData(normalized);
        setFallbackError(null);
      }
    } catch (err: any) {
      if (!aborted) {
        setData([]);
        setFallbackError(err?.message || 'Erro ao conectar ao painel administrativo.');
      }
    } finally {
      if (!aborted) setLoading(false);
    }
  };

  fetchData();

  return () => {
    aborted = true;
  };
}, [activeTab]);


  // ===============================
  // FILTRO GLOBAL
  // ===============================

const filteredData = useMemo(() => {
  if (!searchTerm) return data;

  return data.filter(item =>
    Object.values(item).some(v =>
      String(v ?? '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );
}, [data, searchTerm]);

  /* ===== RENDER ===== */
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />

      <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="flex gap-8">

          {/* SIDEBAR */}
          <aside className="w-64 shrink-0 hidden lg:block">
            <nav className="space-y-1">
              {[
                ['overview', 'Visão Geral', LayoutDashboard],
                ['crm', 'CRM / Leads', Users],
                ['processos', 'Processos', Scale],
                ['documentos', 'Documentos', Folder],
                ['planos_pagamento', 'Planos de Pagamento', CreditCard],
                ['faturas', 'Financeiro', CreditCard],
                ['tickets', 'Helpdesk', MessageSquare],
                ['publicacoes', 'Publicações', FileText],
                ['gestaoblog', 'Gestão de Blog', FileText],
                ['agenda', 'Agenda', Calendar],
                ['ia', 'IA Monitorada', Bot],
                ['chatbot', 'Chatbot IA', Bot],
                ['config', 'Configurações', Settings],
              ].map(([id, label, Icon]: any) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold',
                    activeTab === id
                      ? 'bg-brand-primary text-white'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* CONTEÚDO */}
          <section className="flex-1 space-y-6">

            {activeTab !== 'overview' &&
              activeTab !== 'config' &&
              activeTab !== 'chatbot' && (
                <div className="bg-brand-elevated p-4 rounded-xl">
                  <div className="relative w-96 max-w-full">
                    <Search className="absolute left-3 top-3 text-white/30" size={16} />
                    <input
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Buscar..."
                      className="w-full pl-10 pr-4 py-2 bg-brand-dark rounded-xl outline-none"
                    />
                  </div>
                </div>
              )}

            {loading && (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-brand-primary" size={40} />
              </div>
            )}

            {!loading && (
              <>
                {activeTab === 'overview' && <OverviewModule />}

                {activeTab === 'crm' && <CRMModule data={filteredData} />}

                {activeTab === 'processos' && !selectedProcesso && (
                  <ProcessosModule
                    data={filteredData}
                    onSelect={setSelectedProcesso}
                  />
                )}

                {activeTab === 'processos' && selectedProcesso && (
                  <ProcessoDetailInline
                    processo={selectedProcesso}
                    onBack={() => setSelectedProcesso(null)}
                  />
                )}

                {activeTab === 'documentos' && <DocumentsModule data={filteredData} />}

                {activeTab === 'planos_pagamento' && (
                  <PlanoPagamentoModule data={filteredData} />
                )}

                {activeTab === 'faturas' && <FaturasModule data={filteredData} />}

                {activeTab === 'tickets' && !selectedTicket && (
                    <TicketsModule
                      data={filteredData}
                      onSelect={setSelectedTicket}
                    />
                  )}

                  {activeTab === 'tickets' && selectedTicket && (
                    <TicketDetailInline
                      ticket={selectedTicket}
                      onBack={() => setSelectedTicket(null)}
                    />
                  )}

                {activeTab === 'publicacoes' && <PublicacoesModule />}

                {activeTab === 'gestaoblog' && <BlogManagementModule />}

                {activeTab === 'agenda' && (
                  <AdminAgendaModule
                    data={filteredData}
                    loading={false}
                    onRefresh={() => setActiveTab('agenda')}
                  />
                )}

                {activeTab === 'ia' && <AIMonitoringModule />}

                {activeTab === 'chatbot' && <ChatbotConfigModule />}

                {activeTab === 'config' && <ConfigModule />}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

/* =========================================================
 * 📊 OVERVIEW MODULE
 * ========================================================= */


interface OverviewStat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

export const OverviewModule = () => {
  const stats: OverviewStat[] = [
    {
      label: 'Leads Hoje',
      value: '12',
      icon: Users,
      color: 'text-blue-400',
    },
    {
      label: 'Processos Ativos',
      value: '145',
      icon: Scale,
      color: 'text-brand-primary',
    },
    {
      label: 'Faturamento do Mês',
      value: 'R$ 45.000',
      icon: TrendingUp,
      color: 'text-green-400',
    },
    {
      label: 'Tickets Abertos',
      value: '8',
      icon: MessageSquare,
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in">

      {/* ===============================
       * KPIs
       * =============================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-brand-elevated p-6 rounded-3xl border border-white/5 shadow-xl hover:border-brand-primary/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={clsx('p-3 rounded-2xl bg-white/5', stat.color)}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                Tempo Real
              </span>
            </div>

            <p className="text-white/40 text-xs font-bold uppercase mb-1">
              {stat.label}
            </p>
            <p className="text-3xl font-extrabold tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* ===============================
       * ATIVIDADE RECENTE
       * =============================== */}
      <div className="bg-brand-elevated p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />

        <div className="relative z-10">
          <h3 className="text-2xl font-extrabold mb-6">
            Atividade Recente
          </h3>

          <div className="space-y-4">
            {[
              {
                title: 'Novo lead capturado',
                subtitle: 'Calculadora de Superendividamento',
                meta: 'Há 15 minutos • Maria Oliveira',
              },
              {
                title: 'Documento anexado ao processo',
                subtitle: 'Processo nº 0001234-56',
                meta: 'Há 40 minutos • Sistema',
              },
              {
                title: 'Pagamento confirmado',
                subtitle: 'Plano de Pagamento – Parcela 1/6',
                meta: 'Hoje • Stripe',
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                  <Zap size={18} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold">{activity.title}</p>
                  <p className="text-xs text-white/50">{activity.subtitle}</p>
                  <p className="text-[10px] text-white/30 mt-1">
                    {activity.meta}
                  </p>
                </div>

                <ChevronRight size={18} className="text-white/20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


/* =========================================================
 * 👥 CRM / LEADS MODULE
 * ========================================================= */
const CRMModule = ({ data }: { data: any[] }) => (
  <div className="bg-brand-elevated rounded-3xl border border-white/5 overflow-hidden">
    <table className="w-full">
      <thead className="bg-white/5 text-[10px] uppercase text-white/40">
        <tr>
          <th className="p-4">Lead</th>
          <th className="p-4">Contato</th>
          <th className="p-4">Origem</th>
          <th className="p-4">Data</th>
          <th className="p-4 text-right">Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.map((lead, i) => (
          <tr key={i} className="border-t border-white/5">
            <td className="p-4 font-bold">{lead.first_name} {lead.last_name}</td>
            <td className="p-4 text-xs">{lead.email}</td>
            <td className="p-4 text-xs">{lead.source}</td>
            <td className="p-4 text-xs">
              {new Date(lead.created_at).toLocaleDateString('pt-BR')}
            </td>
            <td className="p-4 text-right">
              <MoreVertical size={18} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* =========================================================
 * 📁 DOCUMENTS MODULE (ADMIN)
 * ========================================================= */

interface DocumentItem {
  id: number;
  title: string;
  category: string;
  owner_type: 'cliente' | 'escritorio';
  owner_name?: string;
  created_at: string;
  file_url: string;
}

export const DocumentsModule = ({ data = [] }: { data: DocumentItem[] }) => {
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold">Documentos</h2>

        <button className="bg-brand-primary px-4 py-2 rounded-xl text-sm font-bold">
          Enviar Documento
        </button>
      </div>

      <div className="bg-brand-elevated rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/40">
            <tr>
              <th className="p-4">Título</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Origem</th>
              <th className="p-4">Data</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {data.map(doc => (
              <tr key={doc.id} className="hover:bg-white/5">
                <td className="p-4 font-bold">{doc.title}</td>
                <td className="p-4 text-xs">{doc.category}</td>
                <td className="p-4 text-xs uppercase">
                  {doc.owner_type === 'cliente'
                    ? `Cliente (${doc.owner_name})`
                    : 'Escritório'}
                </td>
                <td className="p-4 text-xs">
                  {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4 text-right">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    className="text-brand-primary font-bold"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="p-10 text-center text-white/30">
            Nenhum documento disponível.
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
 * ⚖️ PROCESSOS MODULE
 * ========================================================= */
const ProcessosModule = ({
  data,
  onSelect,
}: {
  data: any[];
  onSelect: (p: any) => void;
}) => (
  <div className="grid gap-4">
    {data.map((p, i) => (
      <div
        key={i}
        onClick={() => onSelect(p)}
        className="bg-brand-elevated p-6 rounded-2xl border border-white/5 cursor-pointer"
      >
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-white/40">{p.numero_cnj}</p>
            <h3 className="font-bold">{p.titulo}</h3>
            <p className="text-xs text-white/50">{p.tribunal}</p>
          </div>
          <ChevronRight size={18} className="text-white/30" />
        </div>
      </div>
    ))}
  </div>
);

/* =========================================================
 * ⚖️ PROCESSO DETAIL INLINE
 * Dashboard-compatible | Desktop | Tablet | Mobile
 * ========================================================= */

type ProcessoDetailProps = {
  processo: any;
  onBack: () => void;
};

type ProcessoTab =
  | 'andamentos'
  | 'publicacoes'
  | 'financeiro'
  | 'documentos'
  | 'tarefas';

export const ProcessoDetailInline = ({
  processo,
  onBack,
}: ProcessoDetailProps) => {
  const [activeTab, setActiveTab] = useState<ProcessoTab>('andamentos');

  return (
    <div className="space-y-6 animate-fade-in">

      {/* =========================================================
       * HEADER
       * ========================================================= */}
      <div className="flex flex-col gap-4">

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-brand-primary hover:opacity-80 w-fit"
        >
          <ArrowLeft size={16} />
          Voltar para Processos
        </button>

        <div className="bg-brand-elevated p-6 sm:p-8 rounded-3xl border border-white/5 shadow-xl">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* INFO PRINCIPAL */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase px-2 py-1 rounded-md">
                  {processo.area || 'Jurídico'}
                </span>

                <span className="text-[10px] text-white/40 font-mono">
                  {processo.numero_cnj}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold">
                {processo.titulo}
              </h1>

              <p className="text-sm text-white/50">
                {processo.tribunal} • {processo.orgao_julgador}
              </p>
            </div>

            {/* STATUS */}
            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] font-bold uppercase px-4 py-1.5 rounded-full ${
                  processo.status === 'Concluído'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-brand-primary/10 text-brand-primary'
                }`}
              >
                {processo.status}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================
       * TABS
       * ========================================================= */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">

        {[
          ['andamentos', 'Andamentos', Clock],
          ['publicacoes', 'Publicações', FileText],
          ['financeiro', 'Financeiro', CreditCard],
          ['documentos', 'Documentos', Layers],
          ['tarefas', 'Tarefas', Calendar],
        ].map(([id, label, Icon]: any) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === id
                ? 'bg-brand-primary text-white'
                : 'bg-white/5 text-white/40 hover:text-white'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* =========================================================
       * CONTEÚDO DAS ABAS
       * ========================================================= */}
      <div className="bg-brand-elevated p-6 sm:p-8 rounded-3xl border border-white/5 shadow-xl">

        {/* ===============================
         * ANDAMENTOS
         * =============================== */}
        {activeTab === 'andamentos' && (
          <div className="space-y-4">
            {processo.andamentos?.length > 0 ? (
              processo.andamentos.map((item: any, i: number) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5"
                >
                  <p className="text-sm font-bold mb-1">
                    {item.titulo || 'Movimentação'}
                  </p>
                  <p className="text-xs text-white/50 mb-1">
                    {item.data
                      ? new Date(item.data).toLocaleDateString('pt-BR')
                      : '—'}
                  </p>
                  <p className="text-sm text-white/60">
                    {item.descricao}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState label="Nenhuma movimentação registrada." />
            )}
          </div>
        )}

        {/* ===============================
         * PUBLICAÇÕES
         * =============================== */}
        {activeTab === 'publicacoes' && (
          <EmptyState label="Nenhuma publicação vinculada a este processo." />
        )}

        {/* ===============================
         * FINANCEIRO
         * =============================== */}
        {activeTab === 'financeiro' && (
          <EmptyState label="Nenhuma informação financeira vinculada." />
        )}

        {/* ===============================
         * DOCUMENTOS
         * =============================== */}
        {activeTab === 'documentos' && (
          <EmptyState label="Nenhum documento anexado ao processo." />
        )}

        {/* ===============================
         * TAREFAS
         * =============================== */}
        {activeTab === 'tarefas' && (
          <EmptyState label="Nenhuma tarefa vinculada ao processo." />
        )}
      </div>
    </div>
  );
};

/* =========================================================
 * EMPTY STATE REUTILIZÁVEL
 * ========================================================= */

const EmptyState = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center text-white/40">
    <Clock size={32} className="mb-4 opacity-30" />
    <p className="text-sm">{label}</p>
  </div>
);


/* =========================================================
 * 💳 PLANO DE PAGAMENTO – ADMIN
 * ========================================================= */

export const PlanoPagamentoModule = ({ data = [] }: { data: any[] }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-extrabold">Planos de Pagamento</h2>

    <div className="grid gap-4">
      {data.map(plan => (
        <div
          key={plan.id}
          className="bg-brand-elevated p-6 rounded-2xl border border-white/5"
        >
          <div className="flex justify-between">
            <div>
              <p className="font-bold">{plan.nome}</p>
              <p className="text-xs text-white/40">
                {plan.parcelas}x • R$ {plan.valor}
              </p>
            </div>

            <span className="text-xs uppercase">
              {plan.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* =========================================================
 * ✍️ GESTÃO DE BLOG
 * ========================================================= */

export const GestaoBlogModule = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-extrabold">Gestão de Blog</h2>
    <BlogManagementModule />
  </div>
);

/* =========================================================
 * 💰 FATURAS / FINANCEIRO MODULE
 * ========================================================= */

type FaturaStatus = 'Pago' | 'Pendente' | 'Atrasado';

interface Fatura {
  id: number;
  fatura: string;
  cliente_email: string;
  valor_original: number;
  data_vencimento: string;
  status: FaturaStatus;
}

/* ---------------------------
 * STAT CARD
 * --------------------------- */
const StatCard = ({
  label,
  value,
  color = 'white',
}: {
  label: string;
  value: number;
  color?: 'white' | 'green' | 'yellow';
}) => {
  const colorMap = {
    white: 'text-white',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
  };

  return (
    <div className="bg-brand-elevated p-6 rounded-2xl border border-white/5 shadow-lg">
      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className={clsx('text-2xl font-extrabold', colorMap[color])}>
        R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
};

/* ---------------------------
 * FATURAS MODULE
 * --------------------------- */
const FaturasModule = ({ data = [] }: { data: Fatura[] }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | FaturaStatus>('all');
  const [localSearch, setLocalSearch] = useState('');

  /* ---------------------------
   * CREATE STRIPE LINK
   * --------------------------- */
  const handleCreateLink = async (id: number) => {
    try {
      const result = await apiFetch(`/api/admin/faturas/${id}/create-payment-link`, { method: 'POST' });
      if (result?.checkoutUrl) {
        window.open(result.checkoutUrl, '_blank');
      } else {
        alert(result?.error || 'Erro ao gerar link de pagamento.');
      }
    } catch (e: any) {
      alert(e?.message || 'Erro de rede ao gerar link.');
    }
  };

  /* ---------------------------
   * FILTERED DATA
   * --------------------------- */
  const filteredFaturas = useMemo(() => {
    return data.filter(f => {
      if (!f) return false;

      const statusMatch =
        statusFilter === 'all' || f.status === statusFilter;

      const searchMatch =
        !localSearch ||
        f.fatura?.toLowerCase().includes(localSearch.toLowerCase()) ||
        f.cliente_email?.toLowerCase().includes(localSearch.toLowerCase());

      return statusMatch && searchMatch;
    });
  }, [data, statusFilter, localSearch]);

  /* ---------------------------
   * STATS
   * --------------------------- */
  const stats = useMemo(() => {
    const total = data.reduce(
      (acc, f) => acc + Number(f?.valor_original ?? 0),
      0
    );

    const paid = data
      .filter(f => f.status === 'Pago')
      .reduce((acc, f) => acc + Number(f.valor_original ?? 0), 0);

    const pending = data
      .filter(f => f.status === 'Pendente')
      .reduce((acc, f) => acc + Number(f.valor_original ?? 0), 0);

    return { total, paid, pending };
  }, [data]);

  /* ---------------------------
   * RENDER
   * --------------------------- */
  return (
    <div className="space-y-6">

      {/* MINI DASHBOARD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Emitido" value={stats.total} />
        <StatCard label="Total Recebido" value={stats.paid} color="green" />
        <StatCard label="Pendente" value={stats.pending} color="yellow" />
      </div>

      {/* FILTROS */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-brand-elevated p-4 rounded-2xl border border-white/5">
        <div className="flex gap-2">
          {['all', 'Pendente', 'Pago', 'Atrasado'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as any)}
              className={clsx(
                'px-4 py-2 rounded-xl text-xs font-bold transition-all',
                statusFilter === s
                  ? 'bg-brand-primary text-white'
                  : 'bg-white/5 text-white/40 hover:text-white'
              )}
            >
              {s === 'all' ? 'Todos' : s}
            </button>
          ))}
        </div>

        <input
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
          placeholder="Buscar fatura ou e-mail..."
          className="bg-brand-dark border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-brand-primary"
        />
      </div>

      {/* TABELA */}
      <div className="bg-brand-elevated rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
            <tr>
              <th className="p-4">Fatura</th>
              <th className="p-4">Vencimento</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {filteredFaturas.map(f => (
              <tr key={f.id} className="hover:bg-white/5">
                <td className="p-4 font-bold">{f.fatura}</td>
                <td className="p-4">
                  {f.data_vencimento
                    ? new Date(f.data_vencimento).toLocaleDateString('pt-BR')
                    : '—'}
                </td>
                <td className="p-4 font-extrabold">
                  R$ {Number(f.valor_original).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4">
                  <span className={clsx(
                    'text-[10px] font-bold uppercase px-2 py-1 rounded-md',
                    f.status === 'Pago'
                      ? 'bg-green-500/10 text-green-400'
                      : f.status === 'Atrasado'
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-yellow-500/10 text-yellow-400'
                  )}>
                    {f.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {f.status !== 'Pago' && (
                    <button
                      onClick={() => handleCreateLink(f.id)}
                      title="Gerar link de pagamento"
                      className="text-brand-primary hover:text-white transition"
                    >
                      <CreditCard size={16} />
                    </button>
                  )}
                  <button title="Baixar PDF" className="text-white/40 hover:text-white">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredFaturas.length === 0 && (
          <div className="p-10 text-center text-white/30 italic">
            Nenhuma fatura encontrada com os filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
 * 🎟️ TICKETS / HELPDESK – LISTA
 * ========================================================= */
export const TicketsModule = ({
  data,
  onSelect,
}: {
  data: any[];
  onSelect: (ticket: any) => void;
}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-brand-elevated p-10 rounded-3xl border border-white/5 text-center text-white/40">
        Nenhum ticket encontrado.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {data.map(ticket => (
        <div
          key={ticket.id}
          onClick={() => onSelect(ticket)}
          className="bg-brand-elevated p-6 rounded-2xl border border-white/5 cursor-pointer hover:border-brand-primary/30 transition-all"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-white/40">
                Ticket #{ticket.id} • {ticket.client_email}
              </p>

              <h3 className="font-bold">{ticket.subject}</h3>

              <p className="text-xs text-white/50">
                Status: {ticket.status} • Prioridade: {ticket.priority}
              </p>
            </div>

            <span className="text-[10px] uppercase px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary">
              {ticket.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};


/* =========================================================
 * 🎟️ TICKET DETAIL INLINE
 * ========================================================= */


type TicketDetailInlineProps = {
  ticket: any;
  onBack: () => void;
};

export const TicketDetailInline = ({
  ticket,
  onBack,
}: TicketDetailInlineProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  /* =========================================================
   * LOAD THREAD / MESSAGES
   * ========================================================= */
  useEffect(() => {
    let aborted = false;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const json = await apiFetch(`/api/tickets/${ticket.id}/messages`);
        if (!aborted) {
          setMessages(
            Array.isArray(json)
              ? json
              : Array.isArray(json?.data)
              ? json.data
              : []
          );
        }
      } catch (err) {
        console.error(err);
        if (!aborted) setMessages([]);
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    loadMessages();

    return () => {
      aborted = true;
    };
  }, [ticket.id]);

  /* =========================================================
   * SEND REPLY
   * ========================================================= */
  const handleReply = async () => {
    if (!message.trim()) return;

    try {
      await apiFetch(`/api/tickets/${ticket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      setMessage('');

      // reload messages after reply
      const json = await apiFetch(`/api/tickets/${ticket.id}/messages`);
      setMessages(
        Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : []
      );
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar resposta.');
    }
  };

  /* =========================================================
   * RENDER
   * ========================================================= */
  return (
    <div className="space-y-6 animate-fade-in">

      {/* VOLTAR */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-brand-primary font-bold"
      >
        <ArrowLeft size={16} />
        Voltar para tickets
      </button>

      {/* CARD */}
      <div className="bg-brand-elevated p-6 rounded-3xl border border-white/5">

        <h2 className="text-xl font-extrabold mb-2">
          Ticket #{ticket.id}
        </h2>

        <p className="text-xs text-white/40 mb-6">
          {ticket.subject} • {ticket.client_email}
        </p>

        {/* THREAD */}
        <div className="space-y-4 max-h-[420px] overflow-y-auto">

          {loading && (
            <div className="text-white/40 text-sm">
              Carregando mensagens...
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="text-white/40 text-sm">
              Nenhuma mensagem registrada.
            </div>
          )}

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`p-4 rounded-xl border ${
                msg.is_admin
                  ? 'bg-brand-primary/10 border-brand-primary/30'
                  : 'bg-white/5 border-white/5'
              }`}
            >
              <p className="text-xs text-white/40 mb-1">
                {msg.is_admin ? 'Admin' : msg.sender_email} •{' '}
                {new Date(msg.created_at).toLocaleString('pt-BR')}
              </p>

              <p className="text-sm">{msg.message}</p>
            </div>
          ))}
        </div>

        {/* REPLY */}
        <div className="mt-6 space-y-3">
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Responder ao ticket..."
            className="w-full bg-brand-dark border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-brand-primary"
          />

          <button
            onClick={handleReply}
            className="bg-brand-primary px-4 py-2 rounded-xl font-bold"
          >
            Enviar resposta
          </button>
        </div>
      </div>
    </div>
  );
};


/* =========================================================
 * 🤖 IA MONITORADA MODULE
 * ========================================================= */
const IAModule = ({ data = [] }: { data: any[] }) => (
  <div className="grid gap-4">
    {data.map((session, i) => (
      <div key={i} className="bg-brand-elevated p-6 rounded-2xl border border-white/5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Bot size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">
                {session.visitor_email || 'Visitante Anônimo'}
              </p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">
                Sessão: {session.session_id?.slice(0, 8)}
              </p>
            </div>
          </div>

          <span className={clsx(
            "text-[10px] font-bold uppercase px-3 py-1 rounded-full",
            session.status === 'active'
              ? "bg-green-500/10 text-green-400"
              : "bg-white/5 text-white/40"
          )}>
            {session.status}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-white/40">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <MessageSquare size={14} /> {session.message_count} mensagens
            </span>
            <span className="flex items-center gap-1">
              <Zap size={14} /> {session.interaction_type}
            </span>
          </div>
          <button className="text-brand-primary font-bold hover:underline">
            Intervir na Conversa
          </button>
        </div>
      </div>
    ))}
  </div>
);
/* =========================================================
 * 📅 ADMIN AGENDA MODULE (DASHBOARD-COMPATÍVEL)
 * ========================================================= */

type AppointmentStatus = 'confirmado' | 'aguardando_aceite' | 'recusado';

interface Appointment {
  id: number;
  status: AppointmentStatus;
  form_data: {
    name: string;
    email: string;
    phone: string;
    reason: string;
    appointment_date: string;
    appointment_time: string;
    appointment_type: 'tecnica' | 'avaliacao';
  };
}

export const AdminAgendaModule = ({
  data,
  loading,
  onRefresh,
}: {
  data: Appointment[];
  loading: boolean;
  onRefresh: () => void;
}) => {

  const handleStatusUpdate = async (
    id: number,
    status: AppointmentStatus
  ) => {
    const notes = prompt('Observações (opcional):');
    if (notes === null) return;

    try {
      await apiFetch(`/api/admin/appointments/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      onRefresh();
    } catch {
      alert('Erro ao atualizar o status do agendamento.');
    }
  };

  /* ===============================
   * 🧠 RENDER
   * =============================== */
  return (
    <div className="space-y-6 animate-fade-in">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold">Gestão de Agenda</h2>
        <span className="text-xs uppercase text-brand-primary">
          Controle Interno
        </span>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-brand-primary" size={40} />
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="bg-brand-elevated p-16 rounded-3xl border border-white/5 text-center">
          <Calendar size={40} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/40">
            Nenhum agendamento registrado.
          </p>
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="grid gap-4">
          {data.map(app => (
            <div
              key={app.id}
              className="bg-brand-elevated p-6 rounded-2xl border border-white/5"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">

                {/* DADOS */}
                <div>
                  <p className="text-xs uppercase text-brand-primary mb-1">
                    {app.form_data.appointment_type === 'tecnica'
                      ? 'Consulta Técnica'
                      : 'Avaliação'}
                  </p>

                  <h3 className="text-lg font-bold">
                    {app.form_data.name}
                  </h3>

                  <p className="text-sm text-white/50">
                    {app.form_data.email} • {app.form_data.phone}
                  </p>

                  <p className="text-xs text-white/30 mt-2 italic">
                    “{app.form_data.reason}”
                  </p>
                </div>

                {/* AÇÕES */}
                <div className="flex flex-col items-end gap-3">
                  <span className="text-xs uppercase">
                    {app.status.replace('_', ' ')}
                  </span>

                  {app.status === 'aguardando_aceite' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(app.id, 'confirmado')
                        }
                        className="text-green-400"
                      >
                        Confirmar
                      </button>

                      <button
                        onClick={() =>
                          handleStatusUpdate(app.id, 'recusado')
                        }
                        className="text-red-400"
                      >
                        Recusar
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================================================
 * ⚙️ CONFIG MODULE
 * ========================================================= */

type StripeStatus = {
  isConfigured: boolean;
  mode?: 'test' | 'live';
  connectId?: string;
};

type GoogleCalendarStatus = {
  isConnected: boolean;
  email?: string;
};

type ConfigStatus = {
  stripe?: StripeStatus;
  googleCalendar?: GoogleCalendarStatus;
};

const ConfigModule = () => {
  const [status, setStatus] = React.useState<ConfigStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = React.useState(true);

  const [testResult, setTestResult] = React.useState<{ error?: string; message?: string } | null>(null);
  const [isTesting, setIsTesting] = React.useState(false);

  const [stripeKey, setStripeKey] = React.useState('');
  const [connectId, setConnectId] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [showGuide, setShowGuide] = React.useState(true);

  const [activeSubTab, setActiveSubTab] = React.useState<'stripe' | 'google'>('stripe');

  /* ===============================
   * 🔄 LOAD CONFIG STATUS
   * =============================== */
  const fetchStatus = React.useCallback(async () => {
    setLoadingStatus(true);
    try {
      const statusData = await apiFetch('/api/admin/config/status');
      setStatus(statusData);
    } catch (err) {
      console.error(err);
      setStatus(null);
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  React.useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  /* ===============================
   * 🔗 GOOGLE CONNECT
   * =============================== */
  const handleConnectGoogle = () => {
    window.location.href = '/api/admin/google-calendar/connect';
  };

  /* ===============================
   * 🧪 TEST STRIPE
   * =============================== */
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const data = await apiFetch('/api/admin/stripe/test');
      setTestResult({ message: data.message || 'Conexão OK' });
    } catch {
      setTestResult({ error: 'Erro ao testar conexão Stripe.' });
    } finally {
      setIsTesting(false);
    }
  };

  /* ===============================
   * 💾 SAVE STRIPE CONFIG
   * =============================== */
  const handleSaveStripeConfig = async () => {
    if (!stripeKey.trim()) {
      setTestResult({ error: 'Insira uma chave Stripe válida.' });
      return;
    }

    if (!/^((sk|rk)_(test|live))/.test(stripeKey)) {
      setTestResult({ error: 'Chave Stripe inválida.' });
      return;
    }

    if (connectId && !connectId.startsWith('acct_')) {
      setTestResult({ error: 'ID Stripe Connect inválido.' });
      return;
    }

    setIsSaving(true);
    try {
      const data = await apiFetch('/api/admin/config/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          configType: 'stripe_config',
          value: { stripeKey, connectId }
        })
      });
      setTestResult({ message: '✅ Configuração salva com sucesso. Reinicie o worker.' });
      setStripeKey('');
      setConnectId('');
      setShowGuide(false);
      fetchStatus();
    } catch (err: any) {
      setTestResult({ error: err.message || 'Erro ao salvar configuração.' });
    } finally {
      setIsSaving(false);
    }
  };

  /* ===============================
   * 🧠 RENDER
   * =============================== */
  if (loadingStatus) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* =========================================================
          🔀 SUBTABS
      ========================================================= */}
      <div className="flex gap-4 border-b border-white/10 pb-4">
        {(['stripe', 'google'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={clsx(
              'px-6 py-2 rounded-xl text-sm font-bold transition-all',
              activeSubTab === tab
                ? 'bg-brand-primary text-white shadow-lg'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            )}
          >
            {tab === 'stripe' ? 'Pagamentos (Stripe)' : 'Agenda (Google)'}
          </button>
        ))}
      </div>

      {/* =========================================================
          💳 STRIPE
      ========================================================= */}
      {activeSubTab === 'stripe' && (
        <div className="bg-brand-elevated p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <h3 className="text-2xl font-extrabold mb-4">Integração Stripe</h3>

          {status?.stripe?.isConfigured ? (
            <>
              <p className="text-green-400 font-bold mb-4">✅ Stripe conectado ({status.stripe.mode})</p>

              <button
                onClick={handleTestConnection}
                disabled={isTesting}
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl font-bold"
              >
                {isTesting ? 'Testando...' : 'Testar Conexão'}
              </button>
            </>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <input
                  type="password"
                  placeholder="Chave Stripe"
                  value={stripeKey}
                  onChange={e => setStripeKey(e.target.value)}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3"
                />
                <input
                  type="text"
                  placeholder="Stripe Connect ID (opcional)"
                  value={connectId}
                  onChange={e => setConnectId(e.target.value)}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3"
                />
              </div>

              <button
                onClick={handleSaveStripeConfig}
                disabled={isSaving}
                className="bg-brand-primary px-6 py-3 rounded-xl font-bold"
              >
                {isSaving ? 'Salvando...' : 'Salvar Configuração'}
              </button>
            </>
          )}

          {testResult && (
            <div className={clsx(
              'mt-4 p-4 rounded-lg',
              testResult.error ? 'bg-red-500/10 text-red-300' : 'bg-green-500/10 text-green-300'
            )}>
              {testResult.error || testResult.message}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          📅 GOOGLE CALENDAR
      ========================================================= */}
      {activeSubTab === 'google' && (
        <div className="bg-brand-elevated p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <h3 className="text-2xl font-extrabold mb-4">Google Calendar</h3>

          {status?.googleCalendar?.isConnected ? (
            <p className="text-green-400 font-bold mb-4">
              Conectado: {status.googleCalendar.email}
            </p>
          ) : (
            <p className="text-yellow-400 font-bold mb-4">Não conectado</p>
          )}

          <button
            onClick={handleConnectGoogle}
            className="bg-brand-primary px-6 py-3 rounded-xl font-bold"
          >
            {status?.googleCalendar?.isConnected ? 'Reconectar' : 'Conectar'}
          </button>
        </div>
      )}
    </div>
  );
};
