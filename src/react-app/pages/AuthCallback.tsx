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

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseSession } from '../hooks/useSupabaseSession';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const session = useSupabaseSession();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  // Fragment parsing fallback
  useEffect(() => {
    console.log('[AuthCallback] session:', session);
    // Se já temos sessão, segue fluxo normal
    if (session !== undefined) {
      if (!session) {
        console.log('[AuthCallback] Sem sessão, redirecionando para /login');
        navigate('/login', { replace: true });
        return;
      }
      if (isAdmin) {
        console.log('[AuthCallback] Sessão admin, redirecionando para /dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        console.log('[AuthCallback] Sessão cliente, redirecionando para /portal');
        navigate('/portal', { replace: true });
      }
      return;
    }

    // Se não há sessão, tenta parsing do fragmento
    const fragment = window.location.hash;
    console.log('[AuthCallback] Fragmento da URL:', fragment);
    if (fragment && fragment.includes('access_token')) {
      const params = new URLSearchParams(fragment.replace('#', ''));
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const expires_in = params.get('expires_in');
      const token_type = params.get('token_type');
      console.log('[AuthCallback] access_token:', access_token);
      console.log('[AuthCallback] refresh_token:', refresh_token);
      console.log('[AuthCallback] expires_in:', expires_in);
      console.log('[AuthCallback] token_type:', token_type);
      if (access_token && refresh_token && expires_in && token_type) {
        // Tenta salvar manualmente no Supabase
        import('../utils/supabaseClient').then(({ supabase }) => {
          supabase.auth.setSession({
            access_token,
            refresh_token,
          }).then(() => {
            console.log('[AuthCallback] Sessão criada manualmente, limpando fragmento e recarregando.');
            window.location.hash = '';
            window.location.reload();
          }).catch((err) => {
            console.error('[AuthCallback] Erro ao criar sessão manual:', err);
          });
        });
      } else {
        console.warn('[AuthCallback] Fragmento não contém todos os tokens necessários.');
      }
    } else {
      console.warn('[AuthCallback] Nenhum access_token encontrado no fragmento.');
    }
  }, [session, isAdmin, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-brand-primary" size={40} />
    </div>
  );
}
