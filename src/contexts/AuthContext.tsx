import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Role } from '@/data/mockData';

interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  email: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: Role) => boolean;
  logout: () => void;
}

const CREDENTIALS: Record<Role, { email: string; password: string }> = {
  'fleet-manager': { email: 'fleet@nexttransit.dz', password: 'fleet2024' },
  'dg': { email: 'dg@nexttransit.dz', password: 'dg2024' },
  'controlling': { email: 'controlling@nexttransit.dz', password: 'controlling2024' },
};

const STORAGE_KEY = 'nexttransit_auth';

const VALID_ROLES: Role[] = ['fleet-manager', 'dg', 'controlling'];

function loadAuth(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        parsed.isAuthenticated === true &&
        typeof parsed.role === 'string' &&
        VALID_ROLES.includes(parsed.role) &&
        typeof parsed.email === 'string'
      ) {
        return { isAuthenticated: true, role: parsed.role, email: parsed.email };
      }
    }
  } catch {}
  return { isAuthenticated: false, role: null, email: null };
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(loadAuth);

  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state]);

  const login = useCallback((email: string, password: string, role: Role): boolean => {
    const cred = CREDENTIALS[role];
    if (cred.email === email.trim().toLowerCase() && cred.password === password) {
      setState({ isAuthenticated: true, role, email: cred.email });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setState({ isAuthenticated: false, role: null, email: null });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
