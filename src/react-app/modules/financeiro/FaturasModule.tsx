import { StatCard } from './StatCard';
type FaturaStatus = 'Pago' | 'Pendente' | 'Atrasado';

interface Fatura {
  id: number;
  fatura: string;
  cliente_email: string;
  valor_original: number;
  data_vencimento: string;
  status: FaturaStatus;
}

export const FaturasModule = ({ data = [] }: { data: Fatura[] }) => {
  const [statusFilter, setStatusFilter] =
    useState<'all' | FaturaStatus>('all');
  const [localSearch, setLocalSearch] = useState('');

  const filteredFaturas = useMemo(() => {
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

  const stats = useMemo(() => {
    const total = data.reduce((acc, f) => acc + f.valor_original, 0);
    const paid = data.filter(f => f.status === 'Pago')
      .reduce((a, f) => a + f.valor_original, 0);
    const pending = data.filter(f => f.status === 'Pendente')
      .reduce((a, f) => a + f.valor_original, 0);

    return { total, paid, pending };
  }, [data]);

  return (
    <div className="space-y-6 animate-fade-in">

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Emitido" value={stats.total} />
        <StatCard label="Total Recebido" value={stats.paid} color="green" />
        <StatCard label="Pendente" value={stats.pending} color="yellow" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-brand-elevated p-4 rounded-2xl border border-white/5">
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

        <input
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
          placeholder="Buscar fatura ou e-mail..."
          className="bg-brand-dark border border-white/10 rounded-xl px-4 py-2 text-xs"
        />
      </div>

      <div className="bg-brand-elevated rounded-3xl border border-white/5 overflow-hidden">
        {filteredFaturas.length === 0 ? (
          <div className="p-10 text-center text-white/30">
            Nenhuma fatura encontrada.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-white/5 text-[10px] uppercase text-white/40">
              <tr>
                <th className="p-4">Fatura</th>
                <th className="p-4">Vencimento</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaturas.map(f => (
                <tr key={f.id} className="border-t border-white/5">
                  <td className="p-4 font-bold">{f.fatura}</td>
                  <td className="p-4">
                    {new Date(f.data_vencimento).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4">
                    R$ {f.valor_original.toLocaleString('pt-BR')}
                  </td>
                  <td className="p-4">{f.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};