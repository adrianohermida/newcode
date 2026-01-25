/**
 * AuthProtect.tsx - Authentication Protection Wrapper Component
 *
 * This component provides authentication protection for routes and components
 * that require user authentication. It automatically redirects unauthenticated
 * users to the login page and shows a loading state while checking authentication.
 *
 * Key Features:
 * - Automatic authentication state checking
 * - Redirect to login page for unauthenticated users
 * - Loading state during authentication verification
 * - Seamless integration with React Router
 * - Modern gradient background design
 *
 * Usage:
 * Wrap protected components or routes with this component:
 * ```tsx
 * <AuthProtect>
 *   <ProtectedComponent />
 * </AuthProtect>
 * ```
 *
 * Or use with React Router:
 * ```tsx
 * <Route path="/dashboard" element={
 *   <AuthProtect>
 *     <Dashboard />
 *   </AuthProtect>
 * } />
 * ```
 *
 * Props:
 * - children: ReactNode - The components to protect
 *
 * Dependencies:
 * - Requires @hey-boss/users-service/react for authentication state
 * - Uses react-router-dom for navigation
 * - Uses lucide-react for loading icons
 *
 * Integration Notes:
 * - Automatically handles authentication state management
 * - Redirects to "/login" route for unauthenticated users
 * - Shows loading spinner while authentication is being verified
 * - Only renders children when user is authenticated
 */

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export const AuthProtect = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: any = null;
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });
    unsub = listener?.subscription;
    return () => {
      unsub?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin">
          <Loader2 className="w-10 h-10 text-blue-600" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
