import { useEffect, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/app/stores/auth-store';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setSession, setLoading, setInitialized } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setInitialized(true);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setUser, setLoading, setInitialized]);

  return <>{children}</>;
}