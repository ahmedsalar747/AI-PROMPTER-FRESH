import React from 'react';
import Toast, { ToastData } from './Toast';
import './ToastContainer.css';

interface ToastContainerProps {
  toasts: ToastData[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast 
          key={toast.id} 
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer; 