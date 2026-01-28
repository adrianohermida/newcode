import clsx from 'clsx';
import { DashboardTab } from './hooks/useDashboardTabs';
import { FiHome, FiList, FiBriefcase, FiUsers } from 'react-icons/fi';

const DASHBOARD_TABS: Array<{
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}> = [
  { id: 'overview', label: 'Visão Geral', icon: FiHome },
  { id: 'tickets', label: 'Tickets', icon: FiList },
  { id: 'processos', label: 'Processos', icon: FiBriefcase },
  { id: 'crm', label: 'CRM', icon: FiUsers },
];

type Props = {
  activeTab: DashboardTab;
  onChange: (tab: DashboardTab) => void;
};

export const DashboardSidebar = ({ activeTab, onChange }: Props) => (
  <aside className="w-64 shrink-0 hidden lg:block">
    <nav className="space-y-1">
      {DASHBOARD_TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold',
            activeTab === tab.id
              ? 'bg-brand-primary'
              : 'text-white/40 hover:bg-white/5'
          )}
        >
          <tab.icon size={18} />
          {tab.label}
        </button>
      ))}
    </nav>
  </aside>
);
