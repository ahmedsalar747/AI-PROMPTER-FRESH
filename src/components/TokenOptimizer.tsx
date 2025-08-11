import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { OptimizationOptions, TokenOptimizationResult, TokenOptimizer as TokenOptimizerService } from '../utils/tokenOptimizer';
import './TokenOptimizer.css';

interface TokenOptimizerProps {
  initialPrompt?: string;
  onOptimizedPrompt?: (optimized: string) => void;
  showAdvancedOptions?: boolean;
}

const TokenOptimizer: React.FC<TokenOptimizerProps> = ({
  initialPrompt = '',
  onOptimizedPrompt,
  showAdvancedOptions = true
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [result, setResult] = useState<TokenOptimizationResult | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<'light' | 'medium' | 'aggressive'>('medium');
  const [customOptions, setCustomOptions] = useState<OptimizationOptions>(
    TokenOptimizerService.getOptimizationPresets().medium
  );
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showCustomOptions, setShowCustomOptions] = useState(false);
  const { addToast } = useToast();

  const handleOptimize = async () => {
    if (!prompt.trim()) {
      addToast('لطفاً متن prompt را وارد کنید', 'error');
      return;
    }

    setIsOptimizing(true);
    try {
      const options = showCustomOptions ? customOptions : TokenOptimizerService.getOptimizationPresets()[selectedPreset];
      const optimizationResult = TokenOptimizerService.optimizeUserPrompt(prompt, options);
      
      setResult(optimizationResult);
      
      if (onOptimizedPrompt) {
        onOptimizedPrompt(optimizationResult.optimizedPrompt);
      }
      
      addToast(
        `🎉 ${optimizationResult.savedTokens} توکن کاهش یافت (${optimizationResult.savingPercentage.toFixed(1)}%)`,
        'success'
      );
    } catch {
      addToast('خطا در بهینه‌سازی', 'error');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handlePresetChange = (preset: 'light' | 'medium' | 'aggressive') => {
    setSelectedPreset(preset);
    setCustomOptions(TokenOptimizerService.getOptimizationPresets()[preset]);
  };

  const handleCustomOptionChange = (option: keyof OptimizationOptions, value: boolean | number) => {
    setCustomOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('✅ کپی شد', 'success');
  };

  const applyOptimized = () => {
    if (result) {
      setPrompt(result.optimizedPrompt);
      setResult(null);
      addToast('✅ prompt بهینه شده اعمال شد', 'success');
    }
  };

  return (
    <div className="token-optimizer">
      <div className="token-optimizer-header">
        <h3>🔧 بهینه‌ساز توکن</h3>
        <p>کاهش هزینه و بهبود کارایی prompt های شما</p>
      </div>

      {/* Input Area */}
      <div className="token-optimizer-input">
        <label>📝 متن prompt:</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="prompt خود را اینجا وارد کنید..."
          rows={6}
          className="token-optimizer-textarea"
        />
        <div className="token-count">
          📊 تخمین توکن: {Math.ceil(prompt.length / 4)}
        </div>
      </div>

      {/* Optimization Options */}
      <div className="token-optimizer-options">
        <div className="preset-selector">
          <label>⚡ سطح بهینه‌سازی:</label>
          <div className="preset-buttons">
            {(['light', 'medium', 'aggressive'] as const).map(preset => (
              <button
                key={preset}
                onClick={() => handlePresetChange(preset)}
                className={`preset-btn ${selectedPreset === preset ? 'active' : ''}`}
              >
                {preset === 'light' && '🔸 آرام'}
                {preset === 'medium' && '🔶 متوسط'}
                {preset === 'aggressive' && '🔺 قوی'}
              </button>
            ))}
          </div>
        </div>

        {showAdvancedOptions && (
          <div className="advanced-options">
            <button
              onClick={() => setShowCustomOptions(!showCustomOptions)}
              className="toggle-advanced"
            >
              {showCustomOptions ? '📋 حالت ساده' : '⚙️ تنظیمات پیشرفته'}
            </button>

            {showCustomOptions && (
              <div className="custom-options">
                <div className="option-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={customOptions.enableAbbreviations}
                      onChange={(e) => handleCustomOptionChange('enableAbbreviations', e.target.checked)}
                    />
                    📝 استفاده از مخفف‌ها
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={customOptions.removeRedundancy}
                      onChange={(e) => handleCustomOptionChange('removeRedundancy', e.target.checked)}
                    />
                    🗑️ حذف تکرارها
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={customOptions.compressInstructions}
                      onChange={(e) => handleCustomOptionChange('compressInstructions', e.target.checked)}
                    />
                    🗜️ فشرده‌سازی دستورها
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={customOptions.useShortForms}
                      onChange={(e) => handleCustomOptionChange('useShortForms', e.target.checked)}
                    />
                    ⚡ فرم‌های کوتاه
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={customOptions.removeExamples}
                      onChange={(e) => handleCustomOptionChange('removeExamples', e.target.checked)}
                    />
                    🚫 حذف مثال‌ها
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={customOptions.limitExplanations}
                      onChange={(e) => handleCustomOptionChange('limitExplanations', e.target.checked)}
                    />
                    📏 محدود کردن توضیحات
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={customOptions.preserveQuality}
                      onChange={(e) => handleCustomOptionChange('preserveQuality', e.target.checked)}
                    />
                    🎯 حفظ کیفیت
                  </label>
                </div>
                
                {customOptions.maxLength && (
                  <div className="max-length-option">
                    <label>📐 حداکثر طول:</label>
                    <input
                      type="number"
                      value={customOptions.maxLength}
                      onChange={(e) => handleCustomOptionChange('maxLength', parseInt(e.target.value))}
                      min="100"
                      max="2000"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="token-optimizer-actions">
        <button
          onClick={handleOptimize}
          disabled={isOptimizing || !prompt.trim()}
          className="optimize-btn"
        >
          {isOptimizing ? '🔄 در حال بهینه‌سازی...' : '🚀 بهینه‌سازی'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="token-optimizer-results">
          <div className="results-header">
            <h4>📊 نتایج بهینه‌سازی</h4>
            <div className="results-stats">
              <div className="stat">
                <span className="stat-value">{result.savedTokens}</span>
                <span className="stat-label">توکن کاهش</span>
              </div>
              <div className="stat">
                <span className="stat-value">{result.savingPercentage.toFixed(1)}%</span>
                <span className="stat-label">صرفه‌جویی</span>
              </div>
              <div className="stat">
                <span className="stat-value">{result.optimizedTokens}</span>
                <span className="stat-label">توکن نهایی</span>
              </div>
            </div>
          </div>

          <div className="optimized-prompt">
            <label>✨ Prompt بهینه شده:</label>
            <div className="prompt-output">
              <pre>{result.optimizedPrompt}</pre>
              <div className="prompt-actions">
                <button onClick={() => copyToClipboard(result.optimizedPrompt)}>
                  📋 کپی
                </button>
                <button onClick={applyOptimized}>
                  ✅ اعمال
                </button>
              </div>
            </div>
          </div>

          {result.optimizationMethods.length > 0 && (
            <div className="optimization-methods">
              <label>🔧 روش‌های اعمال شده:</label>
              <ul>
                {result.optimizationMethods.map((method, index) => (
                  <li key={index}>{method}</li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions.length > 0 && (
            <div className="optimization-suggestions">
              <label>💡 پیشنهادات:</label>
              <ul>
                {result.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="token-optimizer-tips">
        <h4>💡 نکات مفید:</h4>
        <ul>
          <li>🎯 <strong>هسته اصلی:</strong> بر روی هسته اصلی prompt تمرکز کنید</li>
          <li>📝 <strong>زبان مستقیم:</strong> از جملات مستقیم استفاده کنید</li>
          <li>🔍 <strong>کلمات کلیدی:</strong> کلمات کلیدی مهم را حفظ کنید</li>
          <li>📊 <strong>تست کیفیت:</strong> بعد از بهینه‌سازی، کیفیت را تست کنید</li>
          <li>⚖️ <strong>تعادل:</strong> بین صرفه‌جویی و کیفیت تعادل برقرار کنید</li>
        </ul>
      </div>
    </div>
  );
};

export default TokenOptimizer; 