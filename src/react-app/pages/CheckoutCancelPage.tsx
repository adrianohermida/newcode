

/**
 * @description Página exibida quando o usuário cancela o processo de checkout.
 *             Oferece opções de retorno ao portal ou tentativa de novo pagamento.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, ShoppingBag } from 'lucide-react';

export const CheckoutCancelPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-brand-elevated p-8 rounded-[2.5rem] border border-white/10 shadow-2xl text-center">
        <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="text-yellow-500" size={40} />
        </div>
        
        <h1 className="text-2xl font-extrabold text-white mb-4">Pagamento Cancelado</h1>
        
        <p className="text-white/50 mb-8 leading-relaxed">
          Você cancelou o processo de pagamento. Seus itens ainda podem estar disponíveis para nova tentativa.
        </p>

        <div className="space-y-4">
          <Link 
            to="/account"
            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            <ShoppingBag size={18} />
            Voltar à Conta
          </Link>
          
          <Link 
            to="/"
            className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            Ir para a Home
          </Link>
        </div>

        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm font-bold mt-8 transition-colors">
          <ArrowLeft size={16} />
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
};
  
