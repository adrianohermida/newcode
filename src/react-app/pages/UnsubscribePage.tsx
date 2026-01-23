
/**
 * @description This file defines the UnsubscribePage component.
 *             It allows users to remove their email from the newsletter mailing list.
 *             It handles the API call to the worker and displays success or error messages.
 *             Important variables: email (from query params), status (loading/success/error).
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MailX, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Header } from '../components/Header';

export const UnsubscribePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const email = searchParams.get('email');

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus('error');
      setMessage('E-mail não fornecido.');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage(result.message || 'Você foi removido da nossa lista com sucesso.');
      } else {
        setStatus('error');
        setMessage(result.error || 'Ocorreu um erro ao processar sua solicitação.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erro de conexão. Tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    if (email) {
      handleUnsubscribe();
    }
  }, [email]);

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full bg-brand-elevated p-8 rounded-[2rem] border border-white/10 shadow-2xl text-center">
          {status === 'loading' ? (
            <div className="space-y-6 py-10">
              <Loader2 className="w-16 h-16 text-brand-primary animate-spin mx-auto" />
              <h2 className="text-2xl font-bold text-white">Processando...</h2>
              <p className="text-white/60">Estamos removendo seu e-mail da nossa lista.</p>
            </div>
          ) : status === 'success' ? (
            <div className="space-y-6 py-6">
              <div className="w-20 h-20 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="text-brand-primary" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white">Inscrição Cancelada</h2>
              <p className="text-white/60 leading-relaxed">{message}</p>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-brand-primary font-bold hover:underline"
              >
                <ArrowLeft size={18} />
                Voltar para o Início
              </Link>
            </div>
          ) : status === 'error' ? (
            <div className="space-y-6 py-6">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="text-red-500" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white">Ops! Algo deu errado</h2>
              <p className="text-white/60 leading-relaxed">{message}</p>
              {!email && (
                <div className="pt-4">
                  <input 
                    type="email" 
                    placeholder="Digite seu e-mail" 
                    className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-primary mb-4"
                    onChange={(e) => {
                      const val = e.target.value;
                      // This is just for manual entry if link is broken
                    }}
                  />
                </div>
              )}
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-brand-primary font-bold hover:underline"
              >
                <ArrowLeft size={18} />
                Voltar para o Início
              </Link>
            </div>
          ) : (
            <div className="space-y-6 py-6">
              <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto">
                <MailX className="text-brand-primary" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white">Cancelar Inscrição</h2>
              <p className="text-white/60 leading-relaxed">
                Deseja realmente parar de receber nossas atualizações jurídicas?
              </p>
              <button 
                onClick={handleUnsubscribe}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-4 rounded-xl font-bold transition-all"
              >
                Confirmar Cancelamento
              </button>
              <Link 
                to="/" 
                className="block text-white/40 text-sm hover:text-white transition-colors"
              >
                Mudei de ideia, quero continuar inscrito
              </Link>
            </div>
          )}
        </div>
      </main>
      <footer className="py-10 text-center border-t border-white/5">
        <p className="text-xs text-white/20">
          © 2024 Hermida Maia Advocacia. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};
