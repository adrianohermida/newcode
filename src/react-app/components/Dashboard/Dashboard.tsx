import { useDashboardTabs } from './hooks/useDashboardTabs';
import { DashboardLayout } from './DashboardLayout';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { DashboardContent } from './DashboardContent';
import { useSupabaseSession } from '../../hooks/useSupabaseSession';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

export const Dashboard = () => {
  const session = useSupabaseSession();
  const navigate = useNavigate();
  const {
    activeTab,
    setActiveTab,
    selectedItem,
    setSelectedItem,
  } = useDashboardTabs();

  // Permitir apenas admin autenticado
  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }
    // Checagem simples: admin = email termina com @hermidamaia.com.br
    const email = session.user?.email || '';
    if (!email.endsWith('@hermidamaia.com.br')) {
      navigate('/account', { replace: true });
    }
  }, [session, navigate]);

  if (!session) return null;

  return (
    <DashboardLayout
      sidebar={
        <DashboardSidebar
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      }
      header={<DashboardHeader />}
      content={
        <DashboardContent
          activeTab={activeTab}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
        />
      }
    />
  );
};
