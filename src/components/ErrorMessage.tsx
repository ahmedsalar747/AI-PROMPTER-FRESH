import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  type?: 'error' | 'warning' | 'info';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onClose, 
  type = 'error' 
}) => {
  return (
    <div className={`error-message ${type}`}>
      <div className="error-content">
        <span className="error-icon">
          {type === 'error' && '⚠️'}
          {type === 'warning' && '⚠️'}
          {type === 'info' && 'ℹ️'}
        </span>
        <span className="error-text">{message}</span>
      </div>
      {onClose && (
        <button className="error-close" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 