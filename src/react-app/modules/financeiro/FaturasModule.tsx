type FaturaStatus = 'Pago' | 'Pendente' | 'Atrasado';

type Fatura = {
  id: number;
  fatura: string;
  cliente_email: string;
  valor_original: number;
  data_vencimento: string;
  status: FaturaStatus;
};

type FaturasModuleProps = {
  data: Fatura[];
};

export const FaturasModule = ({ data = [] }: FaturasModuleProps) => {
  const [statusFilter, setStatusFilter] = React.useState<'all' | FaturaStatus>('all');
  const [localSearch, setLocalSearch] = React.useState('');

  const filteredFaturas = React.useMemo(() => {
    return data.filter(f => {
      const statusMatch =
        statusFilter === 'all' || f.status === statusFilter;

      const searchMatch =
        !localSearch ||
        f.fatura?.toLowerCase().includes(localSearch.toLowerCase()) ||
        f.cliente_email?.toLowerCase().includes(localSearch.toLowerCase());

      return statusMatch && searchMatch;
    });
  }, [data, statusFilter, localSearch]);

  return (
    <div className="space-y-6 animate-fade-in">

      <div className="flex gap-2">
        {['all', 'Pendente', 'Pago', 'Atrasado'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${
              statusFilter === s
                ? 'bg-brand-primary text-white'
                : 'bg-white/5 text-white/40'
            }`}
          >
            {s === 'all' ? 'Todos' : s}
          </button>
        ))}
      </div>

      <div className="bg-brand-elevated rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase text-white/40">
            <tr>
              <th className="p-4">Fatura</th>
              <th className="p-4">Vencimento</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {filteredFaturas.map(f => (
              <tr key={f.id}>
                <td className="p-4 font-bold">{f.fatura}</td>
                <td className="p-4">
                  {new Date(f.data_vencimento).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4 font-bold">
                  R$ {Number(f.valor_original).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-xs uppercase">{f.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredFaturas.length === 0 && (
          <div className="p-10 text-center text-white/30">
            Nenhuma fatura encontrada.
          </div>
        )}
      </div>
    </div>
  );
};
