import React from "react";
import { useSupabaseSession } from '../hooks/useSupabaseSession';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export default function PrivateTest() {
  const session = useSupabaseSession();
  const user = session?.user;
  const navigate = useNavigate();

  React.useEffect(() => {
    if (session === null) {
      navigate('/login');
    }
  }, [session, navigate]);

  if (session === undefined) {
    return <div style={{ textAlign: "center", marginTop: 40 }}>Verificando autenticação...</div>;
  }

  if (!user) return null;

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Página Privada de Teste</h2>
      <p>Usuário autenticado:</p>
      <pre style={{ background: "#eee", padding: 8 }}>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }}>
        Logout
      </button>
    </div>
  );
}
