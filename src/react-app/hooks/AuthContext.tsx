import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';

interface AuthUser {
  id?: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  isAdmin?: boolean;
  [key: string]: any;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: async () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // novo estado para feedback visual

  // Tempo mínimo entre refreshes (ms)
  const REFRESH_INTERVAL = 15000;
  let lastRefresh = 0;
  const fetchUser = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefresh < REFRESH_INTERVAL) return; // evita refresh excessivo
    lastRefresh = now;
    setRefreshing(true);
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('users-me');
      if (error) {
        setUser(null);
        if (typeof window !== 'undefined') {
          window.__AUTH_ERROR__ = error.message || null;
        }
      } else {
        setUser(data && data.email ? data : null);
        if (typeof window !== 'undefined') {
          window.__AUTH_ERROR__ = null;
        }
      }
    } catch {}
    setUser(null);
    if (typeof window !== 'undefined') {
      window.__AUTH_ERROR__ = msg;
    }
  }
} catch (err: any) {
  setUser(null);
  if (typeof window !== 'undefined') {
    window.__AUTH_ERROR__ = err?.message || 'Erro de conexão ao buscar sessão.';
  }
} finally {
  setLoading(false);
  setRefreshing(false);
}
}, []);

  useEffect(() => {
    let unsub: any = null;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) fetchUser();
      else {
        setUser(null);
        setLoading(false);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchUser();
      else {
        setUser(null);
        setLoading(false);
      }
    });
    unsub = listener?.subscription;
    // Força refresh de sessão após login/callback
    if (window.location.pathname.includes('auth/callback') || window.location.search.includes('code=')) {
      setTimeout(() => fetchUser(), 1000);
    }
    // Adiciona polling para atualização periódica do contexto
    const interval = setInterval(() => {
      fetchUser();
    }, REFRESH_INTERVAL);
    return () => {
      unsub?.unsubscribe();
      clearInterval(interval);
    };
  }, [fetchUser]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
    if (typeof window !== 'undefined') {
      window.__AUTH_ERROR__ = null;
    }
  }, []);

  // Exibe erro de sessão/OAuth se houver
  const [authError, setAuthError] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.__AUTH_ERROR__) {
      setAuthError(window.__AUTH_ERROR__);
    }
  }, [user, loading]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser: fetchUser, logout }}>
      {authError && (
        <div style={{background:'#f87171',color:'#fff',padding:8,textAlign:'center',zIndex:9999}}>
          <b>Erro de sessão/OAuth:</b> {authError}
        </div>
      )}
      {refreshing && (
        <div style={{background:'#2563eb',color:'#fff',padding:8,textAlign:'center',zIndex:9999}}>
          <b>Atualizando contexto...</b> <span className="animate-spin">🔄</span>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};
