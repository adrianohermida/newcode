
/**
 * @description Página de Contato para Hermida Maia Advocacia.
 *             Apresenta informações de contato e um formulário dinâmico integrado ao HeyBoss.
 *             Utiliza o componente CustomForm para garantir consistência e facilidade de manutenção.
 *             Armazena submissões de formulário no banco de dados D1 com deduplicação por email.
 */

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CustomForm } from '../components/CustomForm';
import { contactFormTheme } from '../components/CustomForm/theme';
import allConfigs from '../../shared/form-configs.json';

export const ContactPage = () => {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: 'contact_form', ...formData }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus({
          type: 'success',
          message: 'Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.'
        });
      } else {
        setStatus({
          type: 'error',
          message: result.message || 'Ocorreu um erro ao enviar sua mensagem. Tente novamente.'
        });
      }
    } catch (error) {
      console.error('Erro na submissão:', error);
      setStatus({
        type: 'error',
        message: 'Erro de conexão. Verifique sua internet e tente novamente.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-primary selection:text-white">
      {/* Header Simples */}
      <header className="fixed top-0 w-full z-50 bg-brand-dark/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-brand-primary rounded-xl overflow-hidden w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img src="https://heyboss.heeyo.ai/user-assets/logo_lzI6JHzO.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-white font-extrabold text-lg hidden sm:block">Hermida Maia</span>
            </Link>
            
            <Link 
              to="/" 
              className="text-white/60 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors"
            >
              <ArrowLeft size={18} />
              Voltar para Início
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">Fale com um Advogado Especialista em Dívidas</h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Estamos prontos para ajudar você a recuperar sua paz financeira através da Lei do Superendividamento. Escolha o canal de sua preferência.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {/* Cards de Contato */}
            {[
              { 
                icon: Phone, 
                title: "Telefone & WhatsApp", 
                value: "(51) 99603-2004", 
                link: "https://wa.me/5551996032004",
                color: "text-brand-primary",
                bg: "bg-brand-primary/10"
              },
              { 
                icon: Mail, 
                title: "E-mail", 
                value: "contato@hermidamaia.adv.br", 
                link: "mailto:contato@hermidamaia.adv.br",
                color: "text-brand-accent",
                bg: "bg-brand-accent/10"
              },
              { 
                icon: MapPin, 
                title: "Endereço", 
                value: "Atendimento Nacional Online", 
                link: "#",
                color: "text-blue-400",
                bg: "bg-blue-400/10"
              }
            ].map((item, idx) => (
              <a 
                key={idx} 
                href={item.link}
                target={item.link.startsWith('http') ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="bg-brand-elevated p-8 rounded-3xl border border-white/5 hover:border-brand-primary/30 transition-all group text-center"
              >
                <div className={`${item.bg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className={item.color} size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/50 font-medium">{item.value}</p>
              </a>
            ))}
          </div>

          {/* Seção do Formulário */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-brand-elevated rounded-[2.5rem] p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary" />
              
              <div className="mb-10">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Envie uma Mensagem</h2>
                <p className="text-white/50">Preencha os campos abaixo e nossa equipe jurídica analisará seu caso com prioridade.</p>
              </div>

              {status.type ? (
                <div className={`p-6 rounded-2xl flex items-start gap-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500 ${
                  status.type === 'success' ? 'bg-brand-primary/10 border border-brand-primary/20' : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  {status.type === 'success' ? (
                    <CheckCircle2 className="text-brand-primary shrink-0" size={24} />
                  ) : (
                    <AlertCircle className="text-red-400 shrink-0" size={24} />
                  )}
                  <div>
                    <p className={`font-bold ${status.type === 'success' ? 'text-brand-primary' : 'text-red-400'}`}>
                      {status.type === 'success' ? 'Sucesso!' : 'Ops!'}
                    </p>
                    <p className="text-white/70 text-sm mt-1">{status.message}</p>
                    {status.type === 'success' && (
                      <button 
                        onClick={() => setStatus({ type: null, message: '' })}
                        className="mt-4 text-brand-primary text-sm font-bold hover:underline"
                      >
                        Enviar outra mensagem
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <CustomForm
                id="contact_form"
                schema={allConfigs.contact_form.jsonSchema}
                onSubmit={handleSubmit}
                theme={contactFormTheme}
                labels={{
                  submit: "Enviar Mensagem",
                  submitting: "Enviando..."
                }}
              />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Simples */}
      <footer className="bg-brand-dark py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/20 text-xs">
            © 2024 Hermida Maia Advocacia. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
