/**
 * @description Componente de configuração de canais para o Balcão Virtual.
 *             Permite gerenciar conexões com WhatsApp, Web, Facebook, etc.
 *             Utiliza CustomForm para edição de credenciais e webhooks.
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Globe, 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Send, 
  Edit, 
  Trash2, 
  Loader2,
  CheckCircle2,
  X
} from 'lucide-react';
import { CustomForm } from '../CustomForm';
import { contactFormTheme } from '../CustomForm/themes';
import allConfigs from '../../../shared/form-configs.json';

import { useMemo } from 'react';

export const ChannelConfig: React.FC = () => {
  const [channels, setChannels] = useState<any[]>([]);
  const [queues, setQueues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingChannel, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchChannels();
    fetchQueues();
  }, []);

  const fetchQueues = async () => {
    try {
      const res = await fetch('/api/admin/queues');
      if (res.ok) setQueues(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchChannels = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/channels');
      if (res.ok) setChannels(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/channels/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus })
      });
      
      if (res.ok) {
        fetchChannels();
      } else {
        const result = await res.json();
        alert(result.error || "Erro ao alterar status do canal.");
      }
    } catch (e) {
      alert("Erro de conexão ao alterar status.");
    }
  };

  const handleSave = async (formData: any) => {
    // Validar se as credenciais são um JSON válido
    if (formData.credentials) {
      try {
        JSON.parse(formData.credentials);
      } catch (e) {
        alert("Erro: O campo 'Credenciais' deve conter um JSON válido.");
        return;
      }
    }

    const method = editingChannel?.id ? 'PUT' : 'POST';
    const endpoint = `/api/admin/channels${editingChannel?.id ? `/${editingChannel.id}` : ''}`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          active: formData.active ? 1 : 0 // Garantir formato inteiro para o banco D1
        })
      });
      
      const result = await res.json();
      if (res.ok && result.success) {
        setIsEditorOpen(false);
        fetchChannels();
      } else {
        alert(result.error || "Erro ao salvar canal.");
      }
    } catch (e) {
      alert("Erro de conexão ao salvar canal.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este canal?')) return;
    try {
      const res = await fetch(`/api/admin/channels/${id}`, { method: 'DELETE' });
      if (res.ok) fetchChannels();
    } catch (e) {
      alert("Erro ao excluir.");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'web': return <Globe size={20} />;
      case 'whatsapp': return <MessageCircle size={20} />;
      case 'facebook': return <Facebook size={20} />;
      case 'instagram': return <Instagram size={20} />;
      case 'telegram': return <Send size={20} />;
      default: return <Globe size={20} />;
    }
  };

  const formConfig = useMemo(() => {
    const baseSchema = allConfigs.channel_form.jsonSchema;
    // Create a copy to avoid mutating the original
    const schema = JSON.parse(JSON.stringify(baseSchema));
    
    // Dynamically update queue options if queues are loaded
    if (queues.length > 0 && schema.properties.default_queue_id) {
      schema.properties.default_queue_id = {
        ...schema.properties.default_queue_id,
        enum: queues.map(q => q.id),
        enumNames: queues.map(q => q.name)
      };
    }
    return schema;
  }, [queues]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">Canais de Atendimento</h3>
        <button 
          onClick={() => { setEditingItem(null); setIsEditorOpen(true); }}
          className="bg-brand-primary text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-primary/20"
        >
          <Plus size={16} /> Novo Canal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" /></div>
        ) : channels.map((channel) => (
          <div key={channel.id} className="bg-brand-elevated p-6 rounded-3xl border border-white/5 hover:border-brand-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                {getIcon(channel.type)}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => { setEditingItem(channel); setIsEditorOpen(true); }} className="p-2 hover:text-brand-primary transition-colors"><Edit size={16} /></button>
                <button onClick={() => handleDelete(channel.id)} className="p-2 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <h4 className="font-bold text-white mb-1">{channel.name}</h4>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-4">{channel.type}</p>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleToggleActive(channel.id, !!channel.active)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${channel.active ? 'bg-brand-primary' : 'bg-white/10'}`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${channel.active ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
                <span className={`text-[8px] font-bold uppercase ${channel.active ? 'text-green-400' : 'text-white/20'}`}>
                  {channel.active ? 'Aceitando Atendimentos' : 'Pausado'}
                </span>
              </div>
              <span className="text-[10px] text-white/40">ID: #{channel.id}</span>
            </div>
          </div>
        ))}
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm">
          <div className="bg-brand-elevated w-full max-w-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold">{editingChannel ? 'Editar Canal' : 'Novo Canal'}</h2>
              <button onClick={() => setIsEditorOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-all"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <CustomForm 
                id="channel_form"
                schema={allConfigs.channel_form.jsonSchema}
                formData={editingChannel || {}}
                onSubmit={handleSave}
                theme={contactFormTheme}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};