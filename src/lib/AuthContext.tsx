// src/lib/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { isLoggedIn } from './konimbo';

interface AuthContextValue {
  loggedIn: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  useEffect(() => {
    // Poll every 2s continuously — detects both login and logout transitions
    const id = setInterval(() => setLoggedIn(isLoggedIn()), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
