/**
 * Dashboard Administrativo – Hermida Maia Advocacia
 * Arquitetura final desacoplada (modules + components)
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hey-boss/users-service/react';

/* ===============================
 * COMPONENTES GLOBAIS
 * =============================== */
import Header from '../Header';
import { ChatWidget } from '../ChatWidget';

/* ===============================
 * ICONS
 * =============================== */
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
  Folder,
} from 'lucide-react';

/* ===============================
 * MODULES (EXTRAÍDOS)
 * =============================== */
import { OverviewModule } from '../../modules/overview/OverviewModule';
import { CRMModule } from '../../modules/crm/CRMModule';
import { DocumentsModule } from '../../modules/documentos/DocumentsModule';
import { PlanoPagamentoModule } from '../../modules/financeiro/PlanoPagamentoModule';
import { FaturasModule } from '../../modules/financeiro/FaturasModule';
import { TicketsModule } from '../../modules/tickets/TicketsModule';
import { TicketDetailInline } from '../../modules/processos/ProcessosModule';
import { ProcessosModule } from '../../modules/processos/ProcessosModule';
import { AdminAgendaModule } from '../../modules/agenda/AdminAgendaModule';
import { ConfigModule } from '../../modules/config/ConfigModule';

/* ===============================
 * MODULES EXTERNOS
 * =============================== */
import { PublicacoesModule } from '../../components/Publicacoes/PublicacoesModule';
import { BlogManagementModule } from '../../modules/blog/BlogManagementModule';
import { AIMonitoringModule } from '../../modules/ia/AIMonitoringModule';
import { ChatbotConfigModule } from '../ChatbotConfigModule';

/* ===============================
 * UTILS
 * =============================== */
const clsx = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(' ');

/* ===============================
 * TYPES
 * =============================== */
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
  const { user, isPending } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [selectedProcesso, setSelectedProcesso] = useState<any | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  /* ===============================
   * ADMIN GUARD
   * =============================== */
  useEffect(() => {
    if (!isPending && user && !(user as any).isAdmin) {
      navigate('/portal', { replace: true });
    }
  }, [user, isPending, navigate]);

  /* ===============================
   * FETCH POR ABA
   * =============================== */
  useEffect(() => {
    let aborted = false;

    setSearchTerm('');
    if (activeTab !== 'processos') setSelectedProcesso(null);
    if (activeTab !== 'tickets') setSelectedTicket(null);

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
      return;
    }

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

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(endpoint);
        const json = await res.json();

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

        if (!aborted) setData(normalized);
      } catch (err) {
        console.error(err);
        if (!aborted) setData([]);
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      aborted = true;
    };
  }, [activeTab]);

  /* ===============================
   * FILTRO GLOBAL
   * =============================== */
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item =>
      Object.values(item).some(v =>
        String(v ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  /* ===============================
   * RENDER
   * =============================== */
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
                  <ProcessosModule data={filteredData} onSelect={setSelectedProcesso} />
                )}
                {activeTab === 'processos' && selectedProcesso && (
                  <ProcessoDetailInline processo={selectedProcesso} onBack={() => setSelectedProcesso(null)} />
                )}
                {activeTab === 'documentos' && <DocumentsModule data={filteredData} />}
                {activeTab === 'planos_pagamento' && <PlanoPagamentoModule data={filteredData} />}
                {activeTab === 'faturas' && <FaturasModule data={filteredData} />}
                {activeTab === 'tickets' && !selectedTicket && (
                  <TicketsModule data={filteredData} onSelect={setSelectedTicket} />
                )}
                {activeTab === 'tickets' && selectedTicket && (
                  <TicketDetailInline ticket={selectedTicket} onBack={() => setSelectedTicket(null)} />
                )}
                {activeTab === 'publicacoes' && <PublicacoesModule />}
                {activeTab === 'gestaoblog' && <BlogManagementModule />}
                {activeTab === 'agenda' && (
                  <AdminAgendaModule data={filteredData} loading={false} onRefresh={() => setActiveTab('agenda')} />
                )}
                {activeTab === 'ia' && <AIMonitoringModule />}
                {activeTab === 'chatbot' && <ChatbotConfigModule />}
                {activeTab === 'config' && <ConfigModule />}
              </>
            )}
          </section>
        </div>
      </main>

      {/* CHAT GLOBAL */}
      <ChatWidget />
    </div>
  );
};
