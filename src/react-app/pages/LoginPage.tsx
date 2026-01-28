import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    // Redirecione ou atualize o estado conforme necessário
  };

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 320, margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Senha" required />
      <button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}

