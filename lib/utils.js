import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const rawOrigin = process.env.NEXT_PUBLIC_BASE_URL
  || process.env.BASE_URL
  || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');



export function generateBlogSlug(title) {
  if (!title) return "";
  // Split by special characters: colon, question mark, or comma
  const parts = title.split(/[:?,]/);
  // Take the first part, trim it, convert to lowercase, and replace non-alphanumeric with hyphens
  const coreTitle = parts[0].trim();
  return coreTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const generateDeviceSlug = generateBlogSlug;
export const generateBrandSlug = generateBlogSlug;

export function formatValidImageUrl(rawSrc) {
  if (!rawSrc || typeof rawSrc !== 'string') return null;
  let src = rawSrc.trim();
  if (!src) return null;

  // Handle data URIs or relative paths starting with /
  if (src.startsWith('data:') || src.startsWith('/')) {
    return src;
  }

  const r2Domain = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || '';
  let cleanDomain = r2Domain.replace(/\/$/, '');
  if (cleanDomain && !cleanDomain.startsWith('http://') && !cleanDomain.startsWith('https://')) {
    cleanDomain = `https://${cleanDomain}`;
  }

  // Handle invalid URLs like "https://honor/magic-v6/..." or missing domain suffixes
  if (src.startsWith('http://') || src.startsWith('https://')) {
    try {
      const parsed = new URL(src);
      // Check if hostname is missing valid domain extension (e.g. "https://honor/magic-v6")
      if (!parsed.hostname.includes('.')) {
        const path = parsed.pathname.replace(/^\/+/, '');
        return cleanDomain ? `${cleanDomain}/${path}` : `/${path}`;
      }
      return src;
    } catch (e) {
      return null;
    }
  }

  // Relative path without leading slash (e.g. "honor/magic-v6/gallery/...")
  const cleanPath = src.replace(/^\/+/, '');
  if (cleanDomain) {
    return `${cleanDomain}/${cleanPath}`;
  }

  return `/${cleanPath}`;
}

export function getDeviceFirstImage(product) {
  if (!product) return null;
  
  let rawSrc = null;

  if (Array.isArray(product.deviceGallery) && product.deviceGallery.length > 0) {
    const first = product.deviceGallery[0];
    rawSrc = typeof first === 'string' ? first : first?.url || first?.src;
  }
  
  if (!rawSrc && Array.isArray(product.specs?.gallery) && product.specs.gallery.length > 0) {
    const first = product.specs.gallery[0];
    rawSrc = typeof first === 'string' ? first : first?.url || first?.src;
  }

  if (!rawSrc && Array.isArray(product.images) && product.images.length > 0) {
    rawSrc = product.images.find(img => img && typeof img === 'string' && img.trim() !== '');
  }

  if (!rawSrc && product.image && typeof product.image === 'string' && product.image.trim() !== '') {
    rawSrc = product.image;
  }

  return formatValidImageUrl(rawSrc);
}

export function getDeviceImageAlt(product) {
  if (Array.isArray(product?.imageAlts) && product.imageAlts[0]) {
    return product.imageAlts[0];
  }
  return `${product?.brand || ''} ${product?.name || ''}`.trim();
}
