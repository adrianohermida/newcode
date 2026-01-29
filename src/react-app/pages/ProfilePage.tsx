

/**
 * @description Página de Perfil do Usuário para Hermida Maia Advocacia.
 *             Permite que advogados e membros da equipe editem seus dados profissionais.
 *             Utiliza CustomForm para persistência no banco de dados D1.
 */

import React, { useState, useEffect } from 'react';
import { useSupabaseSession } from '../hooks/useSupabaseSession';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { CustomForm } from '../components/CustomForm';
import { contactFormTheme } from '../components/CustomForm/theme';
import allConfigs from '../../shared/form-configs.json';
import { User, Shield, Phone, Briefcase, Loader2, CheckCircle2 } from 'lucide-react';

  const { apiFetch } = require('../controllers/ApiController');
  const session = useSupabaseSession();
  const user = session?.user;
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (session === null) {
      navigate('/login');
    }
    if (session && user) {
      apiFetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session, user, navigate]);

  const handleSave = async (formData: any) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await apiFetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao atualizar perfil.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setSaving(false);
    }
  };

  if (session === undefined || loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <Loader2 className="text-brand-primary animate-spin" size={48} />
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold">Meu Perfil Profissional</h1>
          <p className="text-white/50 mt-1">Mantenha seus dados atualizados para o sistema do escritório.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-brand-elevated p-8 rounded-3xl border border-white/5 text-center">
              <div className="w-24 h-24 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="text-brand-primary" size={48} />
              </div>
              <h2 className="font-bold text-lg">{profile?.user_email}</h2>
              <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Advogado / Equipe</p>
            </div>

            <div className="bg-brand-elevated p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Shield className="text-brand-primary" size={18} />
                <span className="text-white/60">Acesso Verificado</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="text-brand-primary" size={18} />
                <span className="text-white/60">{profile?.area_atuacao || 'Área não definida'}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-brand-elevated p-8 rounded-3xl border border-white/5 shadow-xl">
              {message && (
                <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {message.type === 'success' ? <CheckCircle2 size={20} /> : <Shield size={20} />}
                  <span className="text-sm font-bold">{message.text}</span>
                </div>
              )}

              <CustomForm 
                id="profile_form"
                schema={allConfigs.profile_form.jsonSchema}
                formData={profile || {}}
                onSubmit={handleSave}
                theme={contactFormTheme}
                labels={{ submit: saving ? 'Salvando...' : 'Salvar Alterações' }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


