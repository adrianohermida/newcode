export default AuthCallback;
/**
 * AuthCallback.tsx - OAuth Authentication Callback Page
 *
 * This component handles the OAuth authentication callback flow after a user
 * completes authentication with an external provider (e.g., Google, GitHub).
 * It automatically processes the OAuth code and notifies the parent window
 * about the authentication result.
 *
 * Key Features:
 * - Automatic OAuth code processing
 * - Parent window notification for popup-based auth flows
 * - Loading state with user-friendly UI
 * - Responsive design with modern styling
 *
 * Usage:
 * This component is typically used as a route handler for OAuth callbacks:
 * ```tsx
 * <Route path="/auth/callback" element={<AuthCallback />} />
 * ```
 *
 * Dependencies:
 * - Requires @hey-boss/users-service/react for authentication logic
 * - Uses lucide-react for loading icons
 * - Automatically handles OAuth code exchange and session creation
 *
 * Integration Notes:
 * - This component should be placed at the OAuth callback URL
 * - The parent window will receive the authentication result
 * - No manual user interaction required - fully automated flow
 */

import React, { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";



  const navigate = useNavigate();
  const [techInfo, setTechInfo] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper para coletar informações técnicas ampliadas
  function collectTechInfo(extra: any = {}) {
    let supabaseEnv = {};
    try {
      supabaseEnv = {
        VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      };
    } catch {}
    let localStorageKeys = [];
    let sessionStorageKeys = [];
    try { localStorageKeys = Object.keys(window.localStorage); } catch {}
    try { sessionStorageKeys = Object.keys(window.sessionStorage); } catch {}
    // Detect assets carregados
    const loadedAssets = Array.from(document.querySelectorAll('link[rel~="icon"],link[rel~="apple-touch-icon"],link[rel~="manifest"],script[src],link[rel~="stylesheet"]')).map(el => {
      if (el instanceof HTMLLinkElement) return { tag: 'link', rel: el.rel, href: el.href };
      if (el instanceof HTMLScriptElement) return { tag: 'script', src: el.src };
      return { tag: el.tagName.toLowerCase() };
    });
    // Detect rotas navegáveis
    const navLinks = Array.from(document.querySelectorAll('a')).map(a => a.href);
    // Detect ambiente
    const isDev = !('update_vite_data' in window);
    return {
      hash: window.location.hash,
      pathname: window.location.pathname,
      search: window.location.search,
      fullUrl: window.location.href,
      supabaseEnv,
      loadedAssets,
      navLinks,
      localStorageKeys,
      sessionStorageKeys,
      userAgent: navigator.userAgent,
      isDev,
      ...extra
    };
  }

  useEffect(() => {
    // Workaround: extrai ?code=... do hash e reescreve para query string se necessário
    if (window.location.hash && window.location.hash.includes('code=')) {
      const hash = window.location.hash.substring(1); // remove '#'
      const [route, params] = hash.split('?');
      if (params) {
        window.location.replace(window.location.pathname + '?' + params);
        return;
      }
    }
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    // Se não houver code nem error na URL, exibe dados técnicos
    if (!code && !error) {
      setTechInfo(collectTechInfo({
        message: 'Nenhum parâmetro code ou error encontrado na URL.'
      }));
      setErrorMsg('Nenhum parâmetro code ou error encontrado na URL.');
      return;
    }
    // Se houver error na URL, exibe mensagem de erro técnica
    if (error) {
      setTechInfo(collectTechInfo({
        error: decodeURIComponent(error),
        message: 'Erro retornado pelo provedor OAuth.'
      }));
      setErrorMsg('Erro ao autenticar: ' + decodeURIComponent(error));
      return;
    }
    // Só processa Supabase se houver code
    if (code) {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          navigate("/account", { replace: true });
        }
      });
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          navigate("/account", { replace: true });
        }
      });
      return () => {
        listener?.subscription.unsubscribe();
      };
    }
  }, [navigate]);

  if (errorMsg || techInfo) {
    return (
      <div className="w-screen h-screen flex justify-center items-center px-4 bg-slate-50">
        <div className="max-w-lg w-full space-y-8 p-12 bg-white rounded-xl shadow-lg relative overflow-hidden">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Erro no Callback de Autenticação</h2>
            {errorMsg && <div className="mb-4 text-red-700">{errorMsg}</div>}
            <details className="bg-slate-100 text-left p-3 rounded text-xs select-all" open>
              <summary className="cursor-pointer font-semibold mb-2">Dados técnicos da URL</summary>
              <pre>{JSON.stringify(techInfo, null, 2)}</pre>
            </details>
            <button className="mt-4 px-4 py-2 bg-slate-200 rounded hover:bg-slate-300" onClick={() => window.location.href = '/login'}>Voltar ao login</button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-screen h-screen flex justify-center items-center px-4 bg-slate-50">
      <div className="max-w-lg w-full space-y-8 p-12 bg-white rounded-xl shadow-lg relative overflow-hidden">
        <div className="absolute top-4 left-4">
          <button className="flex items-center space-x-1 text-slate-500 hover:text-slate-700 transition-colors"></button>
        </div>
        <div className="text-center">
          <div className="animate-spin mx-auto mb-4">
            <LoaderCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Logging in</h2>
          <div className="text-slate-500 mt-2">
            Please wait, we are verifying your identity...
          </div>
        </div>
      </div>
    </div>
  );
}
