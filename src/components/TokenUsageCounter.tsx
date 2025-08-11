import React, { useEffect, useState } from 'react';
import { getMonthlyTotals, getRecentUsage } from '../utils/tokenUsage';

const TokenUsageCounter: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [totals, setTotals] = useState(getMonthlyTotals());
  const [recent, setRecent] = useState(getRecentUsage(5));

  useEffect(() => {
    // Refresh on mount and when window gains focus
    const refresh = () => {
      setTotals(getMonthlyTotals());
      setRecent(getRecentUsage(5));
    };
    refresh();
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);

  return (
    <div className={`token-usage-counter ${className}`} style={{
      background: '#0f172a', color: '#e2e8f0', borderRadius: 12, padding: 12, border: '1px solid #1f2937'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 18 }}>🪙</span>
        <strong>Token usage (this month)</strong>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div>Prompt: <strong>{totals.prompt.toLocaleString()}</strong></div>
        <div>Completion: <strong>{totals.completion.toLocaleString()}</strong></div>
        <div>Total: <strong>{totals.total.toLocaleString()}</strong></div>
      </div>
      {recent.length > 0 && (
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85 }}>
          Recent: {recent.map((e, i) => (
            <span key={i} title={`${new Date(e.timestamp).toLocaleString()} • ${e.provider} • ${e.modelId}${e.approximate ? ' (approx)': ''}`}
              style={{ marginRight: 8 }}>
              {e.totalTokens}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TokenUsageCounter;

