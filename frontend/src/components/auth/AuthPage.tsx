import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignInPage } from '../ui/sign-in-flow-1';
import { useAuth } from '@/auth';

export const AuthPage = ({ initialMode = 'login' }: { initialMode?: 'login' | 'register' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, sendOtp, verifyOtp, sandboxLogin, googleLogin } = useAuth();
  
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const notice = (location.state as any)?.notice;

  const handleToggleMode = () => {
    setMode(prev => (prev === 'login' ? 'register' : 'login'));
  };

  const handleSuccess = () => {
    if (mode === 'register') {
      navigate('/login', {
        replace: true,
        state: { notice: 'Email verified. Please log in with your password.' },
      });
      return;
    }
    navigate(from, { replace: true });
  };

  const handleGoogleLogin = async () => {
    await googleLogin();
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
      onGoogleLogin={handleGoogleLogin}
      onSuccess={handleSuccess}
      notice={notice}
      isDev={import.meta.env.MODE === 'development'}
    />
  );
};

export default AuthPage;
