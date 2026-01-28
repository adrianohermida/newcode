import React from 'react';
import { DashboardTab } from './hooks/useDashboardTabs';
import { useDashboardData } from './hooks/useDashboardData';

// Placeholders para módulos reais
const Loading = () => <div>Carregando...</div>;
const TicketDetailInline = ({ ticket, onBack }: any) => <div>Detalhe do ticket <button onClick={onBack}>Voltar</button></div>;
const TicketsModule = ({ data, onSelect }: any) => <div>Tickets ({data?.length || 0})</div>;
const ProcessoDetailInline = ({ processo, onBack }: any) => <div>Detalhe do processo <button onClick={onBack}>Voltar</button></div>;
const ProcessosModule = ({ data, onSelect }: any) => <div>Processos ({data?.length || 0})</div>;
const CRMModule = ({ data }: any) => <div>CRM ({data?.length || 0})</div>;
const OverviewModule = () => <div>Visão Geral</div>;
const EmptyState = () => <div>Nenhum dado encontrado.</div>;

type Props = {
  activeTab: DashboardTab;
  selectedItem: any;
  onSelectItem: (item: any) => void;
};

export const DashboardContent = ({
  activeTab,
  selectedItem,
  onSelectItem,
}: Props) => {
  const { data, loading } = useDashboardData(activeTab);

  if (loading) return <Loading />;

  switch (activeTab) {
    case 'tickets':
      return selectedItem ? (
        <TicketDetailInline
          ticket={selectedItem}
          onBack={() => onSelectItem(null)}
        />
      ) : (
        <TicketsModule
          data={data}
          onSelect={onSelectItem}
        />
      );

    case 'processos':
      return selectedItem ? (
        <ProcessoDetailInline
          processo={selectedItem}
          onBack={() => onSelectItem(null)}
        />
      ) : (
        <ProcessosModule
          data={data}
          onSelect={onSelectItem}
        />
      );

    case 'crm':
      return <CRMModule data={data} />;

    case 'overview':
      return <OverviewModule />;

    default:
      return <EmptyState />;
  }
};
