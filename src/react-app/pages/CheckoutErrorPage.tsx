

/**
 * @description Página de erro para falhas no processo de checkout.
 *             Exibe a mensagem de erro retornada pela API e oferece retorno ao shopping.
 */

import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, MessageCircle } from 'lucide-react';

export const CheckoutErrorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message') || 'Ocorreu um erro inesperado ao processar seu pagamento.';

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-brand-elevated p-8 rounded-[2.5rem] border border-white/10 shadow-2xl text-center">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="text-red-500" size={40} />
        </div>
        
        <h1 className="text-2xl font-extrabold text-white mb-4">Ops! Algo deu errado</h1>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8">
          <p className="text-white/70 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            to="/"
            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            Tentar Novamente
          </Link>
          
          <a 
            href="https://wa.me/5551996032004"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle size={18} />
            Falar com Suporte
          </a>
        </div>

        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm font-bold mt-8 transition-colors">
          <ArrowLeft size={16} />
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
};
  
