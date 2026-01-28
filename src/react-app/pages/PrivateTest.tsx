import React from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function PrivateTest() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (data?.user) setUser(data.user);
      else navigate("/auth-test");
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Verificando autenticação...</div>;

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Página Privada de Teste</h2>
      <p>Usuário autenticado:</p>
      <pre style={{ background: "#eee", padding: 8 }}>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={async () => { await supabase.auth.signOut(); navigate("/auth-test"); }}>
        Logout
      </button>
    </div>
  );
}
