import { useState, useEffect } from 'react';

export type DashboardTab = 'overview' | 'tickets' | 'processos' | 'crm';

export const useDashboardTabs = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    setSelectedItem(null);
  }, [activeTab]);

  return {
    activeTab,
    setActiveTab,
    selectedItem,
    setSelectedItem,
  };
};
