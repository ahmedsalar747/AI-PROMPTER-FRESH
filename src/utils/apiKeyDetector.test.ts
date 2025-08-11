/**
 * 🧪 Test file for API Key Detection
 * تست منطق تشخیص API Key شخصی
 */

import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { getApiKeyMessage, getApiKeyType, isPersonalApiKey } from './apiKeyDetector';

// Mock environment variable
const originalEnv = import.meta.env.VITE_OPENAI_API_KEY;
beforeAll(() => {
  // Set a mock free API key for testing
  (import.meta.env as any).VITE_OPENAI_API_KEY = 'sk-free-api-key-123456789';
});

afterAll(() => {
  // Restore original environment variable
  (import.meta.env as any).VITE_OPENAI_API_KEY = originalEnv;
});

describe('API Key Detection Tests', () => {
  test('should detect personal OpenAI API key', () => {
    const personalKey = 'sk-personal-key-abcdefghijklmnopqrstuvwxyz';
    expect(isPersonalApiKey(personalKey)).toBe(true);
    expect(getApiKeyType(personalKey)).toBe('personal');
  });

  test('should detect personal Anthropic API key', () => {
    const personalKey = 'sk-ant-personal-key-abcdefghijklmnopqrstuvwxyz';
    expect(isPersonalApiKey(personalKey)).toBe(true);
    expect(getApiKeyType(personalKey)).toBe('personal');
  });

  test('should detect free API key', () => {
    const freeKey = 'sk-free-api-key-123456789';
    expect(isPersonalApiKey(freeKey)).toBe(false);
    expect(getApiKeyType(freeKey)).toBe('free');
  });

  test('should detect placeholder keys', () => {
    const placeholderKey = 'sk-your-api-key-here';
    expect(isPersonalApiKey(placeholderKey)).toBe(false);
    expect(getApiKeyType(placeholderKey)).toBe('free');
  });

  test('should detect empty/null keys', () => {
    expect(isPersonalApiKey(null)).toBe(false);
    expect(isPersonalApiKey(undefined)).toBe(false);
    expect(isPersonalApiKey('')).toBe(false);
    expect(getApiKeyType(null)).toBe('none');
  });

  test('should detect short keys', () => {
    const shortKey = 'sk-short';
    expect(isPersonalApiKey(shortKey)).toBe(false);
    expect(getApiKeyType(shortKey)).toBe('free');
  });

  test('should return correct messages for personal keys', () => {
    const message = getApiKeyMessage('personal');
    expect(message.title).toBe('🔑 Personal API Key');
    expect(message.message).toBe('Unlimited usage with no restrictions - Full access to all features');
    expect(message.type).toBe('success');
  });

  test('should return correct messages for free keys', () => {
    const message = getApiKeyMessage('free');
    expect(message.title).toBe('🎁 Free API');
    expect(message.message).toBe('Limited usage: 200 tokens, 3 requests per month');
    expect(message.type).toBe('info');
  });

  test('should return correct messages for no keys', () => {
    const message = getApiKeyMessage('none');
    expect(message.title).toBe('⚠️ No API Key');
    expect(message.message).toBe('Please configure your API key for full functionality');
    expect(message.type).toBe('warning');
  });
});

console.log('✅ API Key Detection Tests completed successfully!'); 