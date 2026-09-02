'use server';

import { PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN } from '@/lib/r2-client';
import { verifySession } from '@/actions/auth';

/**
 * Utility to convert arbitrary string into a URL-friendly slug
 */
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

/**
 * Helper to deduce file extension from content-type or URL
 */
function getExtensionFromMimeOrUrl(contentType, url) {
  const mimeMap = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov'
  };

  if (contentType && mimeMap[contentType.toLowerCase()]) {
    return mimeMap[contentType.toLowerCase()];
  }

  try {
    const pathname = new URL(url).pathname;
    const ext = pathname.split('.').pop()?.toLowerCase();
    if (ext && ext.length <= 4 && /^[a-z0-9]+$/.test(ext)) {
      return ext;
    }
  } catch (e) {
    // ignore
  }

  return 'jpg';
}

/**
 * Server Action to fetch media from external URL and upload to Cloudflare R2
 * Bucket Structure: brandSlug/deviceSlug/folderType/timestamp-filename
 * Example: honor/magic-v6/gallery/178813500-honor-magic-v6-front.jpg
 * 
 * @param {Object} params
 * @param {string} params.mediaUrl - External image/video URL to download
 * @param {string} [params.brandName] - Device brand (e.g. "Honor", "Samsung")
 * @param {string} [params.deviceName] - Device model (e.g. "Magic V6", "Galaxy S26")
 * @param {string} [params.folderType="gallery"] - Media section ("gallery", "videos", "covers")
 * @returns {Promise<{ success: boolean, url?: string, key?: string, error?: string }>}
 */
export async function uploadMediaFromUrl({ mediaUrl, brandName, deviceName, folderType = 'gallery' }) {
  try {
    const user = await verifySession();
    if (!user) {
      throw new Error('Unauthorized');
    }

    if (!mediaUrl || typeof mediaUrl !== 'string') {
      throw new Error('Valid media URL is required');
    }

    if (!process.env.CLOUDFLARE_R2_ACCOUNT_ID || !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) {
      throw new Error('Cloudflare R2 storage credentials (CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID) are not configured in .env.local');
    }

    // Fetch media file server-side
    const response = await fetch(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to download media from URL (HTTP Status: ${response.status})`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      throw new Error('Downloaded media file is empty');
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const ext = getExtensionFromMimeOrUrl(contentType, mediaUrl);

    // Slugify directory components
    const brandSlug = slugify(brandName) || 'general';
    const deviceSlug = slugify(deviceName) || 'unnamed-device';
    const subFolder = slugify(folderType) || 'gallery';

    // Extract filename or create clean timestamped name
    let origFilename = 'media';
    try {
      const pathname = new URL(mediaUrl).pathname;
      const base = pathname.split('/').pop()?.split('.')[0];
      if (base) origFilename = slugify(base);
    } catch (e) {
      // ignore
    }

    const timestamp = Date.now();
    const filename = `${timestamp}-${origFilename}.${ext}`;

    // Target Key path e.g.: honor/magic-v6/gallery/178813500-honor-magic-v6-front.jpg
    const keyPath = `${brandSlug}/${deviceSlug}/${subFolder}/${filename}`;

    // Upload to Cloudflare R2 bucket
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: keyPath,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable'
    });

    await r2Client.send(command);

    // Build public CDN URL
    let publicUrl = '';
    if (R2_PUBLIC_DOMAIN) {
      let domainClean = R2_PUBLIC_DOMAIN.trim().replace(/\/$/, '');
      if (!domainClean.startsWith('http://') && !domainClean.startsWith('https://')) {
        domainClean = `https://${domainClean}`;
      }
      publicUrl = `${domainClean}/${keyPath}`;
    } else {
      const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
      publicUrl = `https://${accountId}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${keyPath}`;
    }

    return {
      success: true,
      url: publicUrl,
      key: keyPath,
      filename,
      contentType,
      size: buffer.length
    };
  } catch (error) {
    console.error('Error uploading media to Cloudflare R2:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload media to Cloudflare R2'
    };
  }
}

/**
 * Server Action to list existing media objects stored in Cloudflare R2 for a brand/device
 * 
 * @param {Object} params
 * @param {string} [params.brandName] - Device brand (e.g. "Honor")
 * @param {string} [params.deviceName] - Device model (e.g. "Magic V6")
 * @param {string} [params.folderType] - Media category ("gallery", "videos", "posters", etc.)
 * @returns {Promise<{ success: boolean, files?: Array<{ key: string, url: string, filename: string, size: number, lastModified: string }>, error?: string }>}
 */
export async function listR2MediaObjects({ brandName, deviceName, folderType } = {}) {
  try {
    const user = await verifySession();
    if (!user) {
      throw new Error('Unauthorized');
    }

    if (!process.env.CLOUDFLARE_R2_ACCOUNT_ID || !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) {
      throw new Error('Cloudflare R2 storage credentials are not configured');
    }

    const brandSlug = slugify(brandName);
    const deviceSlug = slugify(deviceName);
    const subFolder = slugify(folderType);

    // Construct prefix query e.g. "honor/magic-v6/gallery/" or "honor/magic-v6/" or "honor/"
    let prefix = '';
    if (brandSlug && deviceSlug && subFolder) {
      prefix = `${brandSlug}/${deviceSlug}/${subFolder}/`;
    } else if (brandSlug && deviceSlug) {
      prefix = `${brandSlug}/${deviceSlug}/`;
    } else if (brandSlug) {
      prefix = `${brandSlug}/`;
    }

    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: 100
    });

    const response = await r2Client.send(command);
    const contents = response.Contents || [];

    let domainClean = (R2_PUBLIC_DOMAIN || '').trim().replace(/\/$/, '');
    if (domainClean && !domainClean.startsWith('http://') && !domainClean.startsWith('https://')) {
      domainClean = `https://${domainClean}`;
    }

    const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;

    const files = contents
      .filter((item) => item.Key && !item.Key.endsWith('/'))
      .map((item) => {
        const key = item.Key;
        const filename = key.split('/').pop() || key;

        let publicUrl = '';
        if (domainClean) {
          publicUrl = `${domainClean}/${key}`;
        } else {
          publicUrl = `https://${accountId}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`;
        }

        return {
          key,
          url: publicUrl,
          filename,
          size: item.Size || 0,
          lastModified: item.LastModified ? item.LastModified.toISOString() : new Date().toISOString()
        };
      });

    return {
      success: true,
      files
    };
  } catch (error) {
    console.error('Error listing R2 objects:', error);
    return {
      success: false,
      files: [],
      error: error.message || 'Failed to list objects from Cloudflare R2'
    };
  }
}
