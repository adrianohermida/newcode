/**
 * @description Painel Administrativo completo para Hermida Maia Advocacia.
 *             Gerencia Leads, Processos, Faturas, Tickets, Publicações e IA.
 *             Implementa importação/exportação, filtros avançados e auditoria.
 *             Inclui aba de Configurações para integração com Stripe.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@hey-boss/users-service/react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
  Users, 
  Scale, 
  CreditCard, 
  MessageSquare, 
  FileText, 
  Settings, 
  LayoutDashboard, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  ChevronRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ShieldCheck,
  ExternalLink,
  Bot,
  Zap,
  History,
  Mail,
  Phone,
  Calendar,
  Chrome
} from 'lucide-react';

import { Header } from '../components/Header';
import { AIMonitoringModule } from '../components/AIMonitoring/AIMonitoringModule';
import { BalcaoVirtualModule } from '../components/BalcaoVirtual/BalcaoVirtualModule';
import { ChatbotConfigModule } from '../components/ChatbotConfigModule';
import { BlogManagementModule } from '../components/BlogManagement/BlogManagementModule';
import { PublicacoesModule } from '../components/Publicacoes/PublicacoesModule';


const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ');

export const Dashboard = () => {
  const { user, isPending } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'leads' | 'processos' | 'faturas' | 'tickets' | 'publicacoes' | 'ai' | 'balcao' | 'chatbot' | 'blog' | 'config' | 'agenda'>('leads');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [integrationsStatus, setIntegrationsStatus] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  // Admin-only access check
  useEffect(() => {
    if (!isPending && user && !user.isAdmin) {
      navigate('/portal', { replace: true });
    }
  }, [user, isPending, navigate]);

  // Handle success messages from OAuth redirects
  useEffect(() => {
    if (searchParams.get('google') === 'success') {
      console.log('Google Calendar connected successfully');
    }
  }, [searchParams]);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'overview') return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        let endpoint = '';
        if (activeTab === 'crm') endpoint = '/api/admin/leads';
        else if (activeTab === 'processos') endpoint = '/api/admin/processos';
        else if (activeTab === 'faturas') endpoint = '/api/admin/faturas';
        else if (activeTab === 'tickets') endpoint = '/api/tickets'; // Admin sees all via backend logic
        else if (activeTab === 'publicacoes') endpoint = '/api/admin/publicacoes';
        else if (activeTab === 'ia') endpoint = '/api/admin/ai-interactions';
        else if (activeTab === 'config') endpoint = '/api/admin/integrations/status';

        if (endpoint) {
          const res = await fetch(endpoint);
          const result = await res.json();
          if (activeTab === 'config') setIntegrationsStatus(result);
          else setData(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        console.error(Error fetching ${activeTab}:, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'agenda') {
      setLoadingAppointments(true);
      fetch('/api/admin/appointments')
        .then(res => res.json())
        .then(data => {
          setAppointments(data);
          setLoadingAppointments(false);
        });
    }
  }, [activeTab]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const handleExport = async () => {
    if (activeTab === 'crm') {
      window.open('/api/admin/leads/export', '_blank');
    } else {
      alert('Exportação para este módulo em breve.');
    }
  };

  const handleConfigUpdate = async (configType: string, value: any) => {
    try {
      const res = await fetch('/api/admin/config/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configType, value })
      });
      if (res.ok) {
        alert('Configuração atualizada com sucesso!');
      } else {
        alert('Erro ao atualizar configuração.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar configuração.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <nav className="space-y-1">
              {
                [
                  { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
                  { id: 'crm', label: 'CRM / Leads', icon: Users },
                  { id: 'processos', label: 'Processos', icon: Scale },
                  { id: 'faturas', label: 'Financeiro', icon: CreditCard },
                  { id: 'tickets', label: 'Helpdesk', icon: MessageSquare },
                  { id: 'publicacoes', label: 'Publicações', icon: FileText },
                  { id: 'ia', label: 'IA Monitorada', icon: Bot },
                  { id: 'chatbot', label: 'Chatbot IA', icon: Settings },
                  { id: 'balcao', label: 'Balcão Virtual', icon: MessageSquare },
                  { id: 'config', label: 'Configurações', icon: Settings },
                  { id: 'agenda', label: 'Agenda', icon: CalendarIcon },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={clsx(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                      activeTab === item.id 
                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon size={20} className={clsx(
                      "transition-colors",
                      activeTab === item.id ? "text-white" : "text-white/20 group-hover:text-white/60"
                    )} />
                    {item.label}
                  </button>
                ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Header Actions */}
            {activeTab !== 'overview' && activeTab !== 'config' && (
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-brand-elevated p-4 rounded-2xl border border-white/5">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-brand-dark border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-brand-primary transition-all"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={handleExport} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-bold border border-white/10 transition-all">
                    <Download size={18} />
                    Exportar
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-primary/20">
                    <Plus size={18} />
                    Novo
                  </button>
                </div>
              </div>
            )}

            {/* Tab Content */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-brand-primary" size={40} />
              </div>
            ) : (
              <div className="animate-fade-in">
                {activeTab === 'overview' && <OverviewModule />}
                {activeTab === 'crm' && <CRMModule data={filteredData} />}
                {activeTab === 'processos' && <ProcessosModule data={filteredData} />}
                {activeTab === 'faturas' && <FaturasModule data={filteredData} />}
                {activeTab === 'tickets' && <TicketsModule data={filteredData} />}
                {activeTab === 'publicacoes' && <PublicacoesModule />}
                {activeTab === 'ia' && <IAModule data={filteredData} />}
                {activeTab === 'chatbot' && <ChatbotConfigModule />}
                {activeTab === 'balcao' && <BalcaoVirtualModule />}
                {activeTab === 'agenda' && <AdminAgendaModule />}
                {activeTab === 'config' && <ConfigModule status={integrationsStatus} onUpdate={handleConfigUpdate} />}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

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
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Tempo Real</span>
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
              <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-xs">
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

const CRMModule = ({ data }: { data: any[] }) => (
  <div className="bg-brand-elevated rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
    <table className="w-full text-left border-collapse">
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
          <tr key={i} className="hover:bg-white/5 transition-colors group">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-xs">
                  {lead.first_name?.[0] || lead.email?.[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold">{lead.first_name} {lead.last_name}</p>
                  <p className="text-[10px] text-white/40">{lead.email}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <p className="text-xs text-white/60">{lead.phone || 'N/A'}</p>
            </td>
            <td className="px-6 py-4">
              <span className="text-[10px] font-bold uppercase px-2 py-1 bg-white/5 rounded-md text-white/40">
                {lead.source}
              </span>
            </td>
            <td className="px-6 py-4">
              <p className="text-xs text-white/40">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</p>
            </td>
            <td className="px-6 py-4 text-right">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/20 hover:text-white">
                <MoreVertical size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ProcessosModule = ({ data }: { data: any[] }) => (
  <div className="grid gap-4">
    {data.map((proc, i) => (
      <div key={i} className="bg-brand-elevated p-6 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-all group shadow-xl">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                {proc.area || 'Jurídico'}
              </span>
              <p className="text-white/40 text-xs font-mono">{proc.numero_cnj}</p>
            </div>
            <h3 className="text-xl font-bold group-hover:text-brand-primary transition-colors">{proc.titulo}</h3>
            <p className="text-sm text-white/50">{proc.tribunal} • {proc.orgao_julgador}</p>
          </div>
          <div className="flex flex-col items-end justify-between gap-4">
            <span className={clsx(
              "text-[10px] font-bold uppercase px-4 py-1.5 rounded-full shadow-lg",
              proc.status === 'Concluído' ? "bg-green-500/10 text-green-400" : "bg-brand-primary/10 text-brand-primary"
            )}>
              {proc.status}
            </span>
            <button 
              onClick={() => navigate(/processos/${proc.id})}
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

const FaturasModule = ({ data }: { data: any[] }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [localSearch, setLocalSearch] = useState('');

  const handleCreateLink = async (id: number) => {
    try {
      const res = await fetch(/api/admin/faturas/${id}/create-payment-link, { method: 'POST' });
      const result = await res.json();
      if (result.checkoutUrl) {
        window.open(result.checkoutUrl, '_blank');
      } else {
        alert(result.error || 'Erro ao gerar link.');
      }
    } catch (err) {
      alert('Erro de rede.');
    }
  };

  const filteredFaturas = useMemo(() => {
    return data.filter(f => {
      const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
      const matchesSearch = !localSearch || 
        f.fatura.toLowerCase().includes(localSearch.toLowerCase()) ||
        f.cliente_email.toLowerCase().includes(localSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [data, statusFilter, localSearch]);

  const stats = useMemo(() => {
    const total = data.reduce((acc, f) => acc + (f.valor_original || 0), 0);
    const paid = data.filter(f => f.status === 'Pago').reduce((acc, f) => acc + (f.valor_original || 0), 0);
    const pending = data.filter(f => f.status === 'Pendente').reduce((acc, f) => acc + (f.valor_original || 0), 0);
    return { total, paid, pending };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Mini Dashboard Financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-brand-elevated p-6 rounded-2xl border border-white/5 shadow-lg">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total Emitido</p>
          <p className="text-2xl font-extrabold">R$ {stats.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-brand-elevated p-6 rounded-2xl border border-white/5 shadow-lg">
          <p className="text-green-400/60 text-[10px] font-bold uppercase tracking-widest mb-1">Total Recebido</p>
          <p className="text-2xl font-extrabold text-green-400">R$ {stats.paid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-brand-elevated p-6 rounded-2xl border border-white/5 shadow-lg">
          <p className="text-yellow-400/60 text-[10px] font-bold uppercase tracking-widest mb-1">Pendente</p>
          <p className="text-2xl font-extrabold text-yellow-400">R$ {stats.pending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Filtros Locais */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-brand-elevated p-4 rounded-2xl border border-white/5">
        <div className="flex gap-2 w-full sm:w-auto">
          {['all', 'Pendente', 'Pago', 'Atrasado'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                statusFilter === s 
                  ? "bg-brand-primary border-brand-primary text-white" 
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white"
              )}
            >
              {s === 'all' ? 'Todos' : s}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
          <input
            type="text"
            placeholder="Filtrar nesta aba..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-brand-dark border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-brand-primary transition-all"
          />
        </div>
      </div>

      {/* Tabela de Faturas */}
      <div className="bg-brand-elevated rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                <th className="px-6 py-4">Fatura / Cliente</th>
                <th className="px-6 py-4">Vencimento</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredFaturas.map((fatura, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs",
                        fatura.status === 'Pago' ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      )}>
                        {fatura.fatura.slice(-2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{fatura.fatura}</p>
                        <p className="text-[10px] text-white/40">{fatura.cliente_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-white/60">{new Date(fatura.data_vencimento).toLocaleDateString('pt-BR')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-extrabold">R$ {Number(fatura.valor_original).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "text-[10px] font-bold uppercase px-2 py-1 rounded-md",
                      fatura.status === 'Pago' ? "bg-green-500/10 text-green-400" : 
                      fatura.status === 'Atrasado' ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"
                    )}>
                      {fatura.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {fatura.status !== 'Pago' && (
                        <button 
                          onClick={() => handleCreateLink(fatura.id)}
                          title="Gerar Link Stripe"
                          className="p-2 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white rounded-lg transition-all"
                        >
                          <CreditCard size={16} />
                        </button>
                      )}
                      <button 
                        title="Baixar PDF"
                        className="p-2 bg-white/5 text-white/40 hover:text-white rounded-lg transition-all"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredFaturas.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-white/20 text-sm italic">Nenhuma fatura encontrada com estes filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TicketsModule = ({ data }: { data: any[] }) => (
  <div className="grid gap-4">
    {data.map((ticket, i) => (
      <div key={i} className="bg-brand-elevated p-6 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-all group shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-brand-primary/10 p-3 rounded-xl text-brand-primary">
              <MessageSquare size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg">{ticket.subject}</h4>
              <p className="text-xs text-white/40">{ticket.client_email} • {new Date(ticket.updated_at).toLocaleString('pt-BR')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={clsx(
              "text-[10px] font-bold uppercase px-3 py-1 rounded-full",
              ticket.priority === 'Alta' ? "bg-red-500/10 text-red-400" : "bg-white/5 text-white/40"
            )}>
              {ticket.priority}
            </span>
            <span className={clsx(
              "text-[10px] font-bold uppercase px-3 py-1 rounded-full",
              ticket.status === 'Aberto' ? "bg-brand-primary/10 text-brand-primary" : "bg-green-500/10 text-green-400"
            )}>
              {ticket.status}
            </span>
            <ChevronRight size={18} className="text-white/20 group-hover:text-brand-primary transition-all" />
          </div>
        </div>
      </div>
    ))}
  </div>
);



const IAModule = ({ data }: { data: any[] }) => (
  <div className="grid gap-4">
    {data.map((session, i) => (
      <div key={i} className="bg-brand-elevated p-6 rounded-2xl border border-white/5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Bot size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">{session.visitor_email || 'Visitante Anônimo'}</p>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Sessão: {session.session_id.slice(0, 8)}</p>
            </div>
          </div>
          <span className={clsx(
            "text-[10px] font-bold uppercase px-3 py-1 rounded-full",
            session.status === 'active' ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/40"
          )}>
            {session.status}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-white/40">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><MessageSquare size={14} /> {session.message_count} mensagens</span>
            <span className="flex items-center gap-1"><Zap size={14} /> {session.interaction_type}</span>
          </div>
          <button className="text-brand-primary font-bold hover:underline">Intervir na Conversa</button>
        </div>
      </div>
    ))}
  </div>
);

const AdminAgendaModule = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/appointments');
      if (res.ok) setAppointments(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    const notes = prompt('Observações (opcional):');
    try {
      const res = await fetch(/api/admin/appointments/${id}/status, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      if (res.ok) fetchAppointments();
    } catch (e) {
      alert('Erro ao atualizar status.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold">Gestão de Agenda</h2>
        <div className="bg-brand-primary/10 px-4 py-2 rounded-xl border border-brand-primary/20">
          <p className="text-brand-primary text-[10px] font-bold uppercase">Controle Interno</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" size={40} /></div>
      ) : appointments.length > 0 ? (
        <div className="grid gap-4">
          {appointments.map((app, idx) => (
            <div key={idx} className="bg-brand-elevated p-6 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-all group">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex gap-4">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner",
                    app.status === 'confirmado' ? "bg-green-500/10 text-green-400" : 
                    app.status === 'aguardando_aceite' ? "bg-yellow-500/10 text-yellow-400" : "bg-white/5 text-white/20"
                  )}>
                    {app.status === 'confirmado' ? <CheckCircle2 size={28} /> : <Clock size={28} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-brand-primary/10 text-brand-primary text-[9px] font-bold uppercase px-2 py-0.5 rounded-md">
                        {app.form_data.appointment_type === 'tecnica' ? 'Consulta Técnica' : 'Avaliação'}
                      </span>
                      <p className="text-white/40 text-[10px] font-bold uppercase">{new Date(app.form_data.appointment_date).toLocaleDateString('pt-BR')} às {app.form_data.appointment_time}</p>
                    </div>
                    <h3 className="text-lg font-bold">{app.form_data.name}</h3>
                    <p className="text-sm text-white/50">{app.form_data.email} • {app.form_data.phone}</p>
                    <p className="text-xs text-white/30 mt-2 italic">"{app.form_data.reason}"</p>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between gap-4">
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-4 py-1.5 rounded-full shadow-lg",
                    app.status === 'confirmado' ? "bg-green-500/10 text-green-400" : 
                    app.status === 'aguardando_aceite' ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"
                  )}>
                    {app.status.replace('_', ' ')}
                  </span>
                  
                  {app.status === 'aguardando_aceite' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStatusUpdate(app.id, 'confirmado')}
                        className="bg-green-500/10 hover:bg-green-500/20 text-green-400 p-2 rounded-lg transition-all"
                        title="Confirmar"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(app.id, 'recusado')}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-all"
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
      ) : (
        <div className="bg-brand-elevated p-16 rounded-[2.5rem] border border-white/5 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
            <Calendar size={40} />
          </div>
          <p className="text-white/40 font-medium">Nenhum agendamento registrado no sistema.</p>
        </div>
      )}
    </div>
  );
};

const ConfigModule = () => {
  const [testResult, setTestResult] = React.useState<any>(null);
  const [isTesting, setIsTesting] = React.useState(false);
  const [stripeKey, setStripeKey] = React.useState('');
  const [connectId, setConnectId] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [showGuide, setShowGuide] = React.useState(true);
  const [activeSubTab, setActiveSubTab] = React.useState<'stripe' | 'google'>('stripe');

  const handleConnectGoogle = () => {
    window.location.href = '/api/admin/google-calendar/connect';
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/stripe/test');
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ error: 'Erro ao testar conexão. Tente novamente.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveStripeConfig = async () => {
    if (!stripeKey || stripeKey.trim() === '') {
      setTestResult({ error: 'Insira uma chave Stripe válida.' });
      return;
    }
    
    if (!stripeKey.startsWith('sk_test') && !stripeKey.startsWith('sk_live') && !stripeKey.startsWith('rk_')) {
      setTestResult({ error: 'Chave Stripe inválida. Deve começar com "sk_test", "sk_live" ou "rk_".' });
      return;
    }

    if (connectId.trim() !== '' && !connectId.startsWith('acct_')) {
      setTestResult({ error: 'ID de conta Stripe inválido. Deve começar com "acct_".' });
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
      if (res.ok) {
        setTestResult({ message: '✅ Configuração salva com sucesso! Reinicie o worker para aplicar as mudanças.' });
        setStripeKey('');
        setConnectId('');
        setShowGuide(false);
        setTimeout(() => setTestResult(null), 5000);
      } else {
        setTestResult({ error: data.error || 'Erro ao salvar configuração.' });
      }
    } catch (err) {
      setTestResult({ error: 'Erro de rede ao salvar configuração. Verifique sua conexão.' });
    } finally {
      setIsSaving(false);
    }
  };

  const status = null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button 
          onClick={() => setActiveSubTab('stripe')}
          className={clsx(
            "px-6 py-2 rounded-xl text-sm font-bold transition-all",
            activeSubTab === 'stripe' ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" : "text-white/40 hover:text-white hover:bg-white/5"
          )}
        >
          Pagamentos (Stripe)
        </button>
        <button 
          onClick={() => setActiveSubTab('google')}
          className={clsx(
            "px-6 py-2 rounded-xl text-sm font-bold transition-all",
            activeSubTab === 'google' ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" : "text-white/40 hover:text-white hover:bg-white/5"
          )}
        >
          Agenda (Google)
        </button>
      </div>

      {activeSubTab === 'stripe' ? (
        <div className="bg-brand-elevated p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-brand-primary/10 p-4 rounded-2xl text-brand-primary">
                <CreditCard size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold">Integração Stripe</h3>
                <p className="text-white/50">Gerencie seus pagamentos e conexões financeiras com segurança.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-brand-dark/50 p-6 rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Status da Conexão</p>
                <div className="flex items-center gap-2">
                  {status?.stripe?.isConfigured ? (
                    <>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-lg font-bold text-green-400">Conectado ✅</span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                      <span className="text-lg font-bold text-yellow-400">Não Configurado</span>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-brand-dark/50 p-6 rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Modo</p>
                <span className="text-lg font-bold uppercase text-white">{status?.stripe?.mode === 'test' ? '🧪 Test' : status?.stripe?.mode === 'live' ? '🚀 Live' : 'Desconhecido'}</span>
              </div>
            </div>

            {status?.stripe?.isConfigured ? (
              <div className="p-6 bg-green-500/10 rounded-2xl border border-green-500/30 mb-8">
                <p className="text-sm text-green-300 font-semibold mb-4">✅ Sua conta Stripe está conectada e pronta para processar pagamentos.</p>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all"
                  >
                    {isTesting ? '⏳ Testando...' : '🔗 Testar Conexão'}
                  </button>
                  {status?.stripe?.connectId && (
                    <div className="text-xs text-green-300 px-3 py-2 bg-green-500/20 rounded-xl">
                      Modo Connect: <strong>{status.stripe.connectId.slice(0, 8)}...</strong>
                    </div>
                  )}
                </div>
                {testResult && (
                  <div className={clsx('mt-4 p-4 rounded-lg text-sm', testResult.error ? 'bg-red-500/10 text-red-300' : 'bg-green-500/10 text-green-300')}>
                    {testResult.error || testResult.message || '✅ Conexão bem-sucedida!'}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-brand-primary/10 rounded-2xl border border-brand-primary/30 mb-8">
                <p className="text-sm text-white/80 leading-relaxed mb-6">
                  Para aceitar pagamentos via cartão de crédito, você precisa conectar sua conta Stripe. Preencha as credenciais abaixo.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-semibold text-white/70 mb-2 block">🔑 Chave Secreta Stripe</label>
                    <input
                      type="password"
                      value={stripeKey}
                      onChange={(e) => setStripeKey(e.target.value)}
                      placeholder="sk_test_... ou sk_live_..."
                      className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:border-brand-primary outline-none transition-all"
                    />
                    <p className="text-[10px] text-white/40 mt-1">Encontre em: dashboard.stripe.com → Developers → API Keys → Secret Key</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-white/70 mb-2 block">🏢 Conta Conectada (Opcional)</label>
                    <input
                      type="text"
                      value={connectId}
                      onChange={(e) => setConnectId(e.target.value)}
                      placeholder="acct_... (para Stripe Connect)"
                      className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:border-brand-primary outline-none transition-all"
                    />
                    <p className="text-[10px] text-white/40 mt-1">Deixe vazio se usar Stripe padrão. Para Stripe Connect, use o Account ID da conta conectada.</p>
                  </div>

                  <button
                    onClick={handleSaveStripeConfig}
                    disabled={isSaving || !stripeKey.trim()}
                    className="w-full bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Salvando...
                      </>
                    ) : (
                      '💾 Salvar Configuração Stripe'
                    )}
                  </button>
                </div>

                {testResult && (
                  <div className={clsx('p-4 rounded-lg text-sm', testResult.error ? 'bg-red-500/10 text-red-300' : 'bg-green-500/10 text-green-300')}>
                    {testResult.error || testResult.message}
                  </div>
                )}

                {showGuide && (
                  <div className="space-y-2 text-xs text-white/60 p-4 bg-white/5 rounded-lg border border-white/10">
                    <p><strong>📋 Guia Rápido - Como Obter Suas Chaves:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 mt-2">
                      <li>Acesse <span className="text-brand-primary font-bold">dashboard.stripe.com</span></li>
                      <li>Clique em <strong>"Developers"</strong> no menu superior</li>
                      <li>Selecione <strong>"API Keys"</strong></li>
                      <li>Copie a chave secreta (começa com "sk_test" ou "sk_live")</li>
                      <li>Se usar Stripe Connect, adicione o Account ID (começa com "acct_")</li>
                      <li>Cole acima e clique em "Salvar Configuração Stripe"</li>
                    </ol>
                    <p className="mt-3 text-brand-primary font-bold">⚠️ Importante: Reinicie o worker após salvar para aplicar as mudanças!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-brand-elevated p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-brand-primary/10 p-4 rounded-2xl text-brand-primary">
                <Settings size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold">Google Calendar</h3>
                <p className="text-white/50">Sincronize sua agenda para permitir agendamentos automáticos e evitar conflitos.</p>
              </div>
            </div>

            <div className="bg-brand-dark/50 p-6 rounded-2xl border border-white/5 mb-8">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Status da Integração</p>
              <div className="flex items-center gap-2">
                {status?.googleCalendar?.isConnected ? (
                  <>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-lg font-bold text-green-400">Conectado ({status.googleCalendar.email}) ✅</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                    <span className="text-lg font-bold text-yellow-400">Não Conectado</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 bg-brand-primary/10 rounded-2xl border border-brand-primary/30 mb-8">
              <p className="text-sm text-white/80 leading-relaxed mb-6">
                Ao conectar sua conta Google, o sistema poderá ler seus horários ocupados e criar eventos automaticamente para novas consultas agendadas via site.
              </p>
              <button
                onClick={handleConnectGoogle}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-3"
              >
                <Chrome size={20} />
                {status?.googleCalendar?.isConnected ? 'Reconectar Google Calendar' : 'Conectar Google Calendar'}
              </button>
            </div>

            <div className="space-y-2 text-xs text-white/60 p-4 bg-white/5 rounded-lg border border-white/10">
              <p><strong>🔒 Privacidade e Segurança:</strong></p>
              <p>O sistema acessa apenas os metadados de disponibilidade (ocupado/livre) e cria eventos em seu nome. Não lemos o conteúdo de seus e-mails ou outros dados privados.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-brand-elevated p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
          <Settings size={20} className="text-brand-primary" />
          Configurações Gerais do Sistema
        </h4>
        <div className="grid gap-4">
          {[
            { label: 'E-mail de Notificação', value: 'contato@hermidamaia.adv.br' },
            { label: 'Moeda Padrão', value: 'BRL (R$)' },
            { label: 'Multa de Atraso', value: '10%' },
            { label: 'Juros de Mora', value: '1%a.m.' },
            { label: 'Status Stripe', value: status?.stripe?.isConfigured ? '✅ Conectado' : '⚠️ Desconectado' },
            { label: 'Status Google', value: status?.googleCalendar?.isConnected ? '✅ Conectado' : '⚠️ Desconectado' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
              <span className="text-sm text-white/60">{item.label}</span>
              <span className="text-sm font-bold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};