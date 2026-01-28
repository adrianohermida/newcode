import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useSupabaseSession } from '../hooks/useSupabaseSession';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const session = useSupabaseSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && session.user) {
      navigate('/'); // Redireciona para home se já autenticado
    }
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    // O redirecionamento será feito pelo useEffect
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark">
      <form
        onSubmit={handleLogin}
        className="bg-brand-elevated p-8 rounded-2xl shadow-xl w-full max-w-sm flex flex-col gap-6 border border-white/10"
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-2">Entrar na Plataforma</h2>
        <input
          className="px-4 py-3 rounded-lg bg-brand-dark text-white border border-white/10 focus:border-brand-primary outline-none"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
        <input
          className="px-4 py-3 rounded-lg bg-brand-dark text-white border border-white/10 focus:border-brand-primary outline-none"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Senha"
          required
        />
        <button
          type="submit"
          className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        {error && <div className="text-red-400 text-center text-sm">{error}</div>}
      </form>
    </div>
  );
}

