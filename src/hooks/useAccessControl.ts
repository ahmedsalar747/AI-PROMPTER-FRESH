import { hasPremiumAccess } from '../utils/templateAccess';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export const useAccessControl = () => {
  const checkAccess = (
    level: DifficultyLevel
  ): boolean => {
    const isPremium = hasPremiumAccess();
    
    // Free tier: فقط beginner
    if (level === 'beginner') return true;
    
    // Premium required برای intermediate, advanced, expert
    return isPremium;
  };

  const closePaywall = () => {};
  const hasAccess = (level: DifficultyLevel): boolean => checkAccess(level);

  return {
    checkAccess,
    closePaywall,
    hasAccess,
    isProSubscriber: hasPremiumAccess(),
  };
};

export default useAccessControl; 