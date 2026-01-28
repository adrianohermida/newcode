import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function AuthTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else setSession(data.session);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  React.useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Supabase Auth Test</h2>
      {session ? (
        <div>
          <p><b>Usuário autenticado!</b></p>
          <pre style={{ background: "#eee", padding: 8 }}>{JSON.stringify(session.user, null, 2)}</pre>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: "100%", marginBottom: 8 }}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: "100%", marginBottom: 8 }}
            />
          </div>
          <button type="submit" style={{ width: "100%" }}>Login</button>
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </form>
      )}
    </div>
  );
}
