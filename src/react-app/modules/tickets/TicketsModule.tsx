type TicketsModuleProps = {
  data: any[];
  onSelect: (ticket: any) => void;
};

export const TicketsModule = ({ data, onSelect }: TicketsModuleProps) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-brand-elevated p-10 rounded-3xl border border-white/5 text-center text-white/40">
        Nenhum ticket encontrado.
      </div>
    );
  }

  return (
    <div className="grid gap-4 animate-fade-in">
      {data.map(ticket => (
        <div
          key={ticket.id}
          onClick={() => onSelect(ticket)}
          className="bg-brand-elevated p-6 rounded-2xl border border-white/5 cursor-pointer hover:border-brand-primary/30 transition-all"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-white/40">
                Ticket #{ticket.id} • {ticket.client_email}
              </p>

              <h3 className="font-bold">{ticket.subject}</h3>

              <p className="text-xs text-white/50">
                Status: {ticket.status} • Prioridade: {ticket.priority}
              </p>
            </div>

            <span className="text-[10px] uppercase px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary">
              {ticket.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
