import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import type { Session } from '@supabase/supabase-js';

export function useSupabaseSession(): Session | null | undefined {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    let isMounted = true;
    // Começa como undefined (carregando)
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (isMounted) setSession(session);
      })
      .catch(() => {
        if (isMounted) setSession(null);
      });
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
