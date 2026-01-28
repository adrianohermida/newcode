import { useState, useCallback } from 'react';

export function useApi() {
  // Blog
  const [blog, setBlog] = useState<any[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState<string | null>(null);

  // User (autenticado)
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  // Fetch blog
  const fetchBlog = useCallback(async () => {
    setBlogLoading(true);
    setBlogError(null);
    try {
      const res = await fetch('/api/blog');
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok) {
        let message = `Erro ao acessar /api/blog: ${res.status}`;
        if (contentType.includes('application/json')) {
          try {
            const data = await res.json();
            if (data?.error) message += ` - ${data.error}`;
            if (data?.message) message += ` - ${data.message}`;
          } catch {}
        } else {
          message += ' (Resposta não-JSON recebida)';
        }
        throw new Error(message);
      }
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error('Resposta inesperada da API do blog.');
        }
        setBlog(data);
      } else {
        const text = await res.text();
        if (text.startsWith('<!DOCTYPE')) {
          throw new Error('Resposta HTML recebida em vez de JSON. Verifique se o backend está rodando corretamente.');
        }
        setBlog([]);
        setBlogError('Resposta inesperada da API do blog.');
        return;
      }
    } catch (err: any) {
      setBlogError(err.message || 'Erro ao carregar blog');
      setBlog([]);
    } finally {
      setBlogLoading(false);
    }
  }, []);

  // Fetch user (autenticado)
  const fetchUser = useCallback(async () => {
    setUserLoading(true);
    setUserError(null);
    try {
      const res = await fetch('/api/users/me');
      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
      const data = await res.json();
      setUser(data);
    } catch (err: any) {
      setUserError(err.message || 'Erro ao carregar usuário');
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  }, []);

  return {
    blog, blogLoading, blogError, fetchBlog,
    user, userLoading, userError, fetchUser,
  };
}
