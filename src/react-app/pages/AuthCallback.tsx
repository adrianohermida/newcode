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

  useEffect(() => {
    // ainda carregando sessão
    if (session === undefined) return;

    // não logado
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    // logado → decide rota
    if (isAdmin) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/portal', { replace: true });
    }
  }, [session, isAdmin, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-brand-primary" size={40} />
    </div>
  );
}
