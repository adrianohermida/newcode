type DocumentItem = {
  id: number;
  title: string;
  category: string;
  owner_type: 'cliente' | 'escritorio';
  owner_name?: string;
  created_at: string;
  file_url: string;
};

type DocumentsModuleProps = {
  data: DocumentItem[];
};

export const DocumentsModule = ({ data = [] }: DocumentsModuleProps) => {
  return (
    <div className="space-y-6 animate-fade-in">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold">Documentos</h2>

        <button className="bg-brand-primary px-4 py-2 rounded-xl text-sm font-bold">
          Enviar Documento
        </button>
      </div>

      <div className="bg-brand-elevated rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/40">
            <tr>
              <th className="p-4">Título</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Origem</th>
              <th className="p-4">Data</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {data.map(doc => (
              <tr key={doc.id} className="hover:bg-white/5">
                <td className="p-4 font-bold">{doc.title}</td>
                <td className="p-4 text-xs">{doc.category}</td>
                <td className="p-4 text-xs uppercase">
                  {doc.owner_type === 'cliente'
                    ? `Cliente (${doc.owner_name})`
                    : 'Escritório'}
                </td>
                <td className="p-4 text-xs">
                  {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4 text-right">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    className="text-brand-primary font-bold"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="p-10 text-center text-white/30">
            Nenhum documento disponível.
          </div>
        )}
      </div>
    </div>
  );
};
