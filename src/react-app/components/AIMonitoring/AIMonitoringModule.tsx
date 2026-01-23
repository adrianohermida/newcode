



/**
 * @description Módulo AIMonitoringModule para gerenciamento completo de sessões IA.
 *             Exibe lista de sessões com filtros, busca, status e ações administrativas.
 *             Integra com AISessionViewer para visualização detalhada e intervenção.
 *             Fornece métricas e analytics em tempo real do chatbot.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, MessageSquare, AlertCircle, CheckCircle2, Clock, Eye, MoreVertical, Loader2 } from 'lucide-react';
import AISessionViewer from './AISessionViewer';

interface AIInteraction {
  id: number;
  session_id: string;
  visitor_email?: string;
  visitor_phone?: string;
  message_count: number;
  conversation_data: string;
  interaction_type: string;
  conversion_status: string;
  status: 'active' | 'resolved' | 'flagged';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export const AIMonitoringModule: React.FC = () => {
  const [sessions, setSessions] = useState<AIInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<AIInteraction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved' | 'flagged'>('all');
  const [filterType, setFilterType] = useState<'all' | 'appointment_request' | 'ticket_request' | 'general'>('all');

  useEffect(() => {
    fetchSessions();
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const statusParam = filterStatus === 'all' ? '' : `status=${filterStatus}`;
      const response = await fetch(`/api/admin/ai-interactions?${statusParam}`);
      if (response.ok) {
        const data = await response.json();
        setSessions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erro ao buscar sessões IA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIntervene = async (sessionId: string, message: string) => {
    try {
      const response = await fetch(`/api/admin/ai-interactions/${sessionId}/intervene`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'flagged', admin_notes: message })
      });

      if (response.ok) {
        // Feedback silencioso e atualização da lista
        fetchSessions();
      }
    } catch (error) {
      console.error('Erro ao intervir:', error);
      throw error;
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const matchesSearch =
        (session.visitor_email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (session.session_id.includes(searchTerm));

      const matchesType = filterType === 'all' || session.interaction_type === filterType;

      return matchesSearch && matchesType;
    });
  }, [sessions, searchTerm, filterType]);

  const stats = {
    total: sessions.length,
    active: sessions.filter(s => s.status === 'active').length,
    resolved: sessions.filter(s => s.status === 'resolved').length,
    flagged: sessions.filter(s => s.status === 'flagged').length,
    avgMessages: sessions.length > 0 ? Math.round(sessions.reduce((sum, s) => sum + s.message_count, 0) / sessions.length) : 0
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Ativas', value: stats.active, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { label: 'Resolvidas', value: stats.resolved, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'Marcadas', value: stats.flagged, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
          { label: 'Média Msgs', value: stats.avgMessages, icon: MessageSquare, color: 'text-brand-primary', bg: 'bg-brand-primary/10' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-brand-elevated p-4 rounded-2xl border border-white/5">
            <div className={`${stat.bg} p-2 w-fit rounded-lg mb-2`}>
              <stat.icon className={stat.color} size={20} />
            </div>
            <p className="text-white/40 text-xs font-bold uppercase mb-1">{stat.label}</p>
            <p className="text-2xl font-extrabold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filtros e Busca */}
      <div className="bg-brand-elevated p-4 rounded-2xl border border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input
              type="text"
              placeholder="Buscar por email ou session ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-dark border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-primary transition-all"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-primary transition-all"
          >
            <option value="all">Todos Status</option>
            <option value="active">Ativas</option>
            <option value="resolved">Resolvidas</option>
            <option value="flagged">Marcadas</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-primary transition-all"
          >
            <option value="all">Todos Tipos</option>
            <option value="general">Geral</option>
            <option value="appointment_request">Agendamento</option>
            <option value="ticket_request">Ticket</option>
          </select>
        </div>
      </div>

      {/* Tabela de Sessões */}
      <div className="bg-brand-elevated rounded-3xl border border-white/5 overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="text-brand-primary animate-spin" size={48} />
            <p className="text-white/40 font-medium">Carregando sessões IA...</p>
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest border-b border-white/5">
                  <th className="px-6 py-4">Sessão / Visitante</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Mensagens</th>
                  <th className="px-6 py-4">Última Atualização</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSessions.map((session, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-6">
                      <div>
                        <p className="font-bold text-white">#{session.session_id.slice(0, 8)}</p>
                        <p className="text-white/40 text-xs">{session.visitor_email || 'Anônimo'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-white/5 text-white/60">
                        {session.interaction_type || 'geral'}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span
                        className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                          session.status === 'active'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : session.status === 'resolved'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <p className="font-bold text-white">{session.message_count}</p>
                    </td>
                    <td className="px-6 py-6 text-white/60 text-xs">
                      {new Date(session.updated_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="p-2 hover:text-brand-primary transition-colors"
                        title="Visualizar"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-white/20">
            <MessageSquare size={48} className="mb-4" />
            <p>Nenhuma sessão encontrada com os filtros selecionados.</p>
          </div>
        )}
      </div>

      {/* Session Viewer Modal */}
      {selectedSession && (
        <AISessionViewer
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onIntervene={handleIntervene}
        />
      )}
    </div>
  );
};

export default AIMonitoringModule;
  


