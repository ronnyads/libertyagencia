import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, type UserRole } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  isLoggedIn: boolean;
  authLoading: boolean;
  role: UserRole;
  userId: string | null;
  studentName: string;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; role?: UserRole }>;
  logout: () => Promise<void>;
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getRoleFromSession(session: Session | null): UserRole {
  // Lê role do app_metadata — vem direto no JWT, sem query extra
  return (session?.user?.app_metadata?.role as UserRole) || 'student';
}

function getNameFromSession(session: Session | null): string {
  return session?.user?.user_metadata?.name
    || session?.user?.email?.split('@')[0]
    || 'Aluno';
}

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
      if (session) {
        const r = getRoleFromSession(session);
        setRole(r);
        setStudentName(getNameFromSession(session));
        localStorage.setItem('zppia_role', r);
      }
      setLoading(false);
    });

    // Listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        const r = getRoleFromSession(session);
        setRole(r);
        setStudentName(getNameFromSession(session));
        localStorage.setItem('zppia_role', r);
      } else {
        setRole('student');
        setStudentName('Aluno');
        localStorage.removeItem('zppia_role');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: 'Email ou senha incorretos.' };
    // Role vem direto do app_metadata no JWT — sem query extra
    const r = getRoleFromSession(data.session);
    setRole(r);
    setStudentName(getNameFromSession(data.session));
    localStorage.setItem('zppia_role', r);
    return { ok: true, role: r };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setRole('student');
    setStudentName('Aluno');
    localStorage.removeItem('zppia_role');
  };

  const handleSetOnboarding = (v: boolean) => {
    setHasSeenOnboarding(v);
    localStorage.setItem('zppia_onboarding', String(v));
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn: !!session,
      authLoading: loading,
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
