import { describe, it, expect } from 'vitest';
import {
  buildComparisonSlug,
  parseComparisonSlug,
  isCanonicalComparisonSlug,
  generateComparisonPairs,
  getSuggestedComparisonsForDevice
} from '@/lib/devices/comparison-helpers';

describe('Comparison SEO Helpers', () => {
  describe('buildComparisonSlug', () => {
    it('sorts device IDs alphabetically to produce a consistent canonical slug', () => {
      const slug1 = buildComparisonSlug(['xiaomi-17t-pro', 'samsung-galaxy-s26-ultra']);
      const slug2 = buildComparisonSlug(['samsung-galaxy-s26-ultra', 'xiaomi-17t-pro']);
      expect(slug1).toBe('samsung-galaxy-s26-ultra-vs-xiaomi-17t-pro');
      expect(slug2).toBe('samsung-galaxy-s26-ultra-vs-xiaomi-17t-pro');
    });

    it('handles multi-device comparison slugs (3 devices)', () => {
      const slug = buildComparisonSlug(['xiaomi-17t-pro', 'apple-iphone-17-pro-max', 'samsung-galaxy-s26-ultra']);
      expect(slug).toBe('apple-iphone-17-pro-max-vs-samsung-galaxy-s26-ultra-vs-xiaomi-17t-pro');
    });

    it('returns empty string for empty inputs', () => {
      expect(buildComparisonSlug([])).toBe('');
      expect(buildComparisonSlug(null)).toBe('');
    });
  });

  describe('parseComparisonSlug', () => {
    it('correctly splits slug into individual IDs', () => {
      const ids = parseComparisonSlug('apple-iphone-17-pro-vs-samsung-galaxy-s26-ultra');
      expect(ids).toEqual(['apple-iphone-17-pro', 'samsung-galaxy-s26-ultra']);
    });

    it('handles Next.js catch-all array format', () => {
      const ids = parseComparisonSlug(['apple-iphone-17-pro-vs-samsung-galaxy-s26-ultra']);
      expect(ids).toEqual(['apple-iphone-17-pro', 'samsung-galaxy-s26-ultra']);
    });
  });

  describe('isCanonicalComparisonSlug', () => {
    it('returns true when slug is in alphabetical order', () => {
      expect(isCanonicalComparisonSlug('apple-iphone-17-pro-vs-samsung-galaxy-s26-ultra')).toBe(true);
    });

    it('returns false when slug is reversed', () => {
      expect(isCanonicalComparisonSlug('samsung-galaxy-s26-ultra-vs-apple-iphone-17-pro')).toBe(false);
    });
  });

  describe('generateComparisonPairs', () => {
    const mockDevices = [
      { id: 'iphone-17-pro', brandName: 'Apple', name: 'iPhone 17 Pro', updatedAt: new Date('2026-01-01') },
      { id: 'iphone-17-pro-max', brandName: 'Apple', name: 'iPhone 17 Pro Max', updatedAt: new Date('2026-01-02') },
      { id: 'galaxy-s26-ultra', brandName: 'Samsung', name: 'Galaxy S26 Ultra', updatedAt: new Date('2026-01-03') },
      { id: 'xiaomi-17t-pro', brandName: 'Xiaomi', name: 'Xiaomi 17T Pro', updatedAt: new Date('2026-01-04') },
    ];

    it('generates high-value sibling and cross-brand pairs', () => {
      const pairs = generateComparisonPairs(mockDevices, 10);
      expect(pairs.length).toBeGreaterThan(0);
      const slugs = pairs.map(p => p.slug);
      // Apple sibling
      expect(slugs).toContain('iphone-17-pro-vs-iphone-17-pro-max');
      // Cross-brand rivalry
      expect(slugs).toContain('galaxy-s26-ultra-vs-iphone-17-pro');
    });
  });

  describe('getSuggestedComparisonsForDevice', () => {
    const current = { id: 'galaxy-s26-ultra', brand: 'Samsung', name: 'Galaxy S26 Ultra' };
    const candidates = [
      { id: 'galaxy-s26-plus', brand: 'Samsung', name: 'Galaxy S26 Plus' },
      { id: 'iphone-17-pro-max', brand: 'Apple', name: 'iPhone 17 Pro Max' },
      { id: 'xiaomi-17t-pro', brand: 'Xiaomi', name: 'Xiaomi 17T Pro' },
    ];

    it('picks sibling and competitor rivals for device page recommendations', () => {
      const suggestions = getSuggestedComparisonsForDevice(current, candidates, 3);
      expect(suggestions).toHaveLength(3);
      expect(suggestions.some(s => s.competitor.brand === 'Samsung')).toBe(true);
      expect(suggestions.some(s => s.competitor.brand === 'Apple')).toBe(true);
      expect(suggestions[0].url).toContain('/compare/');
    });
  });
});
