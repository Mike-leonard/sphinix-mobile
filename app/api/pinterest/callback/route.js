import { NextResponse } from 'next/server';
import { exchangeCodeForTokens, getPinterestUserProfile, getPinterestBoards } from '@/lib/pinterest/pinterest-client';
import { getSettings, updateSettings } from '@/actions/settings';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/pinterest/callback`;

  if (error || !code) {
    const errorMsg = error || 'Authorization was cancelled or failed';
    return NextResponse.redirect(new URL(`/dashboard/settings/social-media?pinterest_error=${encodeURIComponent(errorMsg)}`, request.url));
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

    return NextResponse.redirect(new URL('/dashboard/settings/social-media?pinterest=connected', request.url));
  } catch (err) {
    console.error('Pinterest OAuth Callback Error:', err);
    return NextResponse.redirect(new URL(`/dashboard/settings/social-media?pinterest_error=${encodeURIComponent(err.message)}`, request.url));
  }
}
