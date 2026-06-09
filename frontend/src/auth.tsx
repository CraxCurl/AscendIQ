import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthUser = {
  email: string;
};

type AuthResult = {
  access_token: string;
  user: AuthUser;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const TOKEN_STORAGE_KEY = 'ascendiq_token';
const USER_STORAGE_KEY = 'ascendiq_user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredUser = () => {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  return storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
};

const authenticate = async (path: 'login' | 'signup', email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? 'Authentication failed');
  }

  return (await response.json()) as AuthResult;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  const storeSession = (result: AuthResult) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, result.access_token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user));
    setToken(result.access_token);
    setUser(result.user);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login: async (email, password) => {
        storeSession(await authenticate('login', email, password));
      },
      signup: async (email, password) => {
        storeSession(await authenticate('signup', email, password));
      },
      logout: () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        setToken(null);
        setUser(null);
      },
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
