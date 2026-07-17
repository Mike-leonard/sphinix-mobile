import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { getSettings } from '@/actions/settings';

// Mock fs to simulate reading from data/settings.json
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  }
}));

// Mock revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Settings Actions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getSettings merges new default advanced SEO structure into older settings data', async () => {
    // Simulate an older settings file that lacks the "advanced" seo object and keywords
    const olderSettingsData = {
      seo: {
        home: { title: "Old Title" },
        phones: {},
      }
    };

    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify(olderSettingsData));

    const settings = await getSettings();

    // The old title should be preserved
    expect(settings.seo.home.title).toBe("Old Title");
    
    // The new advanced object should be merged in from defaultSettings
    expect(settings.seo.advanced).toBeDefined();
    expect(settings.seo.advanced.generateSitemap).toBe(true); // default value
    
    // The new keywords property should be present due to deep merging
    expect(settings.seo.home.keywords).toBe("smartphone reviews, mobile specifications, phone comparisons, tech blog, latest phones, Sphinix Mobile");
  });
});
