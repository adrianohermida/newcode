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
      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
      const data = await res.json();
      setBlog(data);
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
