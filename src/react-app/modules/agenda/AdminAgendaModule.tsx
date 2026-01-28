export const AdminAgendaModule = ({
  data,
  loading,
  onRefresh,
}: {
  data: any[];
  loading: boolean;
  onRefresh: () => void;
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-brand-elevated p-16 rounded-3xl text-center text-white/40">
        Nenhum agendamento encontrado.
      </div>
    );
  }

  return (
    <div className="grid gap-4 animate-fade-in">
      {data.map(app => (
        <div
          key={app.id}
          className="bg-brand-elevated p-6 rounded-2xl border border-white/5"
        >
          <p className="font-bold">{app.form_data.name}</p>
          <p className="text-xs text-white/40">
            {app.form_data.email}
          </p>
        </div>
      ))}
    </div>
  );
};
