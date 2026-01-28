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

import React, { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";


  const navigate = useNavigate();

  useEffect(() => {
    // Workaround: extrai ?code=... do hash e reescreve para query string se necessário
    if (window.location.hash && window.location.hash.includes('code=')) {
      const hash = window.location.hash.substring(1); // remove '#'
      const [route, params] = hash.split('?');
      if (params) {
        // reescreve para /auth/callback?code=...
        window.location.replace(window.location.pathname + '?' + params);
        return;
      }
    }
    // Se não houver code nem error na URL, redireciona para login ou mostra fallback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    if (!code && !error) {
      // Não lança erro, apenas redireciona para login
      navigate('/login', { replace: true });
      return;
    }
    // Supabase já processa o callback automaticamente
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
  }, [navigate]);

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
