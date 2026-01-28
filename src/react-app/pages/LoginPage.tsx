import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // 🔑 NUNCA redireciona aqui
    // O Supabase vai atualizar a sessão
    // e o AuthCallback cuidará disso
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-sm mx-auto mt-32 space-y-4"
    >
      <h1 className="text-2xl font-extrabold text-center">Entrar</h1>

      <input
        type="email"
        placeholder="E-mail"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-white/10"
      />

      <input
        type="password"
        placeholder="Senha"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-white/10"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-primary py-3 rounded-xl font-bold"
      >
        {loading ? 'Entrando…' : 'Entrar'}
      </button>

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}
    </form>
  );
}
