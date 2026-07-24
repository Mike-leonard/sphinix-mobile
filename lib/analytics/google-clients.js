import fs from 'fs/promises';
import path from 'path';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';

const credentialsPath = path.join(process.cwd(), 'data', 'google-credentials.json');

/**
 * Resolves Google Credentials from environment variables (.env / .env.local) or local JSON file
 */
export async function getGoogleAuthCredentials() {
  const envEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const envPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (envEmail && envPrivateKey) {
    return {
      type: 'env',
      credentials: {
        client_email: envEmail,
        private_key: envPrivateKey.replace(/\\n/g, '\n')
      }
    };
  }

  // Fallback to local data/google-credentials.json file
  try {
    await fs.access(credentialsPath);
    return {
      type: 'file',
      keyFilename: credentialsPath
    };
  } catch {
    return null;
  }
}

/**
 * Initializes and returns GA4 Analytics Data Client and Search Console API Client
 */
export async function getGoogleApiClients() {
  const authConfig = await getGoogleAuthCredentials();
  if (!authConfig) return null;

  if (authConfig.type === 'env') {
    const analyticsClient = new BetaAnalyticsDataClient({
      credentials: authConfig.credentials
    });

    const auth = new google.auth.GoogleAuth({
      credentials: authConfig.credentials,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const searchconsole = google.webmasters({
      version: 'v3',
      auth: auth,
    });

    return { analyticsClient, searchconsole };
  } else {
    const analyticsClient = new BetaAnalyticsDataClient({
      keyFilename: authConfig.keyFilename
    });

    const auth = new google.auth.GoogleAuth({
      keyFile: authConfig.keyFilename,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const searchconsole = google.webmasters({
      version: 'v3',
      auth: auth,
    });

    return { analyticsClient, searchconsole };
  }
}
