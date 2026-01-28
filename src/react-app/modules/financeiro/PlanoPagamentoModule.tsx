/**
 * 💳 PLANO DE PAGAMENTO – ADMIN MODULE
 */

import React from 'react';

type PlanoPagamento = {
  id: number;
  nome: string;
  parcelas: number;
  valor: number;
  status: string;
};

export const PlanoPagamentoModule = ({
  data = [],
}: {
  data: PlanoPagamento[];
}) => {
  return (
    <div className="space-y-6 animate-fade-in">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold">
          Planos de Pagamento
        </h2>

        <button className="bg-brand-primary px-4 py-2 rounded-xl text-sm font-bold">
          Novo Plano
        </button>
      </div>

      {data.length === 0 ? (
        <div className="bg-brand-elevated p-12 rounded-3xl border border-white/5 text-center text-white/40">
          Nenhum plano de pagamento cadastrado.
        </div>
      ) : (
        <div className="grid gap-4">
          {data.map(plan => (
            <div
              key={plan.id}
              className="bg-brand-elevated p-6 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">
                    {plan.nome}
                  </p>
                  <p className="text-xs text-white/40">
                    {plan.parcelas} parcelas • R$ {plan.valor.toLocaleString('pt-BR')}
                  </p>
                </div>

                <span className="text-xs uppercase px-3 py-1 rounded-full bg-white/5">
                  {plan.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
