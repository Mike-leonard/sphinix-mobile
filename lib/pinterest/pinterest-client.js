import { getSettings, updateSettings } from '@/actions/settings';

const PINTEREST_API_BASE = 'https://api.pinterest.com/v5';
const PINTEREST_AUTH_BASE = 'https://www.pinterest.com/oauth/';

/**
 * Returns Pinterest App Credentials from environment or settings
 */
export function getPinterestCredentials() {
  const clientId = process.env.PINTEREST_APP_ID || '';
  const clientSecret = process.env.PINTEREST_APP_SECRET || '';
  return { clientId, clientSecret };
}

/**
 * Generates the Pinterest OAuth Authorization URL
 */
export function getPinterestAuthUrl({ redirectUri, state = 'sphinix_pinterest_oauth' }) {
  const { clientId } = getPinterestCredentials();
  const scopes = [
    'boards:read',
    'boards:write',
    'pins:read',
    'pins:write',
    'user_accounts:read'
  ].join(',');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    state
  });

  return `${PINTEREST_AUTH_BASE}?${params.toString()}`;
}

/**
 * Exchanges authorization code for Access & 365-day Refresh Token
 */
export async function exchangeCodeForTokens({ code, redirectUri }) {
  const { clientId, clientSecret } = getPinterestCredentials();
  if (!clientId || !clientSecret) {
    throw new Error('Pinterest App ID or App Secret is missing in environment variables.');
  }

  const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri
  });

  const res = await fetch(`${PINTEREST_API_BASE}/oauth/token`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.message || data.error_description || data.error || 'Failed to exchange Pinterest authorization code');
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in || 2592000, // typically 30 days
    scope: data.scope
  };
}

/**
 * Automatically refreshes Access Token using the 1-year Refresh Token
 */
export async function refreshPinterestToken({ refreshToken }) {
  const { clientId, clientSecret } = getPinterestCredentials();
  if (!clientId || !clientSecret) {
    throw new Error('Pinterest App ID or App Secret is missing.');
  }

  const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  });

  const res = await fetch(`${PINTEREST_API_BASE}/oauth/token`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.message || data.error_description || data.error || 'Failed to refresh Pinterest access token');
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    expiresIn: data.expires_in || 2592000
  };
}

/**
 * Retrieves a valid, unexpired Access Token (auto-refreshes if close to expiring)
 */
export async function getValidAccessToken() {
  const settings = await getSettings();
  const pConfig = settings?.socialMedia?.pinterest || {};

  if (!pConfig.accessToken && !pConfig.refreshToken) {
    return null;
  }

  const now = Date.now();
  const expiresAt = pConfig.tokenExpiresAt ? new Date(pConfig.tokenExpiresAt).getTime() : 0;
  const isExpiringSoon = expiresAt - now < 300000; // 5 minutes buffer

  if (pConfig.accessToken && !isExpiringSoon) {
    return pConfig.accessToken;
  }

  // Auto-refresh token using 365-day refresh token
  if (pConfig.refreshToken) {
    try {
      const refreshed = await refreshPinterestToken({ refreshToken: pConfig.refreshToken });
      const newExpiresAt = new Date(Date.now() + (refreshed.expiresIn * 1000)).toISOString();

      await updateSettings({
        socialMedia: {
          ...settings.socialMedia,
          pinterest: {
            ...pConfig,
            accessToken: refreshed.accessToken,
            refreshToken: refreshed.refreshToken,
            tokenExpiresAt: newExpiresAt
          }
        }
      });

      return refreshed.accessToken;
    } catch (err) {
      console.error('Pinterest Auto-Refresh Error:', err);
      return pConfig.accessToken || null;
    }
  }

  return pConfig.accessToken || null;
}

/**
 * Fetches authenticated Pinterest user profile
 */
export async function getPinterestUserProfile(token) {
  const res = await fetch(`${PINTEREST_API_BASE}/user_account`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) return null;
  return await res.json();
}

/**
 * Fetches all Pinterest boards for the authenticated user
 */
export async function getPinterestBoards(token) {
  const activeToken = token || (await getValidAccessToken());
  if (!activeToken) return [];

  const res = await fetch(`${PINTEREST_API_BASE}/boards?page_size=100`, {
    headers: {
      'Authorization': `Bearer ${activeToken}`
    }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch Pinterest boards');
  }

  const data = await res.json();
  return Array.isArray(data.items) ? data.items : [];
}

/**
 * Creates a Rich Pin on Pinterest
 */
export async function createPinterestPin({ boardId, title, description, link, imageUrl }) {
  const token = await getValidAccessToken();
  if (!token) {
    throw new Error('Pinterest is not connected. Please connect your Pinterest account in Settings.');
  }

  if (!boardId) {
    throw new Error('Pinterest Board ID is required.');
  }

  if (!imageUrl) {
    throw new Error('Image URL is required to create a Pin.');
  }

  const payload = {
    board_id: boardId,
    title: (title || 'Sphinix Mobile').slice(0, 100),
    description: (description || '').slice(0, 800),
    link: link || 'https://sphinix.xyz',
    media_source: {
      source_type: 'image_url',
      url: imageUrl
    }
  };

  const res = await fetch(`${PINTEREST_API_BASE}/pins`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.details?.[0]?.message || 'Failed to create Pin on Pinterest');
  }

  return data;
}
