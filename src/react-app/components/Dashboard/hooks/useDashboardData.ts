
import { useState, useEffect } from 'react';
import { DashboardTab } from './useDashboardTabs';

export function useDashboardData(tab: DashboardTab) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simula fetch de dados
    setTimeout(() => {
      setData([]); // Substitua por fetch real
      setLoading(false);
    }, 500);
  }, [tab]);

  return { data, loading };
}
