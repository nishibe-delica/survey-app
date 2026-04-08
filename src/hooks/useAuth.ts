import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { AuthUser } from '../types/survey';

const ALLOWED_DOMAIN = import.meta.env.VITE_ALLOWED_DOMAIN as string || 'delicasuito.com';

interface UseAuthReturn {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

function sessionToAuthUser(session: Session | null): AuthUser | null {
  if (!session?.user) return null;
  const { user } = session;
  return {
    id: user.id,
    email: user.email ?? '',
    name: user.user_metadata?.full_name ?? user.email ?? '',
    avatarUrl: user.user_metadata?.avatar_url ?? null,
  };
}

export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 初回: 現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // セッション変更を監視（ログイン・ログアウト）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setIsLoading(false);

        // ドメインチェック（@delicasuito.com 以外は強制ログアウト）
        if (session?.user?.email) {
          const domain = session.user.email.split('@')[1];
          if (domain !== ALLOWED_DOMAIN) {
            setError(`このアプリは @${ALLOWED_DOMAIN} のアカウントのみ利用できます`);
            supabase.auth.signOut();
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
        queryParams: {
          hd: ALLOWED_DOMAIN, // Googleのドメイン制限ヒント
          prompt: 'select_account',
        },
      },
    });
    if (error) setError(error.message);
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
  };

  return {
    user: sessionToAuthUser(session),
    session,
    isLoading,
    signInWithGoogle,
    signOut,
    error,
  };
}
