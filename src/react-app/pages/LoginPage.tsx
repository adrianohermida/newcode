import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  // Login via link mágico (OTP)
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { createUser: false },
    });
    setLoading(false);
    if (error) {
      if (error.message && error.message.toLowerCase().includes('user not found')) {
        navigate('/user-not-found', { replace: true });
        return;
      }
      if (error.message && error.message.toLowerCase().includes('rate limit')) {
        setError('Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.');
        return;
      }
      setError(error.message);
      return;
    }
    // O Supabase vai atualizar a sessão
    // e o AuthCallback cuidará disso
  };

  return (
    <form className="max-w-sm mx-auto mt-32 space-y-4">
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
        onClick={handleLogin}
        className="w-full bg-brand-primary py-3 rounded-xl font-bold"
      >
        {loading ? 'Entrando…' : 'Entrar'}
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={handleMagicLink}
        className="w-full bg-brand-secondary py-3 rounded-xl font-bold mt-2"
      >
        {loading ? 'Enviando link mágico…' : 'Entrar com link mágico'}
      </button>

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}
      <div className="text-center mt-4">
        <button
          type="button"
          className="text-brand-primary underline text-sm"
          onClick={() => navigate('/password-reset')}
        >
          Esqueci minha senha
        </button>
      </div>
    </form>
  );
}

export default LoginPage;
