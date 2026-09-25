import { describe, it, expect, vi } from 'vitest';
import LegacyComparisonsPage from '@/app/(main)/comparisons/page';
import { permanentRedirect } from 'next/navigation';

vi.mock('next/navigation', () => ({
  permanentRedirect: vi.fn(),
  redirect: vi.fn()
}));

describe('LegacyComparisonsPage', () => {
  it('redirects to /compare when searchParams has no devices', async () => {
    await LegacyComparisonsPage({ searchParams: Promise.resolve({}) });
    expect(permanentRedirect).toHaveBeenCalledWith('/compare');
  });

  it('redirects to /compare/slug when searchParams has device ids', async () => {
    await LegacyComparisonsPage({ searchParams: Promise.resolve({ ids: 'galaxy-s26,iphone-17-pro' }) });
    expect(permanentRedirect).toHaveBeenCalledWith('/compare/galaxy-s26-vs-iphone-17-pro');
  });
});
