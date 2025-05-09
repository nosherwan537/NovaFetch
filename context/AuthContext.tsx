// lib/context/AuthContext.tsx

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/DB/db';
import { syncUserFromOAuth } from '../lib/DB/profileSync';

type AuthContextType = {
  user: User | null;
  profile: any;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const getSessionAndProfile = async () => {
      setLoading(true);

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await handleUserProfile(session.user);
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    getSessionAndProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session: Session | null) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await handleUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        } else if (event === 'USER_UPDATED' && session?.user) {
          setUser(session.user);
          await handleUserProfile(session.user);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleUserProfile = async (user: User) => {
    try {
      await syncUserFromOAuth(user);
      const { data: profile, error } = await supabase
        .from('user')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(profile);
    } catch (error) {
      console.error('Failed to sync or load profile:', error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
