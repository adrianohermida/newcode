import React from "react";

export default function FallbackPage({ message = "Não foi possível conectar ao serviço. Tente novamente mais tarde.", action }: { message?: string, action?: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-dark text-white px-4">
      <div className="max-w-md w-full bg-brand-elevated p-8 rounded-2xl border border-white/10 shadow-2xl text-center">
        <h1 className="text-2xl font-bold mb-4">Erro de Conexão</h1>
        <p className="mb-6 text-white/70">{message}</p>
        {action}
        <button
          className="mt-4 px-6 py-2 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/90 transition-all"
          onClick={() => window.location.reload()}
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
}
