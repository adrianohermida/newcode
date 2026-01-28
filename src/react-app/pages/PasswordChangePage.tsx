import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function PasswordChangePage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMessage('Senha alterada com sucesso!');
  };

  return (
    <form className="max-w-sm mx-auto mt-32 space-y-4" onSubmit={handleChange}>
      <h1 className="text-2xl font-extrabold text-center">Alterar senha</h1>
      <input
        type="password"
        placeholder="Nova senha"
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
        {loading ? 'Alterando…' : 'Alterar senha'}
      </button>
      {message && <p className="text-green-400 text-sm text-center">{message}</p>}
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </form>
  );
}
