import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkRateLimit } from '../lib/rateLimit';

describe('Rate Limiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows the first request', () => {
    const result = checkRateLimit('192.168.1.1', 5, 15);
    expect(result.success).toBe(true);
  });

  it('blocks requests after hitting the maxRequests limit', () => {
    const ip = '10.0.0.1';
    
    // Send 5 requests
    for(let i = 0; i < 5; i++) {
      expect(checkRateLimit(ip, 5, 15).success).toBe(true);
    }

    // 6th request should fail
    const blockedResult = checkRateLimit(ip, 5, 15);
    expect(blockedResult.success).toBe(false);
    expect(blockedResult.retryAfter).toBeDefined();
  });

  it('resets the limit after the time window expires', () => {
    const ip = '127.0.0.1';
    
    for(let i = 0; i < 2; i++) {
      checkRateLimit(ip, 2, 15);
    }
    
    // Should be blocked now
    expect(checkRateLimit(ip, 2, 15).success).toBe(false);

    // Fast-forward 16 minutes (window is 15 mins)
    vi.advanceTimersByTime(16 * 60 * 1000);

    // Should be allowed again
    const result = checkRateLimit(ip, 2, 15);
    expect(result.success).toBe(true);
  });
});
