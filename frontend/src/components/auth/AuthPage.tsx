import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignInPage } from '../ui/sign-in-flow-1';
import { useAuth } from '@/auth';

export const AuthPage = ({ initialMode = 'login' }: { initialMode?: 'login' | 'register' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, sendOtp, verifyOtp, sandboxLogin } = useAuth();
  
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleToggleMode = () => {
    setMode(prev => (prev === 'login' ? 'register' : 'login'));
  };

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <SignInPage
      mode={mode}
      onToggleMode={handleToggleMode}
      onLoginSubmit={login}
      onRegisterSubmit={register}
      onSendOtp={sendOtp}
      onVerifyOtp={verifyOtp}
      onSandboxLogin={sandboxLogin}
      onSuccess={handleSuccess}
      isDev={import.meta.env.MODE === 'development'}
    />
  );
};

export default AuthPage;
