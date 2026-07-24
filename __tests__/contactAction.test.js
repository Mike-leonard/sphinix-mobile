import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitContactForm } from '@/actions/contact';
import * as smtpModule from '@/lib/mail/smtp';
import * as rateLimitModule from '@/lib/rateLimit';

vi.mock('@/lib/mail/smtp', () => ({
  sendSupportEmail: vi.fn(),
}));

vi.mock('@/lib/rateLimit', () => ({
  checkRateLimit: vi.fn(),
}));

describe('Contact Form Server Action', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fails if required fields are missing', async () => {
    const res = await submitContactForm({ name: '', email: 'test@example.com', message: '' });
    expect(res.success).toBe(false);
    expect(res.message).toContain('all required fields');
  });

  it('fails if captcha token is missing', async () => {
    const res = await submitContactForm({ name: 'John', email: 'test@example.com', message: 'Hello', turnstileToken: '' });
    expect(res.success).toBe(false);
    expect(res.message).toContain('Captcha verification failed');
  });

  it('fails if email address format is invalid', async () => {
    const res = await submitContactForm({ name: 'John', email: 'invalid-email', message: 'Hello', turnstileToken: 'token' });
    expect(res.success).toBe(false);
    expect(res.message).toContain('valid email address');
  });

  it('fails if rate limit is exceeded', async () => {
    vi.spyOn(rateLimitModule, 'checkRateLimit').mockReturnValue({ success: false });

    const res = await submitContactForm({
      name: 'John',
      email: 'test@example.com',
      message: 'Hello',
      turnstileToken: 'token'
    });

    expect(res.success).toBe(false);
    expect(res.message).toContain('Too many submissions');
  });

  it('successfully dispatches contact email via SMTP helper', async () => {
    vi.spyOn(rateLimitModule, 'checkRateLimit').mockReturnValue({ success: true });
    vi.spyOn(smtpModule, 'sendSupportEmail').mockResolvedValue({ messageId: '12345' });

    const res = await submitContactForm({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Inquiry',
      category: 'General Enquiry',
      message: 'Test message body',
      turnstileToken: 'token'
    });

    expect(res.success).toBe(true);
    expect(smtpModule.sendSupportEmail).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      category: 'General Enquiry',
      subject: 'Inquiry',
      message: 'Test message body'
    });
  });
});
