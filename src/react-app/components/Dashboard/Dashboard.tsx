import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseSession } from '../../hooks/useSupabaseSession';
import { useIsAdmin } from '../../hooks/useIsAdmin';

/* COMPONENTES */
import Header from '../Header';
import { ChatWidget } from '../ChatWidget';

/* ICONS */
import {
  Users,
  Scale,
  CreditCard,
  MessageSquare,
  FileText,
  Settings,
  LayoutDashboard,
  Bot,
  Calendar,
  Folder,
} from 'lucide-react';

/* MODULES */
import { OverviewModule } from '../../modules/overview/OverviewModule';
import { CRMModule } from '../../modules/crm/CRMModule';
import { DocumentsModule } from '../../modules/documentos/DocumentsModule';
import { PlanoPagamentoModule } from '../../modules/financeiro/PlanoPagamentoModule';
import { FaturasModule } from '../../modules/financeiro/FaturasModule';
import { TicketsModule } from '../../modules/tickets/TicketsModule';
import { TicketDetailInline } from '../../modules/tickets/TicketDetailInline';
import { ProcessosModule } from '../../modules/processos/ProcessosModule';
import { AdminAgendaModule } from '../../modules/agenda/AdminAgendaModule';
import { ConfigModule } from '../../modules/config/ConfigModule';
import { BlogManagementModule } from '../../modules/blog/BlogManagementModule';
import { AIMonitoringModule } from '../../modules/ia/AIMonitoringModule';
import { PublicacoesModule } from '../../components/Publicacoes/PublicacoesModule';
import { ChatbotConfigModule } from '../ChatbotConfigModule';

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

export const Dashboard = () => {
  const session = useSupabaseSession();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  useEffect(() => {
    // Proteção robusta: só age quando a sessão já foi carregada
    if (session === undefined) return;
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }
    if (!isAdmin) {
      navigate('/portal', { replace: true });
    }
  }, [session, isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />

      <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="flex gap-8">
          <aside className="w-64 hidden lg:block">
            <nav className="space-y-1">
              {[
                ['overview', 'Visão Geral', LayoutDashboard],
                ['crm', 'CRM', Users],
                ['processos', 'Processos', Scale],
                ['documentos', 'Documentos', Folder],
                ['planos_pagamento', 'Planos', CreditCard],
                ['faturas', 'Financeiro', CreditCard],
                ['tickets', 'Helpdesk', MessageSquare],
                ['publicacoes', 'Publicações', FileText],
                ['gestaoblog', 'Blog', FileText],
                ['agenda', 'Agenda', Calendar],
                ['ia', 'IA', Bot],
                ['chatbot', 'Chatbot', Bot],
                ['config', 'Configurações', Settings],
              ].map(([id, label, Icon]: any) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${
                    activeTab === id
                      ? 'bg-brand-primary'
                      : 'text-white/40 hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <section className="flex-1 space-y-6">
            {activeTab === 'overview' && <OverviewModule />}
            {activeTab === 'crm' && <CRMModule />}
            {activeTab === 'processos' && <ProcessosModule />}
            {activeTab === 'documentos' && <DocumentsModule />}
            {activeTab === 'planos_pagamento' && <PlanoPagamentoModule />}
            {activeTab === 'faturas' && <FaturasModule />}
            {activeTab === 'tickets' && !selectedTicket && (
              <TicketsModule onSelect={setSelectedTicket} />
            )}
            {activeTab === 'tickets' && selectedTicket && (
              <TicketDetailInline
                ticket={selectedTicket}
                onBack={() => setSelectedTicket(null)}
              />
            )}
            {activeTab === 'publicacoes' && <PublicacoesModule />}
            {activeTab === 'gestaoblog' && <BlogManagementModule />}
            {activeTab === 'agenda' && <AdminAgendaModule />}
            {activeTab === 'ia' && <AIMonitoringModule />}
            {activeTab === 'chatbot' && <ChatbotConfigModule />}
            {activeTab === 'config' && <ConfigModule />}
          </section>
        </div>
      </main>

      <ChatWidget />
    </div>
  );
};
