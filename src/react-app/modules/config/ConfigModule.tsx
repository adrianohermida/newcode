export const ConfigModule = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] =
    useState<'stripe' | 'google'>('stripe');

  useEffect(() => {
    fetch('/api/admin/config/status')
      .then(r => r.json())
      .then(setStatus)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">

      <div className="flex gap-4 border-b border-white/10 pb-4">
        {['stripe', 'google'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-xl text-sm font-bold ${
              activeTab === tab
                ? 'bg-brand-primary text-white'
                : 'text-white/40'
            }`}
          >
            {tab === 'stripe' ? 'Pagamentos' : 'Agenda'}
          </button>
        ))}
      </div>

      {activeTab === 'stripe' && (
        <div className="bg-brand-elevated p-8 rounded-3xl">
          <h3 className="text-xl font-bold">Stripe</h3>
          <pre className="text-xs text-white/40 mt-4">
            {JSON.stringify(status?.stripe, null, 2)}
          </pre>
        </div>
      )}

      {activeTab === 'google' && (
        <div className="bg-brand-elevated p-8 rounded-3xl">
          <h3 className="text-xl font-bold">Google Calendar</h3>
          <pre className="text-xs text-white/40 mt-4">
            {JSON.stringify(status?.googleCalendar, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
