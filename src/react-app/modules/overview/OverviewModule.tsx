export const OverviewModule = () => {
  const stats = [
    { label: 'Leads Hoje', value: '12' },
    { label: 'Processos Ativos', value: '145' },
    { label: 'Faturamento do Mês', value: 'R$ 45.000' },
    { label: 'Tickets Abertos', value: '8' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-brand-elevated p-6 rounded-3xl border border-white/5"
        >
          <p className="text-xs text-white/40 uppercase mb-1">
            {stat.label}
          </p>
          <p className="text-3xl font-extrabold">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};
