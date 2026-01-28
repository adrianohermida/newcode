import React from "react";
import { createClient } from "@supabase/supabase-js";

// Instância local, sem dependência de contexto global
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
// Não usar useNavigate para evitar dependência de contexto de rotas

export default function PrivateTest() {
  React.useEffect(() => {
    // Log para depuração de isolamento
    console.log('[PrivateTest] MONTADO');
  }, []);
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (data?.user) setUser(data.user);
      else window.location.hash = '#/auth-test';
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Verificando autenticação...</div>;

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Página Privada de Teste</h2>
      <p>Usuário autenticado:</p>
      <pre style={{ background: "#eee", padding: 8 }}>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={async () => { await supabase.auth.signOut(); window.location.hash = '#/auth-test'; }}>
        Logout
      </button>
    </div>
  );
}
