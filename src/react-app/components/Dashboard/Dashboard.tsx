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
import { apiFetch } from '../../controllers/ApiController';

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

import { Loader2 } from 'lucide-react';

export const Dashboard = () => {
  const session = useSupabaseSession();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [tabData, setTabData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session === undefined) return;
    if (!session) {
      navigate('/login', { replace: true });
    }
  }, [session, navigate]);

  if (session === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    );
  }
  if (!session) return null;

      // Fetch data for each tab
      useEffect(() => {
        if (!session) return;
        setLoading(true);
        let endpoint = '';
        switch (activeTab) {
          case 'overview':
            endpoint = '/api/dashboard/overview';
            break;
          case 'tickets':
            endpoint = '/api/tickets';
            break;
          case 'processos':
            endpoint = '/api/processos';
            break;
          case 'faturas':
            endpoint = '/api/financeiro/faturas';
            break;
          case 'planos_pagamento':
            endpoint = '/api/financeiro/planos';
            break;
          case 'documentos':
            endpoint = '/api/documentos';
            break;
          default:
            setTabData([]);
            setLoading(false);
            return;
        }
        apiFetch(endpoint)
          .then(data => {
            setTabData(Array.isArray(data) ? data : (data?.items || []));
            setLoading(false);
          })
          .catch(() => {
            setTabData([]);
            setLoading(false);
          });
      }, [activeTab, session]);

      return (
        <div className="min-h-screen bg-brand-dark text-white">
          <Header />

          <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
            <div className="flex gap-8">
              <aside className="w-64 hidden lg:block">
                <nav className="space-y-1">
                  {[...
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
                {loading ? (
                  <div className="text-center py-20 text-white/40">Carregando dados...</div>
                ) : (
                  <>
                    {activeTab === 'overview' && <OverviewModule data={tabData} />}
                    {activeTab === 'crm' && <CRMModule />}
                    {activeTab === 'processos' && <ProcessosModule data={tabData} onSelect={() => {}} />}
                    {activeTab === 'documentos' && <DocumentsModule data={tabData} />}
                    {activeTab === 'planos_pagamento' && <PlanoPagamentoModule data={tabData} />}
                    {activeTab === 'faturas' && <FaturasModule data={tabData} />}
                    {activeTab === 'tickets' && !selectedTicket && (
                      <TicketsModule data={tabData} onSelect={setSelectedTicket} />
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
                  </>
                )}
              </section>
            </div>
          </main>

          <ChatWidget />
        </div>
      );
    };
  );
};
