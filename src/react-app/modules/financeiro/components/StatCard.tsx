type StatCardProps = {
  label: string;
  value: number;
  color?: 'white' | 'green' | 'yellow';
};

export const StatCard = ({
  label,
  value,
  color = 'white',
}: StatCardProps) => {
  const colorMap = {
    white: 'text-white',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
  };

  return (
    <div className="bg-brand-elevated p-6 rounded-2xl border border-white/5 shadow-lg">
      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className={`text-2xl font-extrabold ${colorMap[color]}`}>
        R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
};
