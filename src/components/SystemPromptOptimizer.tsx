import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { TokenOptimizer } from '../utils/tokenOptimizer';
import './SystemPromptOptimizer.css';

interface SystemPromptOptimizerProps {
  originalSystemPrompt: string;
  onOptimizedPrompt: (optimized: string) => void;
  modelName?: string;
}

const SystemPromptOptimizer: React.FC<SystemPromptOptimizerProps> = ({
  originalSystemPrompt,
  onOptimizedPrompt,
  modelName = 'AI Model'
}) => {
  const [optimizationLevel, setOptimizationLevel] = useState<'light' | 'medium' | 'aggressive'>('medium');
  const [optimizedPrompt, setOptimizedPrompt] = useState<string>('');
  const [tokenSaving, setTokenSaving] = useState<number>(0);
  const [savingPercentage, setSavingPercentage] = useState<number>(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const { addToast } = useToast();

  const originalTokens = Math.ceil(originalSystemPrompt.length / 4);

  useEffect(() => {
    optimizeSystemPrompt();
  }, [optimizationLevel, originalSystemPrompt]);

  const optimizeSystemPrompt = () => {
    setIsOptimizing(true);
    
    // شبیه‌سازی تأخیر برای نمایش loading
    setTimeout(() => {
      const optimized = TokenOptimizer.optimizeSystemPrompt(originalSystemPrompt, optimizationLevel);
      const optimizedTokens = Math.ceil(optimized.length / 4);
      const saved = originalTokens - optimizedTokens;
      const percentage = (saved / originalTokens) * 100;
      
      setOptimizedPrompt(optimized);
      setTokenSaving(saved);
      setSavingPercentage(percentage);
      setIsOptimizing(false);
    }, 500);
  };

  const applyOptimization = () => {
    onOptimizedPrompt(optimizedPrompt);
    addToast(`✅ System prompt بهینه شده اعمال شد - ${tokenSaving} توکن صرفه‌جویی`, 'success');
  };

  const copyOptimized = () => {
    navigator.clipboard.writeText(optimizedPrompt);
    addToast('✅ System prompt بهینه شده کپی شد', 'success');
  };

  const resetToOriginal = () => {
    onOptimizedPrompt(originalSystemPrompt);
    addToast('↩️ System prompt اصلی بازگردانده شد', 'info');
  };

  const getLevelDescription = (level: 'light' | 'medium' | 'aggressive') => {
    switch (level) {
      case 'light':
        return 'حذف توضیحات اضافی و پرانتزها';
      case 'medium':
        return 'حذف بخش‌های غیرضروری و مراحل پیچیده';
      case 'aggressive':
        return 'فشرده‌سازی کامل تا هسته اصلی';
      default:
        return '';
    }
  };

  return (
    <div className="system-prompt-optimizer">
      <div className="system-prompt-header">
        <h3>🔧 بهینه‌ساز System Prompt</h3>
        <p>کاهش هزینه system prompt برای {modelName}</p>
      </div>

      <div className="system-prompt-stats">
        <div className="stat-card">
          <div className="stat-value">{originalTokens}</div>
          <div className="stat-label">توکن اصلی</div>
        </div>
        <div className="stat-card optimized">
          <div className="stat-value">{Math.ceil(optimizedPrompt.length / 4)}</div>
          <div className="stat-label">توکن بهینه</div>
        </div>
        <div className="stat-card savings">
          <div className="stat-value">{tokenSaving}</div>
          <div className="stat-label">کاهش توکن</div>
        </div>
        <div className="stat-card percentage">
          <div className="stat-value">{savingPercentage.toFixed(1)}%</div>
          <div className="stat-label">صرفه‌جویی</div>
        </div>
      </div>

      <div className="optimization-controls">
        <div className="level-selector">
          <label>⚡ سطح بهینه‌سازی:</label>
          <div className="level-options">
            {(['light', 'medium', 'aggressive'] as const).map(level => (
              <div key={level} className="level-option">
                <input
                  type="radio"
                  id={level}
                  name="optimizationLevel"
                  value={level}
                  checked={optimizationLevel === level}
                  onChange={(e) => setOptimizationLevel(e.target.value as 'light' | 'medium' | 'aggressive')}
                />
                <label htmlFor={level} className="level-label">
                  <div className="level-name">
                    {level === 'light' && '🔸 آرام'}
                    {level === 'medium' && '🔶 متوسط'}
                    {level === 'aggressive' && '🔺 قوی'}
                  </div>
                  <div className="level-description">
                    {getLevelDescription(level)}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="optimization-preview">
        <div className="preview-header">
          <h4>📋 پیش‌نمایش بهینه‌سازی</h4>
          <button 
            onClick={() => setShowComparison(!showComparison)}
            className="toggle-comparison"
          >
            {showComparison ? '📄 نمایش مختصر' : '📊 مقایسه کامل'}
          </button>
        </div>

        {isOptimizing ? (
          <div className="optimization-loading">
            <div className="loading-spinner"></div>
            <p>در حال بهینه‌سازی...</p>
          </div>
        ) : (
          <div className="optimization-content">
            {showComparison ? (
              <div className="comparison-view">
                <div className="comparison-section">
                  <h5>📜 System Prompt اصلی ({originalTokens} توکن):</h5>
                  <div className="prompt-preview original">
                    <pre>{originalSystemPrompt}</pre>
                  </div>
                </div>
                <div className="comparison-section">
                  <h5>✨ System Prompt بهینه ({Math.ceil(optimizedPrompt.length / 4)} توکن):</h5>
                  <div className="prompt-preview optimized">
                    <pre>{optimizedPrompt}</pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="simple-view">
                <div className="optimized-preview">
                  <h5>✨ System Prompt بهینه شده:</h5>
                  <div className="prompt-preview optimized">
                    <pre>{optimizedPrompt}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="system-prompt-actions">
        <button 
          onClick={applyOptimization}
          className="apply-btn"
          disabled={isOptimizing}
        >
          ✅ اعمال بهینه‌سازی
        </button>
        <button 
          onClick={copyOptimized}
          className="copy-btn"
          disabled={isOptimizing}
        >
          📋 کپی
        </button>
        <button 
          onClick={resetToOriginal}
          className="reset-btn"
        >
          ↩️ بازگردانی
        </button>
      </div>

      <div className="optimization-tips">
        <h4>💡 نکات مهم:</h4>
        <ul>
          <li>🎯 <strong>تست عملکرد:</strong> بعد از بهینه‌سازی، عملکرد مدل را تست کنید</li>
          <li>⚖️ <strong>تعادل:</strong> بین صرفه‌جویی و کیفیت خروجی تعادل برقرار کنید</li>
          <li>🔄 <strong>A/B تست:</strong> نسخه اصلی و بهینه شده را مقایسه کنید</li>
          <li>📊 <strong>پایش:</strong> کیفیت پاسخ‌های مدل را پایش کنید</li>
          <li>🎨 <strong>سفارشی‌سازی:</strong> در صورت نیاز، system prompt را دستی تنظیم کنید</li>
        </ul>
      </div>
    </div>
  );
};

export default SystemPromptOptimizer; 