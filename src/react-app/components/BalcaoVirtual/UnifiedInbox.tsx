
/**
 * @description Unified Inbox component for the Balcão Virtual module.
 *             Displays a list of all ongoing conversations with real-time updates.
 *             Allows administrators to view and reply to messages from various channels.
 *             Integrates with the backend API for persistent data storage and retrieval.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MessageSquare, 
  User, 
  Bot, 
  Globe, 
  Clock, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Loader2,
  Smartphone,
  Monitor
} from 'lucide-react';
import { clsx } from 'clsx';

export const UnifiedInbox: React.FC = () => {
  import { apiFetch } from '../../controllers/ApiController';
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000); // Poll conversations every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv.id);
      const interval = setInterval(() => fetchMessages(selectedConv.id), 5000); // Poll messages every 5s
      return () => clearInterval(interval);
    }
  }, [selectedConv]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await apiFetch('/api/admin/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (e) {
      console.error("Failed to fetch conversations:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (id: number) => {
    try {
      const res = await apiFetch(`/api/admin/conversations/${id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error("Failed to fetch messages:", e);
    }
  };

  const handleSend = async () => {
    if (!reply.trim() || sending || !selectedConv) return;
    setSending(true);
    try {
      const res = await apiFetch(`/api/admin/conversations/${selectedConv.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: reply })
      });
      
      if (res.ok) {
        setReply("");
        fetchMessages(selectedConv.id);
      } else {
        const error = await res.json();
        alert(error.message || "Erro ao enviar mensagem.");
      }
    } catch (e) {
      alert("Erro de conexão ao enviar mensagem.");
    } finally {
      setSending(false);
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'whatsapp': return <Smartphone size={12} className="text-green-500" />;
      case 'web': return <Monitor size={12} className="text-blue-500" />;
      default: return <Globe size={12} className="text-white/40" />;
    }
  };

  const getAgentDisplay = (agentEmail: string | null) => {
    if (!agentEmail) return "Fila de Espera";
    if (agentEmail === 'ia') return "Assistente IA";
    return agentEmail;
  };

  return (
    <div className="bg-brand-elevated rounded-3xl border border-white/5 overflow-hidden shadow-xl flex h-[700px] animate-fade-in">
      {/* Conversations List */}
      <div className="w-80 border-r border-white/5 flex flex-col shrink-0 bg-brand-dark/20">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
            <input 
              type="text" 
              placeholder="Buscar conversas..." 
              className="w-full bg-brand-dark border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-brand-primary transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-brand-primary" size={24} />
            </div>
          ) : conversations.length > 0 ? (
            <div className="divide-y divide-white/5">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={clsx(
                    "w-full p-4 text-left hover:bg-white/5 transition-all flex items-start gap-3 group",
                    selectedConv?.id === conv.id && "bg-white/5"
                  )}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                      <User size={18} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-brand-dark border-2 border-brand-elevated flex items-center justify-center">
                      {getChannelIcon(conv.channel_type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-xs text-white truncate">
                        {conv.first_name} {conv.last_name}
                      </p>
                      <span className="text-[8px] text-white/20 font-bold uppercase">
                        {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-[9px] text-white/40 truncate">{conv.channel_name}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-[9px] text-brand-primary font-medium truncate">
                        {getAgentDisplay(conv.assigned_agent_email)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={clsx(
                        "text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md",
                        conv.status === 'novo' ? "bg-brand-primary/10 text-brand-primary" : 
                        conv.status === 'ativo' ? "bg-blue-500/10 text-blue-400" :
                        "bg-white/5 text-white/40"
                      )}>
                        {conv.status}
                      </span>
                      {conv.routing_rule_applied && (
                        <span className="text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-white/5 text-white/30 border border-white/5">
                          {conv.routing_rule_applied.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-white/20">
              <MessageSquare size={48} className="mb-4 opacity-10" />
              <p className="text-sm font-bold">Nenhuma conversa</p>
              <p className="text-[10px] mt-1">Aguardando novos atendimentos...</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col min-w-0 bg-brand-dark/10">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-brand-dark/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                  <User size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">{selectedConv.first_name} {selectedConv.last_name}</h3>
                    {selectedConv.routing_rule_applied && (
                      <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                        Regra: {selectedConv.routing_rule_applied.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/40">
                    {selectedConv.lead_email} • {selectedConv.channel_name} • {getAgentDisplay(selectedConv.assigned_agent_email)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg transition-all text-white/40 hover:text-white">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/10">
                  <Clock size={32} className="mb-2 opacity-20" />
                  <p className="text-xs">Início da conversa</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={clsx("flex flex-col", msg.author_type === 'agent' ? "items-end" : "items-start")}>
                    <div className={clsx(
                      "max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed shadow-lg",
                      msg.author_type === 'agent' 
                        ? "bg-brand-primary text-white rounded-tr-none" 
                        : msg.author_type === 'ia'
                        ? "bg-brand-accent/20 border border-brand-accent/30 text-white rounded-tl-none"
                        : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none"
                    )}>
                      {msg.content}
                    </div>
                    <span className="text-[8px] text-white/20 mt-1 px-2 font-bold">
                      {msg.author_type === 'agent' ? "Você" : msg.author_type === 'ia' ? "IA" : "Cliente"} • {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-brand-dark/30">
              <div className="relative flex items-center gap-2">
                <button className="p-2 text-white/20 hover:text-white transition-all">
                  <Paperclip size={18} />
                </button>
                <textarea 
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Digite sua resposta..."
                  className="flex-1 bg-brand-dark border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-brand-primary transition-all resize-none h-12 scrollbar-hide"
                />
                <button 
                  onClick={handleSend}
                  disabled={!reply.trim() || sending}
                  className="p-3 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 disabled:opacity-30 transition-all shadow-lg shadow-brand-primary/20"
                >
                  {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/20">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <MessageSquare size={40} className="opacity-10" />
            </div>
            <p className="text-sm font-bold text-white/40">Selecione uma conversa</p>
            <p className="text-xs mt-1">Atendimentos de todos os canais aparecerão aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
};
  