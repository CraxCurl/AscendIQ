import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignInPage } from '../ui/sign-in-flow-1';
import { useAuth } from '@/auth';

type AuthMode = 'login' | 'register' | 'forgot';

export const AuthPage = ({ initialMode = 'login' }: { initialMode?: 'login' | 'register' }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [resetKey, setResetKey] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, sendOtp, verifyOtp, forgotPassword, resetPassword, sandboxLogin, googleLogin } = useAuth();
  
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const notice = (location.state as any)?.notice;

  const handleToggleMode = () => {
    setMode(prev => (prev === 'register' || prev === 'forgot' ? 'login' : 'register'));
  };

  const handleSuccess = () => {
    if (mode === 'register' || mode === 'forgot') {
      setMode('login');
      setResetKey(prev => prev + 1);
      navigate('/login', {
        replace: true,
        state: { notice: mode === 'forgot' ? 'Password updated. Please log in.' : 'Email verified. Please log in with your password.' },
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
      key={resetKey}
      mode={mode}
      onToggleMode={handleToggleMode}
      onLoginSubmit={login}
      onRegisterSubmit={register}
      onSendOtp={sendOtp}
      onVerifyOtp={verifyOtp}
      onForgotPassword={forgotPassword}
      onResetPassword={resetPassword}
      onSandboxLogin={sandboxLogin}
      onGoogleLogin={handleGoogleLogin}
      onSuccess={handleSuccess}
      notice={notice}
      onForgotMode={() => setMode('forgot')}
      isDev={import.meta.env.MODE === 'development'}
    />
  );
};

export default AuthPage;
