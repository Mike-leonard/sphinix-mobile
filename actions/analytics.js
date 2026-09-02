'use server';

import { getGoogleApiClients } from '@/lib/analytics/google-clients';
import { getDummySiteKitData } from '@/lib/analytics/dummy-data';
import { getSettings } from './settings';
import { verifySession } from './auth';

export { getDummySiteKitData };

/**
 * -----------------------------------------------------------------------------
 * ANALYTICS ACTION: getGoogleMetrics
 * -----------------------------------------------------------------------------
 * @description Fetches 28-day active users, page views, search clicks, and impressions from Google Analytics 4 & Search Console APIs.
 * @why Powers the admin Site Kit overview metrics widget on the dashboard home page.
 * @where Called by: `app/dashboard/_components/widgets/GoogleSiteKitWidget.jsx`
 * @security Restricted to authenticated admin sessions (`verifySession()`).
 * @returns {Promise<{ setupRequired: boolean, data?: { activeUsers: number, pageViews: number, clicks: number, impressions: number }, error?: string }>}
 */
export async function getGoogleMetrics() {
  try {
    const session = await verifySession();
    if (!session) {
      return { setupRequired: true, error: 'Unauthorized. Admin access required.' };
    }
    // 1. Initialize API clients from .env or data/google-credentials.json
    const apiClients = await getGoogleApiClients();
    if (!apiClients) {
      return getDummySiteKitData();
    }

    const { analyticsClient, searchconsole } = apiClients;

    // 2. Fetch settings or .env for Property IDs & Site URL
    const settings = await getSettings();
    const ga4PropertyId = process.env.GA4_PROPERTY_ID || settings?.analytics?.googleAnalyticsId || settings?.analytics?.ga4PropertyId;
    const searchConsoleUrl = process.env.SEARCH_CONSOLE_SITE_URL || settings?.analytics?.searchConsoleUrl;

    if (!ga4PropertyId || !searchConsoleUrl) {
      return getDummySiteKitData();
    }

    // 3. Fetch GA4 Data (Last 28 days)
    let activeUsers = 0;
    let pageViews = 0;
    
    try {
      const [gaResponse] = await analyticsClient.runReport({
        property: `properties/${ga4PropertyId}`,
        dateRanges: [
          {
            startDate: '28daysAgo',
            endDate: 'today',
          },
        ],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' }
        ],
      });
      
      if (gaResponse && gaResponse.rows && gaResponse.rows.length > 0) {
        activeUsers = parseInt(gaResponse.rows[0].metricValues[0].value, 10) || 0;
        pageViews = parseInt(gaResponse.rows[0].metricValues[1].value, 10) || 0;
      }
    } catch (e) {
      console.error('GA4 Fetch Error:', e);
    }

    // 4. Fetch Search Console Data (Last 28 days)
    let clicks = 0;
    let impressions = 0;

    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 28);

      const scResponse = await searchconsole.searchanalytics.query({
        siteUrl: searchConsoleUrl,
        requestBody: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          dimensions: ['date'],
        },
      });

      if (scResponse.data && scResponse.data.rows) {
        clicks = scResponse.data.rows.reduce((sum, row) => sum + row.clicks, 0);
        impressions = scResponse.data.rows.reduce((sum, row) => sum + row.impressions, 0);
      }
    } catch (e) {
      console.error('Search Console Fetch Error:', e);
    }

    return {
      setupRequired: false,
      data: {
        activeUsers,
        pageViews,
        clicks,
        impressions
      }
    };
  } catch (error) {
    console.error('Error fetching Google Metrics:', error);
    return { setupRequired: true, error: 'unknown_error' };
  }
}
