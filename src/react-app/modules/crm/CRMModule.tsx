type CRMModuleProps = {
  data: any[];
};

export const CRMModule = ({ data }: CRMModuleProps) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-brand-elevated p-10 rounded-3xl border border-white/5 text-center text-white/40">
        Nenhum lead encontrado.
      </div>
    );
  }

  return (
    <div className="bg-brand-elevated rounded-3xl border border-white/5 overflow-hidden animate-fade-in">
      <table className="w-full">
        <thead className="bg-white/5 text-[10px] uppercase text-white/40">
          <tr>
            <th className="p-4">Lead</th>
            <th className="p-4">Contato</th>
            <th className="p-4">Origem</th>
            <th className="p-4">Data</th>
            <th className="p-4 text-right">Ações</th>
          </tr>
        </thead>

        <tbody>
          {data.map((lead, i) => (
            <tr key={i} className="border-t border-white/5">
              <td className="p-4 font-bold">
                {lead.first_name} {lead.last_name}
              </td>
              <td className="p-4 text-xs">{lead.email}</td>
              <td className="p-4 text-xs">{lead.source}</td>
              <td className="p-4 text-xs">
                {lead.created_at
                  ? new Date(lead.created_at).toLocaleDateString('pt-BR')
                  : '—'}
              </td>
              <td className="p-4 text-right text-white/40">
                ⋮
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
