
/**
 * @description Módulo principal do Balcão Virtual para gestão omnichannel.
 *             Centraliza conversas, canais, filas e automações de IA.
 *             Interface baseada em abas para facilitar a navegação administrativa.
 *             A "Visão Geral" agora reflete dados reais do banco de dados Heyboss.
 */

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Settings, 
  Layers, 
  Bot, 
  Users, 
  History, 
  Loader2, 
  Plus, 
  Search, 
  Filter,
  Globe,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { UnifiedInbox } from './UnifiedInbox';
import { ChannelConfig } from './ChannelConfig';
import { QueueConfig } from './QueueConfig';
import { clsx } from 'clsx';

export const BalcaoVirtualModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'channels' | 'queues' | 'personas' | 'audit'>('inbox');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    sla_risk: 0,
    online_channels: 0
  });

  useEffect(() => {
    fetchStats();
    // Real-time update: poll every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/balcao/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Failed to fetch Balcão Virtual stats:", e);
    } finally {
      setLoading(false);
    }
  };

  const subTabs = [
    { id: 'inbox', label: 'Caixa de Entrada', icon: MessageSquare },
    { id: 'channels', label: 'Canais', icon: Globe },
    { id: 'queues', label: 'Filas & Roteamento', icon: Layers },
    { id: 'personas', label: 'IA & Personas', icon: Bot },
    { id: 'audit', label: 'Auditoria LGPD', icon: History },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mini Stats Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Atendimentos Ativos', value: stats.active, icon: MessageSquare, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
          { label: 'Aguardando Fila', value: stats.pending, icon: Users, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { label: 'Risco de SLA', value: stats.sla_risk, icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-400/10' },
          { label: 'Canais Online', value: stats.online_channels, icon: Zap, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-brand-elevated p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={stat.color} size={18} />
              </div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
            {loading ? (
              <div className="h-8 w-12 bg-white/5 animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-extrabold text-white">{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Sub-navigation Tabs */}
      <div className="bg-brand-elevated p-1.5 rounded-2xl border border-white/5 flex gap-1 overflow-x-auto scrollbar-hide">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0",
              activeSubTab === tab.id 
                ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeSubTab === 'inbox' && <UnifiedInbox />}
        {activeSubTab === 'channels' && <ChannelConfig />}
        {activeSubTab === 'queues' && <QueueConfig />}
        {activeSubTab === 'personas' && (
          <div className="bg-brand-elevated rounded-3xl border border-white/5 p-8 text-center text-white/40">
            <Bot size={48} className="mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-bold text-white mb-2">Personas de IA</h3>
            <p className="max-w-md mx-auto text-sm">Defina o tom de voz e o comportamento do assistente virtual para cada canal de atendimento.</p>
            <button className="mt-6 bg-brand-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm">Criar Persona</button>
          </div>
        )}
        {activeSubTab === 'audit' && (
          <div className="bg-brand-elevated rounded-3xl border border-white/5 p-8 text-center text-white/40">
            <History size={48} className="mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-bold text-white mb-2">Auditoria LGPD</h3>
            <p className="max-w-md mx-auto text-sm">Trilha imutável de acessos, exportações e consentimentos capturados em todos os canais.</p>
            <button className="mt-6 bg-white/5 text-white border border-white/10 px-6 py-2.5 rounded-xl font-bold text-sm">Ver Logs Completos</button>
          </div>
        )}
      </div>
    </div>
  );
};
  