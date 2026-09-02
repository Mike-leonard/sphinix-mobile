'use server';

import { getSettings, updateSettings } from './settings';
import { verifySession } from './auth';
import { getPinterestAuthUrl, getPinterestBoards, createPinterestPin } from '@/lib/pinterest/pinterest-client';
import { getDeviceFirstImage, generateBrandSlug, generateDeviceSlug } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

/**
 * Generates OAuth Authorization URL for Admin to connect Pinterest
 */
export async function getPinterestAuthLinkAction(redirectUri) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const url = await getPinterestAuthUrl({ redirectUri });
    return { success: true, url };
  } catch (error) {
    console.error('Error generating Pinterest auth URL:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetches user's Pinterest boards
 */
export async function fetchPinterestBoardsAction() {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const boards = await getPinterestBoards();
    return { success: true, boards };
  } catch (error) {
    console.error('Error fetching Pinterest boards:', error);
    return { success: false, error: error.message, boards: [] };
  }
}

/**
 * Disconnects Pinterest from Settings
 */
export async function disconnectPinterestAction() {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const settings = await getSettings();
    await updateSettings({
      socialMedia: {
        ...settings.socialMedia,
        pinterest: {
          enabled: false,
          autoPinPhones: false,
          autoPinBlogs: false,
          boardId: '',
          boardName: '',
          accessToken: '',
          refreshToken: '',
          tokenExpiresAt: null,
          username: ''
        }
      }
    });

    revalidatePath('/dashboard/settings/social-media');
    return { success: true };
  } catch (error) {
    console.error('Error disconnecting Pinterest:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends a live test Pin to Pinterest to verify connection
 */
export async function sendTestPinAction() {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const settings = await getSettings();
    const pConfig = settings?.socialMedia?.pinterest;

    if (!pConfig?.boardId) {
      throw new Error('Please select a target Pinterest board first.');
    }

    // Try to get first image from a published smartphone or high-res tech photo
    let testImageUrl = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop';
    try {
      const { getAllDevicesQuery } = await import('@/queries/devices');
      const devices = await getAllDevicesQuery({ viewMode: 'published' });
      if (devices && devices.length > 0) {
        const sampleImg = getDeviceFirstImage(devices[0]);
        if (sampleImg && sampleImg.startsWith('http')) testImageUrl = sampleImg;
      }
    } catch (_) {}

    const pin = await createPinterestPin({
      boardId: pConfig.boardId,
      title: 'Sphinix Mobile — Next-Gen Smartphone Specs & Reviews',
      description: 'Discover in-depth smartphone reviews, comparisons, and mobile specs on Sphinix Mobile. #Smartphones #TechNews #MobileReviews',
      link: 'https://sphinix.xyz',
      imageUrl: testImageUrl
    });

    return { success: true, pin };
  } catch (error) {
    console.error('Error sending test pin:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Automatically pins a newly published smartphone to Pinterest
 */
export async function autoPinDeviceToPinterest(device) {
  try {
    const settings = await getSettings();
    const pConfig = settings?.socialMedia?.pinterest;

    if (!pConfig?.enabled || !pConfig?.autoPinPhones || !pConfig?.boardId) {
      return { success: false, reason: 'Auto-pinning is disabled or not configured' };
    }

    const imageUrl = getDeviceFirstImage(device);
    if (!imageUrl) {
      return { success: false, reason: 'Device has no valid image to pin' };
    }

    const brandName = device.brandName || device.brand || 'Smartphone';
    const deviceName = device.name || 'Flagship';
    const brandSlug = generateBrandSlug(brandName);
    const deviceSlug = generateDeviceSlug(deviceName);

    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://sphinix.xyz').replace(/\/$/, '');
    const link = `${baseUrl}/phones/${brandSlug}/${deviceSlug}`;

    const specs = (device.specs && typeof device.specs === 'object') ? device.specs : {};
    const chipset = specs.processor || specs.chipset || specs.cpu || '';
    const camera = specs.camera || specs.mainCamera || '';
    const battery = specs.battery || specs.batteryCapacity || '';

    const specSummary = [chipset, camera, battery].filter(Boolean).join(' • ');

    const brandTag = brandName.replace(/\s+/g, '');
    const description = `${deviceName} full specifications, camera tests, and review. ${specSummary ? `Specs: ${specSummary}.` : ''} Read the complete review on Sphinix Mobile! #Smartphones #TechNews #${brandTag} #SphinixMobile`;

    const title = `${brandName} ${deviceName} — Full Specs & Review`;

    const pin = await createPinterestPin({
      boardId: pConfig.boardId,
      title,
      description,
      link,
      imageUrl
    });

    console.log(`[Pinterest Auto-Pin] Successfully created Pin for ${deviceName} (Pin ID: ${pin.id})`);
    return { success: true, pinId: pin.id };
  } catch (error) {
    console.error('[Pinterest Auto-Pin Error] Failed to auto-pin device:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Automatically pins a newly published blog article to Pinterest
 */
export async function autoPinBlogToPinterest(blog) {
  try {
    const settings = await getSettings();
    const pConfig = settings?.socialMedia?.pinterest;

    if (!pConfig?.enabled || !pConfig?.autoPinBlogs || !pConfig?.boardId) {
      return { success: false, reason: 'Auto-pinning for blogs is disabled' };
    }

    const imageUrl = blog.coverImage || blog.image;
    if (!imageUrl) {
      return { success: false, reason: 'Blog has no cover image to pin' };
    }

    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://sphinix.xyz').replace(/\/$/, '');
    const link = `${baseUrl}/blogs/${blog.slug}`;

    const description = `${blog.excerpt || blog.title}. Read the full article on Sphinix Mobile! #TechBlog #Smartphones #MobileNews`;

    const pin = await createPinterestPin({
      boardId: pConfig.boardId,
      title: (blog.title || 'Latest Tech Article').slice(0, 100),
      description,
      link,
      imageUrl
    });

    console.log(`[Pinterest Auto-Pin] Successfully created Pin for Blog "${blog.title}" (Pin ID: ${pin.id})`);
    return { success: true, pinId: pin.id };
  } catch (error) {
    console.error('[Pinterest Auto-Pin Error] Failed to auto-pin blog:', error.message);
    return { success: false, error: error.message };
  }
}
