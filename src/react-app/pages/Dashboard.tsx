/**
 * @description Painel Administrativo completo para Hermida Maia Advocacia.
 * Gerencia Leads, Processos, Faturas, Tickets, Publicações, IA e Configurações.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@hey-boss/users-service/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  Scale,
  CreditCard,
  MessageSquare,
  FileText,
  Settings,
  LayoutDashboard,
  Search,
  Download,
  Plus,
  MoreVertical,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Bot,
  Zap,
  Calendar,
  Chrome,
} from 'lucide-react';

import { Header } from '../components/Header';
import { AIMonitoringModule } from '../components/AIMonitoring/AIMonitoringModule';
import { BalcaoVirtualModule } from '../components/BalcaoVirtual/BalcaoVirtualModule';
import { ChatbotConfigModule } from '../components/ChatbotConfigModule';
import { BlogManagementModule } from '../components/BlogManagement/BlogManagementModule';
import { PublicacoesModule } from '../components/Publicacoes/PublicacoesModule';

/* -------------------------------------------------------------------------- */
/* Utils                                                                      */
/* -------------------------------------------------------------------------- */

const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ');

type DashboardTab =
  | 'overview'
  | 'crm'
  | 'processos'
  | 'faturas'
  | 'tickets'
  | 'publicacoes'
  | 'ia'
  | 'chatbot'
  | 'balcao'
  | 'agenda'
  | 'config';


/* -------------------------------------------------------------------------- */
/* Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

export const Dashboard = () => {
  const { user, isPending } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [integrationsStatus, setIntegrationsStatus] = useState<any>(null);

  /* ------------------------------------------------------------------------ */
  /* Segurança: acesso apenas admin                                           */
  /* ------------------------------------------------------------------------ */
  useEffect(() => {
    if (!isPending && user && (user as any).isAdmin !== true) {
      navigate('/portal', { replace: true });
    }
  }, [user, isPending, navigate]);

  /* ------------------------------------------------------------------------ */
  /* Callback OAuth Google                                                     */
  /* ------------------------------------------------------------------------ */
  useEffect(() => {
    if (searchParams.get('google') === 'success') {
      console.info('Google Calendar conectado com sucesso');
    }
  }, [searchParams]);

  /* ------------------------------------------------------------------------ */
  /* Fetch de dados por aba                                                    */
  /* ------------------------------------------------------------------------ */
  useEffect(() => {
    if (activeTab === 'overview') return;

    const fetchData = async () => {
      setLoading(true);
      try {
        let endpoint = '';

        if (activeTab === 'crm') endpoint = '/api/admin/leads';
        if (activeTab === 'processos') endpoint = '/api/admin/processos';
        if (activeTab === 'faturas') endpoint = '/api/admin/faturas';
        if (activeTab === 'tickets') endpoint = '/api/tickets';
        if (activeTab === 'publicacoes') endpoint = '/api/admin/publicacoes';
        if (activeTab === 'ia') endpoint = '/api/admin/ai-interactions';
        if (activeTab === 'config') endpoint = '/api/admin/integrations/status';

        if (!endpoint) return;

        const res = await fetch(endpoint);
        const result = await res.json();

        if (activeTab === 'config') setIntegrationsStatus(result);
        else setData(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  /* ------------------------------------------------------------------------ */
  /* Filtro global                                                            */
  /* ------------------------------------------------------------------------ */
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item =>
      Object.values(item).some(v =>
        String(v).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />

      <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
                { id: 'crm', label: 'CRM / Leads', icon: Users },
                { id: 'processos', label: 'Processos', icon: Scale },
                { id: 'faturas', label: 'Financeiro', icon: CreditCard },
                { id: 'tickets', label: 'Helpdesk', icon: MessageSquare },
                { id: 'publicacoes', label: 'Publicações', icon: FileText },
                { id: 'ia', label: 'IA Monitorada', icon: Bot },
                { id: 'chatbot', label: 'Chatbot IA', icon: Settings },
                { id: 'balcao', label: 'Balcão Virtual', icon: MessageSquare },
                { id: 'agenda', label: 'Agenda', icon: Calendar },
                { id: 'config', label: 'Configurações', icon: Settings },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as DashboardTab)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition',
                    activeTab === item.id
                      ? 'bg-brand-primary text-white'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Conteúdo */}
          <section className="flex-1 space-y-6">
            {activeTab !== 'overview' && activeTab !== 'config' && (
              <div className="flex gap-4 bg-brand-elevated p-4 rounded-xl">
                <div className="relative w-96">
                  <Search className="absolute left-3 top-3 text-white/30" size={16} />
                  <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-4 py-2 bg-brand-dark rounded-xl"
                  />
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-brand-primary" size={36} />
              </div>
            ) : (
              <>
                {activeTab === 'overview' && <OverviewModule />}
                {activeTab === 'crm' && <CRMModule data={filteredData} />}
                {activeTab === 'processos' && <ProcessosModule data={filteredData} />}
                {activeTab === 'faturas' && <FaturasModule data={filteredData} />}
                {activeTab === 'tickets' && <TicketsModule data={filteredData} />}
                {activeTab === 'publicacoes' && <PublicacoesModule />}
                {activeTab === 'ia' && <AIMonitoringModule />}
                {activeTab === 'chatbot' && <ChatbotConfigModule />}
                {activeTab === 'balcao' && <BalcaoVirtualModule />}
                {activeTab === 'agenda' && <AdminAgendaModule />}
                {activeTab === 'config' && <ConfigModule status={integrationsStatus} />}
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
const OverviewModule = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Leads Hoje', value: '12', icon: Users, color: 'text-blue-400' },
        { label: 'Processos Ativos', value: '145', icon: Scale, color: 'text-brand-primary' },
        { label: 'Faturamento Mês', value: 'R$ 45k', icon: TrendingUp, color: 'text-green-400' },
        { label: 'Tickets Abertos', value: '8', icon: MessageSquare, color: 'text-yellow-400' },
      ].map((stat, i) => (
        <div key={i} className="bg-brand-elevated p-6 rounded-3xl border border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className={clsx("p-3 rounded-2xl bg-white/5", stat.color)}>
              <stat.icon size={24} />
            </div>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              Tempo Real
            </span>
          </div>
          <p className="text-white/40 text-xs font-bold uppercase mb-1">{stat.label}</p>
          <p className="text-3xl font-extrabold">{stat.value}</p>
        </div>
      ))}
    </div>

    <div className="bg-brand-elevated p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="relative z-10">
        <h3 className="text-2xl font-extrabold mb-6">Atividade Recente</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                <Zap size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Novo lead capturado via Calculadora</p>
                <p className="text-xs text-white/40">Há 15 minutos • Maria Oliveira</p>
              </div>
              <ChevronRight size={18} className="text-white/20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* =========================================================
 * 👥 CRM / LEADS MODULE
 * ========================================================= */
const CRMModule = ({ data = [] }: { data: any[] }) => (
  <div className="bg-brand-elevated rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
          <th className="px-6 py-4">Lead</th>
          <th className="px-6 py-4">Contato</th>
          <th className="px-6 py-4">Origem</th>
          <th className="px-6 py-4">Data</th>
          <th className="px-6 py-4 text-right">Ações</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-white/5">
        {data.map((lead, i) => (
          <tr key={i} className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-xs">
                  {(lead.first_name || lead.email || '?')[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold">
                    {lead.first_name} {lead.last_name}
                  </p>
                  <p className="text-[10px] text-white/40">{lead.email}</p>
                </div>
              </div>
            </td>

            <td className="px-6 py-4 text-xs text-white/60">
              {lead.phone || 'N/A'}
            </td>

            <td className="px-6 py-4">
              <span className="text-[10px] font-bold uppercase px-2 py-1 bg-white/5 rounded-md text-white/40">
                {lead.source || 'Desconhecido'}
              </span>
            </td>

            <td className="px-6 py-4 text-xs text-white/40">
              {new Date(lead.created_at).toLocaleDateString('pt-BR')}
            </td>

            <td className="px-6 py-4 text-right">
              <button className="p-2 hover:bg-white/10 rounded-lg text-white/30 hover:text-white">
                <MoreVertical size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* =========================================================
 * ⚖️ PROCESSOS MODULE
 * ========================================================= */
const ProcessosModule = ({ data = [] }: { data: any[] }) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4">
      {data.map((proc, i) => (
        <div
          key={i}
          className="bg-brand-elevated p-6 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-all shadow-xl"
        >
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                  {proc.area || 'Jurídico'}
                </span>
                <p className="text-white/40 text-xs font-mono">
                  {proc.numero_cnj}
                </p>
              </div>

              <h3 className="text-xl font-bold hover:text-brand-primary transition-colors">
                {proc.titulo}
              </h3>

              <p className="text-sm text-white/50">
                {proc.tribunal} • {proc.orgao_julgador}
              </p>
            </div>

            <div className="flex flex-col items-end justify-between gap-4">
              <span
                className={clsx(
                  'text-[10px] font-bold uppercase px-4 py-1.5 rounded-full',
                  proc.status === 'Concluído'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-brand-primary/10 text-brand-primary'
                )}
              >
                {proc.status}
              </span>

              <button
                onClick={() => navigate(`/processos/${proc.id}`)}
                className="text-brand-primary text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Ver Detalhes <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

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
      const res = await fetch(`/api/admin/faturas/${id}/create-payment-link`, {
        method: 'POST',
      });

      const result = await res.json();

      if (res.ok && result?.checkoutUrl) {
        window.open(result.checkoutUrl, '_blank');
      } else {
        alert(result?.error || 'Erro ao gerar link de pagamento.');
      }
    } catch {
      alert('Erro de rede ao gerar link.');
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
 * 🎟️ TICKETS / HELPDESK MODULE
 * ========================================================= */
const TicketsModule = ({ data = [] }: { data: any[] }) => (
  <div className="grid gap-4">
    {data.map((ticket, i) => (
      <div
        key={i}
        className="bg-brand-elevated p-6 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-all shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-brand-primary/10 p-3 rounded-xl text-brand-primary">
              <MessageSquare size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg">{ticket.subject}</h4>
              <p className="text-xs text-white/40">
                {ticket.client_email} • {new Date(ticket.updated_at).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={clsx(
              "text-[10px] font-bold uppercase px-3 py-1 rounded-full",
              ticket.priority === 'Alta'
                ? "bg-red-500/10 text-red-400"
                : "bg-white/5 text-white/40"
            )}>
              {ticket.priority}
            </span>

            <span className={clsx(
              "text-[10px] font-bold uppercase px-3 py-1 rounded-full",
              ticket.status === 'Aberto'
                ? "bg-brand-primary/10 text-brand-primary"
                : "bg-green-500/10 text-green-400"
            )}>
              {ticket.status}
            </span>

            <ChevronRight size={18} className="text-white/20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

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
 * 📅 ADMIN AGENDA MODULE
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

const AdminAgendaModule = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /* ===============================
   * 🔄 FETCH APPOINTMENTS
   * =============================== */
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/appointments');
      if (!res.ok) throw new Error('Erro ao buscar agendamentos');
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error(error);
      alert('Não foi possível carregar os agendamentos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  /* ===============================
   * ✅ UPDATE STATUS
   * =============================== */
  const handleStatusUpdate = useCallback(
    async (id: number, status: AppointmentStatus) => {
      const notes = prompt('Observações (opcional):');

      // usuário cancelou o prompt
      if (notes === null) return;

      try {
        const res = await fetch(`/api/admin/appointments/${id}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, notes })
        });

        if (!res.ok) throw new Error('Erro ao atualizar status');
        fetchAppointments();
      } catch {
        alert('Erro ao atualizar o status do agendamento.');
      }
    },
    [fetchAppointments]
  );

  /* ===============================
   * 🧠 RENDER
   * =============================== */
  return (
    <div className="space-y-6 animate-fade-in">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold">Gestão de Agenda</h2>
        <div className="bg-brand-primary/10 px-4 py-2 rounded-xl border border-brand-primary/20">
          <p className="text-brand-primary text-[10px] font-bold uppercase">
            Controle Interno
          </p>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-brand-primary" size={40} />
        </div>
      )}

      {/* LISTAGEM */}
      {!loading && appointments.length > 0 && (
        <div className="grid gap-4">
          {appointments.map(app => (
            <div
              key={app.id}
              className="bg-brand-elevated p-6 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">

                {/* DADOS */}
                <div className="flex gap-4">
                  <div
                    className={clsx(
                      'w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner',
                      app.status === 'confirmado'
                        ? 'bg-green-500/10 text-green-400'
                        : app.status === 'aguardando_aceite'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-red-500/10 text-red-400'
                    )}
                  >
                    {app.status === 'confirmado' ? (
                      <CheckCircle2 size={28} />
                    ) : (
                      <Clock size={28} />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-brand-primary/10 text-brand-primary text-[9px] font-bold uppercase px-2 py-0.5 rounded-md">
                        {app.form_data.appointment_type === 'tecnica'
                          ? 'Consulta Técnica'
                          : 'Avaliação'}
                      </span>
                      <p className="text-white/40 text-[10px] font-bold uppercase">
                        {new Date(app.form_data.appointment_date).toLocaleDateString('pt-BR')} às{' '}
                        {app.form_data.appointment_time}
                      </p>
                    </div>

                    <h3 className="text-lg font-bold">{app.form_data.name}</h3>
                    <p className="text-sm text-white/50">
                      {app.form_data.email} • {app.form_data.phone}
                    </p>
                    <p className="text-xs text-white/30 mt-2 italic">
                      “{app.form_data.reason}”
                    </p>
                  </div>
                </div>

                {/* AÇÕES */}
                <div className="flex flex-col items-end justify-between gap-4">
                  <span
                    className={clsx(
                      'text-[10px] font-bold uppercase px-4 py-1.5 rounded-full shadow-lg',
                      app.status === 'confirmado'
                        ? 'bg-green-500/10 text-green-400'
                        : app.status === 'aguardando_aceite'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-red-500/10 text-red-400'
                    )}
                  >
                    {app.status.replace('_', ' ')}
                  </span>

                  {app.status === 'aguardando_aceite' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(app.id, 'confirmado')}
                        className="bg-green-500/10 hover:bg-green-500/20 text-green-400 p-2 rounded-lg"
                        title="Confirmar"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(app.id, 'recusado')}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg"
                        title="Recusar"
                      >
                        <AlertCircle size={18} />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && appointments.length === 0 && (
        <div className="bg-brand-elevated p-16 rounded-[2.5rem] border border-white/5 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
            <Calendar size={40} />
          </div>
          <p className="text-white/40 font-medium">
            Nenhum agendamento registrado no sistema.
          </p>
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
      const res = await fetch('/api/admin/config/status');
      if (!res.ok) throw new Error('Erro ao carregar status');
      setStatus(await res.json());
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
      const res = await fetch('/api/admin/stripe/test');
      const data = await res.json();
      setTestResult(res.ok ? { message: data.message || 'Conexão OK' } : { error: data.error });
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
      const res = await fetch('/api/admin/config/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          configType: 'stripe_config',
          value: { stripeKey, connectId }
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

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
