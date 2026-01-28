import React from 'react';

type TicketDetailInlineProps = {
  ticket: any;
  onBack: () => void;
};

export const TicketDetailInline = ({ ticket, onBack }: TicketDetailInlineProps) => {
  if (!ticket) return null;
  return (
    <div className="bg-brand-elevated p-8 rounded-3xl border border-white/5 animate-fade-in">
      <button onClick={onBack} className="mb-4 text-brand-primary underline">Voltar</button>
      <h2 className="text-2xl font-bold mb-2">Ticket #{ticket.id}</h2>
      <p className="mb-1 text-white/70">Assunto: {ticket.subject}</p>
      <p className="mb-1 text-white/70">Cliente: {ticket.client_email}</p>
      <p className="mb-1 text-white/70">Status: {ticket.status}</p>
      <p className="mb-1 text-white/70">Prioridade: {ticket.priority}</p>
      {/* Adicione mais detalhes conforme necessário */}
    </div>
  );
};
