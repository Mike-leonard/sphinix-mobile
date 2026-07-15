import { describe, it, expect } from 'vitest';
import { generateBrandSlug, generateDeviceSlug } from '../lib/utils';

describe('lib/utils - Slug Generation', () => {
  it('should format brand names into slugs correctly', () => {
    expect(generateBrandSlug('Apple')).toBe('apple');
    expect(generateBrandSlug('Sony Ericsson')).toBe('sony-ericsson');
    expect(generateBrandSlug('OnePlus')).toBe('oneplus');
  });

  it('should handle special characters', () => {
    expect(generateBrandSlug('Samsung Galaxy!')).toBe('samsung-galaxy');
    expect(generateBrandSlug('Xiaomi Redmi Note 13 Pro+')).toBe('xiaomi-redmi-note-13-pro');
  });

  it('should split by specific characters to extract core title', () => {
    expect(generateDeviceSlug('iPhone 16 Pro Max: The Ultimate Phone')).toBe('iphone-16-pro-max');
    expect(generateDeviceSlug('Galaxy S24 Ultra, 512GB')).toBe('galaxy-s24-ultra');
  });

  it('should handle empty or null values safely', () => {
    expect(generateBrandSlug('')).toBe('');
    expect(generateBrandSlug(null)).toBe('');
    expect(generateBrandSlug(undefined)).toBe('');
  });
});
