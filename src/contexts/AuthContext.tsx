import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  studentName: string;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('zppia_auth') === 'true');
  const [studentName] = useState(() => localStorage.getItem('zppia_name') || 'Seu Nome');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => localStorage.getItem('zppia_onboarding') === 'true');

  const login = (email: string, password: string) => {
    if (email === 'aluno@zppia.com' && password === 'zppia2025') {
      setIsLoggedIn(true);
      localStorage.setItem('zppia_auth', 'true');
      localStorage.setItem('zppia_name', 'Seu Nome');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('zppia_auth');
  };

  const handleSetOnboarding = (v: boolean) => {
    setHasSeenOnboarding(v);
    localStorage.setItem('zppia_onboarding', String(v));
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, studentName, login, logout, hasSeenOnboarding, setHasSeenOnboarding: handleSetOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
