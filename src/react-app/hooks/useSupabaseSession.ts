import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import type { Session } from '@supabase/supabase-js';

export function useSupabaseSession(): Session | null {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    let isMounted = true;
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
