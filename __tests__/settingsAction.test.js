import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSettings, updateSettings } from '@/actions/settings';
import * as settingsQuery from '@/queries/settings';

vi.mock('@/queries/settings', () => ({
  getSettingsRow: vi.fn(),
  updateSettingsRow: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: (fn) => fn,
}));

vi.mock('@/actions/auth', () => ({
  verifySession: vi.fn().mockResolvedValue({ role: 'Admin' }),
}));

describe('Settings Actions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getSettings merges new default advanced SEO structure into older settings data from DB', async () => {
    const olderSettingsData = {
      seo: {
        home: { title: "Old Title" },
        phones: {},
      }
    };

    vi.spyOn(settingsQuery, 'getSettingsRow').mockResolvedValue(olderSettingsData);

    const settings = await getSettings();

    expect(settings.seo.home.title).toBe("Old Title");
    expect(settings.seo.advanced).toBeDefined();
    expect(settings.seo.advanced.generateSitemap).toBe(true);
    expect(settings.seo.home.keywords).toBe("smartphone reviews, mobile specifications, phone comparisons, tech blog, latest phones, Sphinix Mobile");
  });
});
