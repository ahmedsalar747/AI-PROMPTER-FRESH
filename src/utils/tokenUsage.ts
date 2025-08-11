export interface TokenUsageEvent {
  provider: string;
  modelId: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  timestamp: number; // ms since epoch
  approximate?: boolean;
}

const STORAGE_KEY = 'prompter-token-usage-events';

export const estimateTokens = (text: string): number => {
  if (!text) return 0;
  const length = text.trim().length;
  // Simple heuristic: ~4 chars per token (en), still usable for fa as coarse estimate
  return Math.max(1, Math.ceil(length / 4));
};

export const recordTokenUsage = (event: TokenUsageEvent): void => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: TokenUsageEvent[] = raw ? JSON.parse(raw) : [];
    list.push(event);
    // Keep last 500 events to avoid bloat
    const trimmed = list.slice(-500);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore storage errors
  }
};

export const getMonthlyTotals = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: TokenUsageEvent[] = raw ? JSON.parse(raw) : [];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthStart = new Date(year, month, 1).getTime();
    const monthEnd = new Date(year, month + 1, 1).getTime();

    const monthEvents = list.filter(e => e.timestamp >= monthStart && e.timestamp < monthEnd);
    const prompt = monthEvents.reduce((sum, e) => sum + (e.promptTokens || 0), 0);
    const completion = monthEvents.reduce((sum, e) => sum + (e.completionTokens || 0), 0);
    const total = monthEvents.reduce((sum, e) => sum + (e.totalTokens || 0), 0);

    return { prompt, completion, total, count: monthEvents.length };
  } catch {
    return { prompt: 0, completion: 0, total: 0, count: 0 };
  }
};

export const getRecentUsage = (limit = 20): TokenUsageEvent[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: TokenUsageEvent[] = raw ? JSON.parse(raw) : [];
    return list.slice(-limit);
  } catch {
    return [];
  }
};

