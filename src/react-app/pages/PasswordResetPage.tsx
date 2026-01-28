import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function PasswordResetPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMessage('Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.');
  };

  return (
    <form className="max-w-sm mx-auto mt-32 space-y-4" onSubmit={handleReset}>
      <h1 className="text-2xl font-extrabold text-center">Recuperar senha</h1>
      <input
        type="email"
        placeholder="E-mail cadastrado"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-white/10"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-primary py-3 rounded-xl font-bold"
      >
        {loading ? 'Enviando…' : 'Enviar link de recuperação'}
      </button>
      {message && <p className="text-green-400 text-sm text-center">{message}</p>}
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </form>
  );
}
