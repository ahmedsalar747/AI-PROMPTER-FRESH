import React, { useEffect, useState } from 'react';
import './Toast.css';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  title?: string;
}

interface ToastProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = toast.duration || 3000;
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`toast toast-${toast.type} ${isVisible ? 'toast-enter' : 'toast-exit'}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <div className="toast-text">
          {toast.title && <div className="toast-title">{toast.title}</div>}
          <span className="toast-message">{toast.message}</span>
        </div>
      </div>
      <button 
        className="toast-close" 
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onRemove(toast.id), 300);
        }}
      >
        ✕
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

export default Toast; 