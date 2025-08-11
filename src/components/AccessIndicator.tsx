import React from 'react';
import { DifficultyLevel } from '../hooks/useAccessControl';
import './AccessIndicator.css';

interface AccessIndicatorProps {
  difficulty: DifficultyLevel;
  hasAccess: boolean;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const AccessIndicator: React.FC<AccessIndicatorProps> = ({ 
  difficulty, 
  hasAccess, 
  size = 'medium',
  showText = false 
}) => {
  const getDifficultyInfo = (level: DifficultyLevel) => {
    const info = {
      beginner: { icon: '🌱', name: 'Beginner', color: '#10b981' },
      intermediate: { icon: '🌿', name: 'Intermediate', color: '#f59e0b' },
      advanced: { icon: '🌳', name: 'Advanced', color: '#ef4444' },
      expert: { icon: '🚀', name: 'Expert', color: '#8b5cf6' }
    };
    return info[level] || { icon: '📄', name: level, color: '#6b7280' };
  };

  const diffInfo = getDifficultyInfo(difficulty);

  return (
    <div 
      className={`access-indicator ${size} ${hasAccess ? 'accessible' : 'locked'}`}
      style={{ '--difficulty-color': diffInfo.color } as React.CSSProperties}
    >
      <span className="difficulty-icon">{diffInfo.icon}</span>
      {showText && (
        <span className="difficulty-text">
          {diffInfo.name}
          {!hasAccess && <span className="lock-icon">🔒</span>}
        </span>
      )}
      {!hasAccess && (
        <div className="access-overlay">
          <span className="unlock-hint">Upgrade Required</span>
        </div>
      )}
    </div>
  );
};

export default AccessIndicator; 