


/**
 * @description Componente de Widget de Chat com IA para atendimento ao público.
 *             Permite FAQ, consulta de status de processos/tickets e abertura de chamados.
 *             Utiliza a API do Worker para processamento de linguagem natural.
 */

import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../controllers/ApiController';
import { MessageCircle, X, Send, Loader2, User, Bot, ChevronRight, FileText, Calendar, Search, History, MessageSquare, Receipt, Shield } from 'lucide-react';
import { cn } from '../utils';
// import { useAuth } from '@hey-boss/users-service/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'status' | 'form';
  data?: any;
}


export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedSessionId = sessionStorage.getItem('chat_session_id');
    if (savedSessionId) setSessionId(savedSessionId);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleConsent = () => {
    setHasConsent(true);
  };

  // ...existing code...

  const handleSend = async (overrideInput?: string) => {
    const messageText = overrideInput || input;
    if (!messageText.trim() || isLoading) return;

    // Ensure we have a session ID before sending
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      setSessionId(currentSessionId);
      sessionStorage.setItem('chat_session_id', currentSessionId);
    }

    const userMessage: Message = {
      try {
        const data = await apiFetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: messageText,
            history: messages.map(m => ({ role: m.role, content: m.content })),
            session_id: currentSessionId
          })
        });
        if (data && data.reply) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: data.reply,
            timestamp: new Date(),
            type: data.type,
            data: data.data
          }]);
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: data?.error || 'Erro ao processar resposta.',
            timestamp: new Date()
          }]);
        }
      } catch (e) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Erro de conexão. Tente novamente.',
          timestamp: new Date()
        }]);
      } finally {
        setIsLoading(false);
      }
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Erro de conexão. Por favor, tente novamente mais tarde.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-brand-elevated rounded-[2rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-brand-primary p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bot className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Assistente Virtual</h3>
                <p className="text-white/70 text-[10px] uppercase tracking-widest font-bold">Online agora</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {!hasConsent ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
                <div className="bg-brand-primary/10 p-4 rounded-full">
                  <Shield className="text-brand-primary" size={48} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-white font-bold">Sua Privacidade é Importante</h4>
                  <p className="text-white/60 text-xs px-4">
                    Para iniciarmos o atendimento, precisamos do seu consentimento para processar seus dados conforme a LGPD.
                  </p>
                </div>
                <button 
                  onClick={handleConsent}
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-primary/20"
                >
                  Aceitar e Iniciar Chat
                </button>
                <p className="text-[10px] text-white/30">
                  Ao clicar, você concorda com nossos <a href="#" className="underline">Termos de Uso</a>.
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div key={idx} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                    <div className={cn(
                      "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed",
                      msg.role === 'user' 
                        ? "bg-brand-primary text-white rounded-tr-none" 
                        : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none"
                    )}>
                      {msg.content}
                      
                      {/* Status Display Data */}
                      {msg.type === 'status' && msg.data && (
                        <div className="mt-3 p-3 bg-black/20 rounded-xl border border-white/5 space-y-2">
                          {msg.data.map((item: any, i: number) => (
                            <div key={i} className="flex items-center justify-between text-[10px]">
                              <span className="text-white/40">{item.label}:</span>
                              <span className="text-brand-primary font-bold">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[8px] text-white/20 mt-1 px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-2">
                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none">
                      <Loader2 className="text-brand-primary animate-spin" size={16} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="px-6 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { label: 'Status Processo', icon: Search, prompt: 'Gostaria de saber o status do meu processo' },
              { label: 'Abrir Ticket', icon: FileText, prompt: 'Preciso abrir um chamado de suporte' },
              { label: 'Agendar', icon: Calendar, prompt: 'Quero agendar uma consulta' },
              { label: 'Falar com Humano', icon: User, prompt: 'Quero falar com um advogado agora' }
            ].map((action, i) => (
              <button 
                key={i}
                onClick={() => handleSend(action.prompt)}
                className="shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-[10px] text-white/60 flex items-center gap-1.5 transition-all"
              >
                <action.icon size={12} />
                {action.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className={`p-6 border-t border-white/10 ${!hasConsent ? 'opacity-20 pointer-events-none grayscale' : ''}`}>
            <div className="relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua dúvida..."
                className="w-full bg-brand-dark border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white outline-none focus:border-brand-primary transition-all"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-primary hover:text-brand-primary/80 disabled:opacity-30 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95",
          isOpen ? "bg-brand-elevated border border-white/10 text-white" : "bg-brand-primary text-white"
        )}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent rounded-full border-2 border-brand-dark flex items-center justify-center text-[10px] font-bold animate-bounce">
            1
          </span>
        )}
      </button>
    </div>
  );
};


