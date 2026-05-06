import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Usuario } from '../types';

interface AuthContextType {
  usuario: Usuario | null;
  login: (usuario: Usuario) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'moeda_estudantil_usuario';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const login = (u: Usuario) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUsuario(u);
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
