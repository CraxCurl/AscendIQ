import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, message, type = 'info', duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="text-emerald-400" size={20} />,
    error: <AlertCircle className="text-red-400" size={20} />,
    info: <Info className="text-white/60" size={20} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="pointer-events-auto flex w-full max-w-sm items-center gap-3 overflow-hidden rounded-2xl bg-[#111]/90 border border-white/10 p-4 shadow-2xl backdrop-blur-xl"
    >
      <div className="shrink-0">{icons[type]}</div>
      <div className="flex-1 text-sm font-medium text-white">{message}</div>
      <button
        onClick={() => onClose(id)}
        className="shrink-0 rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

// Simple Toast Provider context
interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = React.createContext<ToastContextType>({
  toast: () => console.warn('ToastProvider not wrapped'),
});

export const useToast = () => React.useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);

  const addToast = (message: string, type: ToastType = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-6 pointer-events-none">
          <AnimatePresence>
            {toasts.map((t) => (
              <Toast key={t.id} {...t} onClose={removeToast} />
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
