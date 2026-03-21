import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, type UserRole } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  isLoggedIn: boolean;
  role: UserRole;
  userId: string | null;
  studentName: string;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; role?: UserRole }>;
  logout: () => Promise<void>;
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>('student');
  const [studentName, setStudentName] = useState('Aluno');
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(
    () => localStorage.getItem('zppia_onboarding') === 'true'
  );

  useEffect(() => {
    // Sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadProfile(session.user);
      else setLoading(false);
    });

    // Listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadProfile(session.user);
      else { setRole('student'); setStudentName('Aluno'); setLoading(false); localStorage.removeItem('zppia_role'); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(user: User) {
    const { data } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('id', user.id)
      .single();

    if (data) {
      setRole(data.role as UserRole);
      setStudentName(data.name);
      localStorage.setItem('zppia_role', data.role);
    }
    setLoading(false);
  }

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: 'Email ou senha incorretos.' };
    // Busca o perfil imediatamente para garantir role correto antes do redirect
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', data.user.id)
        .single();
      if (profile) {
        setRole(profile.role as UserRole);
        setStudentName(profile.name);
        localStorage.setItem('zppia_role', profile.role);
        return { ok: true, role: profile.role as UserRole };
      }
    }
    return { ok: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('zppia_role');
  };

  const handleSetOnboarding = (v: boolean) => {
    setHasSeenOnboarding(v);
    localStorage.setItem('zppia_onboarding', String(v));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060B18' }}>
        <div className="w-8 h-8 rounded-full border-2 border-zppia-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn: !!session,
      role,
      userId: session?.user?.id ?? null,
      studentName,
      login,
      logout,
      hasSeenOnboarding,
      setHasSeenOnboarding: handleSetOnboarding,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
