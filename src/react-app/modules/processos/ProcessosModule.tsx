type TicketDetailInlineProps = {
  ticket: any;
  onBack: () => void;
};

export const TicketDetailInline = ({ ticket, onBack }: TicketDetailInlineProps) => {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let aborted = false;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tickets/${ticket.id}/messages`);
        const json = await res.json();

        if (!aborted) {
          setMessages(
            Array.isArray(json)
              ? json
              : Array.isArray(json?.data)
              ? json.data
              : []
          );
        }
      } catch (err) {
        console.error(err);
        if (!aborted) setMessages([]);
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    loadMessages();
    return () => {
      aborted = true;
    };
  }, [ticket.id]);

  const handleReply = async () => {
    if (!message.trim()) return;

    await fetch(`/api/tickets/${ticket.id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    setMessage('');

    const res = await fetch(`/api/tickets/${ticket.id}/messages`);
    const json = await res.json();

    setMessages(Array.isArray(json) ? json : []);
  };

  return (
    <div className="space-y-6 animate-fade-in">

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-brand-primary font-bold"
      >
        ← Voltar para tickets
      </button>

      <div className="bg-brand-elevated p-6 rounded-3xl border border-white/5">
        <h2 className="text-xl font-extrabold mb-2">
          Ticket #{ticket.id}
        </h2>

        <p className="text-xs text-white/40 mb-6">
          {ticket.subject} • {ticket.client_email}
        </p>

        <div className="space-y-4 max-h-[420px] overflow-y-auto">
          {loading && (
            <div className="text-white/40 text-sm">
              Carregando mensagens...
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="text-white/40 text-sm">
              Nenhuma mensagem registrada.
            </div>
          )}

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`p-4 rounded-xl border ${
                msg.is_admin
                  ? 'bg-brand-primary/10 border-brand-primary/30'
                  : 'bg-white/5 border-white/5'
              }`}
            >
              <p className="text-xs text-white/40 mb-1">
                {msg.is_admin ? 'Admin' : msg.sender_email} •{' '}
                {new Date(msg.created_at).toLocaleString('pt-BR')}
              </p>

              <p className="text-sm">{msg.message}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Responder ao ticket..."
            className="w-full bg-brand-dark border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-brand-primary"
          />

          <button
            onClick={handleReply}
            className="bg-brand-primary px-4 py-2 rounded-xl font-bold"
          >
            Enviar resposta
          </button>
        </div>
      </div>
    </div>
  );
};
