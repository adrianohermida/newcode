



/**
 * @description Componente AISessionViewer para visualização e gerenciamento de sessões IA.
 *             Exibe histórico de conversas, detecção de intenção, status e opções de intervenção.
 *             Integrado ao Dashboard administrativo para monitoramento em tempo real.
 *             Permite admin visualizar, intervir, exportar e gerenciar sessões de IA.
 */

import React, { useState, useEffect } from 'react';
import { Eye, MessageSquare, Download, AlertCircle, CheckCircle2, Clock, X, Send, Loader2 } from 'lucide-react';

interface AISession {
  id: number;
  session_id: string;
  visitor_email?: string;
  visitor_phone?: string;
  message_count: number;
  conversation_data: string;
  interaction_type: string;
  conversion_status: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Props {
  session: AISession | null;
  onClose: () => void;
  onIntervene: (sessionId: string, message: string) => Promise<void>;
}

export const AISessionViewer: React.FC<Props> = ({ session, onClose, onIntervene }) => {
  const [interventionMessage, setInterventionMessage] = useState('');
  const [sendingIntervention, setSendingIntervention] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (session && session.conversation_data) {
      try {
        const parsed = JSON.parse(session.conversation_data);
        setMessages(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error('Erro ao parsear conversa:', e);
      }
    }
  }, [session]);

  const handleSendIntervention = async () => {
    if (!interventionMessage.trim() || !session) return;

    setSendingIntervention(true);
    try {
      await onIntervene(session.session_id, interventionMessage);
      setInterventionMessage('');
      // Aqui você poderia atualizar a lista de mensagens em tempo real
    } catch (error) {
      console.error('Erro ao enviar intervenção:', error);
      // Em uma auditoria real, usaríamos um componente de Toast aqui
    } finally {
      setSendingIntervention(false);
    }
  };

  if (!session) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'resolved':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'flagged':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-white/5 text-white/40';
    }
  };

  const exportConversation = () => {
    const filename = `conversa_${session.session_id}_${new Date().toISOString().slice(0, 10)}.json`;
    const dataStr = JSON.stringify(
      {
        session_id: session.session_id,
        visitor_email: session.visitor_email,
        messages: messages,
        exported_at: new Date().toISOString()
      },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-md">
      <div className="bg-brand-elevated w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex items-center justify-between bg-brand-primary/5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary">
              <MessageSquare size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white">Sessão IA #{session.session_id.slice(0, 8)}</h2>
              <p className="text-white/50 text-sm">
                {session.visitor_email || 'Visitante Anônimo'} • {session.message_count} mensagens
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Metadados */}
        <div className="p-6 border-b border-white/10 bg-white/2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Status</p>
            <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${getStatusColor(session.status)}`}>
              {session.status}
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Tipo de Interação</p>
            <p className="text-white/80 text-sm">{session.interaction_type || 'geral'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Conversão</p>
            <p className="text-white/80 text-sm">{session.conversion_status || 'pendente'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Criado em</p>
            <p className="text-white/80 text-sm">
              {new Date(session.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Conversa */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          {messages.length > 0 ? (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-brand-primary text-white rounded-tr-none'
                      : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[8px] text-white/20 mt-1 px-2">
                  {msg.role === 'user' ? 'Visitante' : 'IA'} • {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-white/40">
              <p>Nenhuma mensagem para exibir</p>
            </div>
          )}
        </div>

        {/* Painel de Intervenção */}
        <div className="p-6 border-t border-white/10 bg-white/2 space-y-4">
          <div className="flex gap-2">
            <button
              onClick={exportConversation}
              className="flex-1 sm:flex-none bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-2 rounded-xl font-bold text-sm transition-all"
            >
              <Download size={16} className="inline mr-2" />
              Exportar
            </button>
          </div>

          {session.status === 'active' && (
            <div className="relative">
              <textarea
                value={interventionMessage}
                onChange={(e) => setInterventionMessage(e.target.value)}
                placeholder="Digite sua resposta como equipe Hermida Maia..."
                className="w-full bg-brand-dark border border-white/10 rounded-2xl py-4 pl-5 pr-16 text-sm text-white outline-none focus:border-brand-primary transition-all resize-none min-h-[100px]"
              />
              <button
                onClick={handleSendIntervention}
                disabled={!interventionMessage.trim() || sendingIntervention}
                className="absolute right-3 bottom-3 p-3 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 disabled:opacity-30 transition-all shadow-lg shadow-brand-primary/20"
              >
                {sendingIntervention ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISessionViewer;
  


