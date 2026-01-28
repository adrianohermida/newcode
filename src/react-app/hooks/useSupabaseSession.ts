import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export function useSupabaseSession() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    let isMounted = true;
    // try/catch para localStorage/sessionStorage
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (isMounted) setSession(session);
      });
    } catch {}
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setSession(session);
    });
    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);
  return session;
}
