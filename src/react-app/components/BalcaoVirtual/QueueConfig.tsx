/**
 * @description Componente de configuração de filas e roteamento para o Balcão Virtual.
 *             Permite gerenciar filas de atendimento e definir regras de distribuição (IA, Round-Robin, Manual).
 *             Utiliza CustomForm para edição de propriedades da fila.
 *             Registra logs de auditoria para cada operação de fila.
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Layers, 
  Zap, 
  Users, 
  Mailbox, 
  Edit, 
  Trash2, 
  Loader2,
  X,
  Settings2,
  ArrowRightLeft,
  CheckCircle2
} from 'lucide-react';
import { CustomForm } from '../CustomForm';
import { contactFormTheme } from '../CustomForm/themes';
import allConfigs from '../../../shared/form-configs.json';

export const QueueConfig: React.FC = () => {
  const [queues, setQueues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingQueue, setEditingQueue] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchQueues();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchQueues = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/queues');
      if (res.ok) {
        const data = await res.json();
        setQueues(data);
      }
    } catch (e) {
      console.error('Erro ao buscar filas:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    const method = editingQueue?.id ? 'PUT' : 'POST';
    const endpoint = `/api/admin/queues${editingQueue?.id ? `/${editingQueue.id}` : ''}`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          active: formData.active ? 1 : 0
        })
      });
      
      const result = await res.json();
      if (res.ok && result.success) {
        setIsEditorOpen(false);
        setEditingQueue(null);
        setSuccessMessage(editingQueue ? 'Fila atualizada com sucesso!' : 'Fila criada com sucesso!');
        fetchQueues();
      } else {
        alert(result.error || 'Erro ao salvar fila.');
      }
    } catch (e) {
      alert('Erro de conexão ao salvar fila.');
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir esta fila? Esta ação não pode ser desfeita se a fila estiver em uso.')) return;
    try {
      const res = await fetch(`/api/admin/queues/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setSuccessMessage('Fila excluída com sucesso!');
          fetchQueues();
        } else {
          alert(result.error || 'Erro ao excluir fila.');
        }
      } else {
        const result = await res.json();
        alert(result.error || 'Erro ao excluir fila.');
      }
    } catch (e) {
      alert('Erro ao excluir fila.');
      console.error(e);
    }
  };

  const getRuleIcon = (rule: string) => {
    switch (rule) {
      case 'ia_first': return <Zap size={16} className="text-brand-accent" />;
      case 'round_robin': return <ArrowRightLeft size={16} className="text-blue-400" />;
      case 'manual': return <Mailbox size={16} className="text-white/40" />;
      default: return <Settings2 size={16} />;
    }
  };

  const getRuleLabel = (rule: string) => {
    switch (rule) {
      case 'ia_first': return 'IA-First (Assistente Virtual)';
      case 'round_robin': return 'Round-Robin (Distribuição)';
      case 'manual': return 'Manual (Aguardar)';
      default: return rule;
    }
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="text-green-400" size={20} />
          <p className="text-sm font-medium text-green-400">{successMessage}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">Filas & Roteamento</h3>
          <p className="text-xs text-white/40">Gerencie como os atendimentos são distribuídos entre IA e advogados.</p>
        </div>
        <button 
          onClick={() => { setEditingQueue(null); setIsEditorOpen(true); }}
          className="bg-brand-primary text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all"
        >
          <Plus size={16} /> Nova Fila
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" size={32} /></div>
        ) : queues.length > 0 ? queues.map((queue) => (
          <div key={queue.id} className="bg-brand-elevated p-6 rounded-3xl border border-white/5 hover:border-brand-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60">
                  <Layers size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white">{queue.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {getRuleIcon(queue.routing_rule)}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">{getRuleLabel(queue.routing_rule)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => { setEditingQueue(queue); setIsEditorOpen(true); }} className="p-2 hover:text-brand-primary transition-colors" title="Editar"><Edit size={16} /></button>
                <button onClick={() => handleDelete(queue.id)} className="p-2 hover:text-red-400 transition-colors" title="Excluir"><Trash2 size={16} /></button>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${queue.active ? 'bg-green-400' : 'bg-white/10'}`} />
                <span className={`text-[10px] font-bold uppercase ${queue.active ? 'text-green-400' : 'text-white/20'}`}>
                  {queue.active ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-white/20 font-mono">ID: #{queue.id}</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full bg-brand-elevated rounded-3xl border border-white/5 p-12 text-center text-white/20">
            <Layers size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-sm font-bold">Nenhuma fila configurada</p>
            <p className="text-xs mt-1">Crie sua primeira fila para começar a rotear atendimentos.</p>
          </div>
        )}
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm">
          <div className="bg-brand-elevated w-full max-w-md rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-white/10 flex items-center justify-between sticky top-0 bg-brand-elevated">
              <h2 className="text-2xl font-extrabold">{editingQueue ? 'Editar Fila' : 'Nova Fila'}</h2>
              <button onClick={() => { setIsEditorOpen(false); setEditingQueue(null); }} className="p-2 hover:bg-white/5 rounded-full transition-all"><X size={24} /></button>
            </div>
            <div className="p-8">
              <CustomForm 
                id="queue_form"
                schema={allConfigs['queue_form'].jsonSchema}
                formData={editingQueue || {}}
                onSubmit={handleSave}
                theme={contactFormTheme}
                labels={{ submit: editingQueue ? "Atualizar Fila" : "Criar Fila" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};