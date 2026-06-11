import React, { createContext, useContext, useMemo, useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { firebaseAuth, googleProvider } from './firebase';

type AuthUser = {
  email: string;
  full_name?: string;
  auth_provider?: string;
  providers?: string[];
  photo_url?: string;
};

type AuthResult = {
  access_token: string;
  user: AuthUser;
};

type SignupResult = {
  message: string;
  user: AuthUser;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<string>;
  register: (fullName: string, email: string, password: string) => Promise<string>;
  sandboxLogin: () => Promise<void>;
  googleLogin: () => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<boolean>;
  logout: () => void;
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const TOKEN_STORAGE_KEY = 'ascendiq_token';
const USER_STORAGE_KEY = 'ascendiq_user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredUser = () => {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  return storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
};

const requestAuth = async <T,>(path: 'login' | 'signup' | 'register' | 'sandbox-login' | 'firebase-login' | 'send-otp' | 'verify-otp', body: Record<string, unknown> = {}) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? 'Authentication failed');
  }

  return (await response.json()) as T;
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
        storeSession(await requestAuth<AuthResult>('login', { email, password }));
      },
      signup: async (email, password) => {
        const result = await requestAuth<SignupResult>('signup', { email, password });
        return result.message;
      },
      register: async (fullName, email, password) => {
        const result = await requestAuth<SignupResult>('register', { full_name: fullName, email, password });
        return result.message;
      },
      sandboxLogin: async () => {
        const result = await requestAuth<AuthResult>('sandbox-login');
        storeSession({ access_token: result.access_token, user: result.user });
      },
      googleLogin: async () => {
        const credential = await signInWithPopup(firebaseAuth, googleProvider);
        const idToken = await credential.user.getIdToken();
        const result = await requestAuth<AuthResult>('firebase-login', { id_token: idToken });
        storeSession(result);
      },
      sendOtp: async (email) => {
        await requestAuth<{ message: string }>('send-otp', { email });
      },
      verifyOtp: async (email, code) => {
        const result = await requestAuth<{ verified: boolean }>('verify-otp', { email, code });
        return Boolean(result.verified);
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
