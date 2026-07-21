import { describe, it, expect, vi, beforeEach } from 'vitest';
import { forgotPasswordAction, resetPasswordAction } from '../actions/auth';
import { createClient } from '@/lib/supabase/server';

// Mock dependencies
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('Auth Server Actions', () => {
  let mockSupabase;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase = {
      auth: {
        resetPasswordForEmail: vi.fn(),
        updateUser: vi.fn(),
      }
    };
    
    createClient.mockResolvedValue(mockSupabase);
  });

  describe('forgotPasswordAction', () => {
    it('returns error if turnstileToken is missing', async () => {
      const result = await forgotPasswordAction('test@example.com', null);
      
      expect(result).toEqual({ success: false, message: 'Please complete the captcha verification' });
      expect(createClient).not.toHaveBeenCalled();
    });

    it('returns success when supabase resetPasswordForEmail succeeds', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });
      
      const result = await forgotPasswordAction('test@example.com', 'valid-token');
      
      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com', {
        redirectTo: expect.any(String),
        captchaToken: 'valid-token'
      });
      expect(result).toEqual({ success: true, message: 'Password reset email sent! Please check your inbox.' });
    });

    it('returns error when supabase resetPasswordForEmail fails', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: { message: 'User not found' } });
      
      const result = await forgotPasswordAction('invalid@example.com', 'valid-token');
      
      expect(result).toEqual({ success: false, message: 'User not found' });
    });
  });

  describe('resetPasswordAction', () => {
    it('returns success when supabase updateUser succeeds', async () => {
      mockSupabase.auth.updateUser.mockResolvedValue({ error: null });
      
      const result = await resetPasswordAction('newPassword123!');
      
      expect(createClient).toHaveBeenCalled();
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({ password: 'newPassword123!' });
      expect(result).toEqual({ success: true, message: 'Password successfully updated!' });
    });

    it('returns error when supabase updateUser fails', async () => {
      mockSupabase.auth.updateUser.mockResolvedValue({ error: { message: 'Weak password' } });
      
      const result = await resetPasswordAction('weak');
      
      expect(result).toEqual({ success: false, message: 'Weak password' });
    });
  });
});
