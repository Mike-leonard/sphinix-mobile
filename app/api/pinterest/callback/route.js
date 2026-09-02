import { NextResponse } from 'next/server';
import { exchangeCodeForTokens, getPinterestUserProfile, getPinterestBoards } from '@/lib/pinterest/pinterest-client';
import { getSettings, updateSettings } from '@/actions/settings';

function getSafeBaseUrl(request) {
  // If production domain is configured, use it
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '');
  }

  const forwardedHost = request.headers.get('x-forwarded-host');
  const rawHost = forwardedHost || request.headers.get('host') || 'localhost:3000';

  // Prevent 0.0.0.0 redirects
  let host = rawHost.replace(/^0\.0\.0\.0/, 'localhost');
  if (host.includes('sphinix.xyz')) {
    return 'https://sphinix.xyz';
  }

  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const baseUrl = getSafeBaseUrl(request);
  const redirectUri = `${baseUrl}/api/pinterest/callback`;

  if (error || !code) {
    const errorMsg = error || 'Authorization was cancelled or failed';
    return NextResponse.redirect(new URL(`/dashboard/settings/social-media?pinterest_error=${encodeURIComponent(errorMsg)}`, baseUrl));
  }

  try {
    // 1. Exchange code for access & 1-year refresh token
    const tokens = await exchangeCodeForTokens({ code, redirectUri });

    // 2. Fetch user profile and boards
    const [profile, boards] = await Promise.all([
      getPinterestUserProfile(tokens.accessToken).catch(() => null),
      getPinterestBoards(tokens.accessToken).catch(() => [])
    ]);

    const settings = await getSettings();
    const currentPinterest = settings?.socialMedia?.pinterest || {};

    const defaultBoard = boards && boards.length > 0 ? boards[0] : null;

    // 3. Save to settings
    await updateSettings({
      socialMedia: {
        ...settings.socialMedia,
        pinterest: {
          enabled: true,
          autoPinPhones: currentPinterest.autoPinPhones ?? true,
          autoPinBlogs: currentPinterest.autoPinBlogs ?? true,
          boardId: currentPinterest.boardId || defaultBoard?.id || '',
          boardName: currentPinterest.boardName || defaultBoard?.name || '',
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenExpiresAt: new Date(Date.now() + (tokens.expiresIn * 1000)).toISOString(),
          username: profile?.username || ''
        }
      }
    });

    return NextResponse.redirect(new URL('/dashboard/settings/social-media?pinterest=connected', baseUrl));
  } catch (err) {
    console.error('Pinterest OAuth Callback Error:', err);
    return NextResponse.redirect(new URL(`/dashboard/settings/social-media?pinterest_error=${encodeURIComponent(err.message)}`, baseUrl));
  }
}
