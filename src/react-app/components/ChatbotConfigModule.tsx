

/**
 * @description Módulo de configuração do Chatbot Jurídico.
 *             Permite gerenciar intents, entidades e visualizar logs de IA.
 *             Integrado ao Dashboard administrativo.
 */

import React, { useState, useEffect } from 'react';
import { Bot, Zap, MessageSquare, Settings, Shield, Plus, Search, Edit2, Trash2, Loader2, CheckCircle2 } from 'lucide-react';

export const ChatbotConfigModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'intents' | 'personas' | 'logs'>('intents');
  const [intents, setIntents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntents();
  }, []);

  const fetchIntents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/chatbot/intents');
      if (res.ok) {
        const data = await res.json();
        setIntents(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-brand-elevated p-8 rounded-[2rem] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary">
            <Bot size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Configuração do Chatbot</h2>
            <p className="text-white/50 text-sm">Gerencie a inteligência e o comportamento do seu assistente virtual.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-all">
            <Plus size={18} /> Nova Intenção
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-brand-elevated p-1.5 rounded-2xl border border-white/5 flex gap-1">
        {[
          { id: 'intents', label: 'Intenções & Fluxos', icon: Zap },
          { id: 'personas', label: 'Personas de Atendimento', icon: Bot },
          { id: 'logs', label: 'Logs & Auditoria', icon: MessageSquare },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id 
                ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-brand-elevated rounded-3xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="py-32 flex flex-col items-center gap-4">
            <Loader2 className="text-brand-primary animate-spin" size={48} />
            <p className="text-white/40 font-medium">Carregando configurações...</p>
          </div>
        ) : activeTab === 'intents' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest border-b border-white/5">
                  <th className="px-8 py-4">Nome da Intenção</th>
                  <th className="px-8 py-4">Descrição</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {intents.length > 0 ? intents.map((intent, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6 font-bold text-white">{intent.nome}</td>
                    <td className="px-8 py-6 text-white/60">{intent.descricao}</td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${intent.ativo ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {intent.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:text-brand-primary transition-colors"><Edit2 size={16} /></button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-white/20">Nenhuma intenção personalizada configurada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-32 text-center text-white/20">
            <Settings size={48} className="mx-auto mb-4 opacity-20" />
            <p>Módulo em desenvolvimento para aprimoramento de personas e logs.</p>
          </div>
        )}
      </div>
    </div>
  );
};
  
