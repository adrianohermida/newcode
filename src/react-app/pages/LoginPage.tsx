/**
 * @description Página de Login para Hermida Maia Advocacia.
 *             Oferece opções de login via Google e E-mail (OTP).
 *             Integrada ao @hey-boss/users-service para gestão de identidade.
 *             Redireciona para o painel administrativo ou portal após o login.
 */

import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Loader2, Chrome } from "lucide-react";
import { FreshchatWidget } from "../components/FreshchatWidget";
import { useAuthContext } from "../hooks/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Checa sessão do Supabase apenas uma vez e escuta mudanças de autenticação
  useEffect(() => {
    let ignore = false;
    let unsub: any = null;
    supabase.auth.getSession().then(({ data }) => {
      if (!ignore && data.session && data.session.user) {
        setUser(data.session.user);
        navigate("/account", { replace: true });
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!ignore && session?.user) {
        setUser(session.user);
        navigate("/account", { replace: true });
      }
    });
    unsub = listener?.subscription;
    return () => {
      ignore = true;
      unsub?.unsubscribe();
    };
  }, [navigate]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
      if (!error) {
        setStep("otp");
      } else {
        setError(error.message || "Erro ao enviar código.");
      }
    } catch (err) {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error, data } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
      if (!error) {
        setUser(data.user);
        navigate("/account", { replace: true });
      } else {
        setError(error.message || "Código inválido.");
      }
    } catch (err) {
      setError("Erro de verificação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 py-12">
      {/* Widget Freshchat para login */}
      <FreshchatWidget />
      <div className="max-w-md w-full space-y-8 bg-brand-elevated p-8 sm:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary" />
        
        <div className="text-center">
          <div className="bg-brand-primary rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-primary/20">
            <img src="https://heyboss.heeyo.ai/user-assets/logo_lzI6JHzO.png" alt="Logo" className="w-10 h-10 object-cover" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Acesse sua Área</h2>
          <p className="mt-2 text-white/50">Acesso restrito a clientes cadastrados via Link Mágico</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}
        {apiStatus && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-3 rounded-xl text-sm text-center">
            {apiStatus}
          </div>
        )}
        {/* Erros de blog/user removidos pois useApi não é mais usado aqui */}
        <div className="flex justify-center py-2">
          <button
            onClick={handleTestConnection}
            className="bg-brand-primary text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-brand-primary/90 transition-all"
          >
            Testar conexão Login
          </button>
          {testStatus && (
            <span className="ml-4 text-white/80 text-sm">{testStatus}</span>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-brand-dark px-6 py-4 rounded-xl font-bold transition-all hover:bg-white/90 active:scale-95 disabled:opacity-50"
          >
            <Chrome size={20} />
            Entrar com Google
          </button>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-white/20 text-xs font-bold uppercase tracking-widest">Ou via E-mail</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {step === "email" ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-brand-primary outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Enviar Código de Acesso"}
                <ArrowRight size={20} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                <input
                  type="text"
                  required
                  placeholder="Digite o código de 6 dígitos"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-brand-primary outline-none transition-all text-center tracking-[0.5em] font-mono text-xl"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Verificar e Entrar"}
              </button>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-white/40 text-sm hover:text-white transition-colors"
              >
                Alterar e-mail
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[10px] text-white/20">
          Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </div>
  );
}

