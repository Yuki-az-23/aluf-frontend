// src/lib/AuthContext.tsx
// Minimal auth context — session state is managed natively by Konimbo.
// This provider exists as a structural wrapper for future auth-aware components.
import { createContext, useContext, type ReactNode } from 'react';

interface AuthContextValue {
  /** true when the Konimbo session cookie indicates a logged-in customer */
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextValue>({ isLoggedIn: false });

function detectLoggedIn(): boolean {
  // Konimbo sets a nav element that is only present for logged-in users
  return !!document.querySelector('#current_customer_my_place_ul');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const isLoggedIn = detectLoggedIn();
  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
