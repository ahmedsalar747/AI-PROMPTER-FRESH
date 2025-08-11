import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { ToastData } from '../components/Toast';
import ToastContainer from '../components/ToastContainer';

interface ToastContextType {
  toasts: ToastData[];
  addToast: (message: string, type?: ToastData['type']) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((message: string, type: ToastData['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { 
      id, 
      message, 
      type, 
      duration: 5000
    }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}; 