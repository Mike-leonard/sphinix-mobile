'use server';

import fs from 'fs/promises';
import path from 'path';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';
import { getSettings } from './settings';

const credentialsPath = path.join(process.cwd(), 'data', 'google-credentials.json');

function getDummySiteKitData() {
  // Generate 28 days of chart data
  const searchTrafficChartData = [];
  const visitorsChartData = [];
  const now = new Date();
  
  for (let i = 27; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    searchTrafficChartData.push({
      date: dateString,
      current: Math.floor(Math.random() * 50) + 10,
      previous: Math.floor(Math.random() * 40) + 5,
    });
    
    visitorsChartData.push({
      date: dateString,
      visitors: Math.floor(Math.random() * 60) + 5,
    });
  }

  return {
    setupRequired: false,
    isDummy: true,
    data: {
      activeUsers: 304,
      pageViews: 756,
      clicks: 15,
      impressions: 756,
      uniqueVisitors: 24,
      searchTrafficChartData,
      visitorsChartData,
      channelsData: [
        { name: 'Organic Search', value: 89.2, color: '#fcd34d' }, // yellow
        { name: 'Direct', value: 7.9, color: '#c084fc' }, // purple
        { name: 'Referral', value: 2.1, color: '#93c5fd' }, // blue
        { name: 'Others', value: 0.8, color: '#fca5a5' }, // red
      ],
      topContent: [
        { title: 'Free Online IELTS Mock Tests 2026', path: '/', pageviews: 72, sessions: 72, engagementRate: '12.5%', sessionDuration: '1s' },
        { title: 'IELTS LISTENING PRACTICE TEST 28', path: '/ielts-listening-practice-test-28/', pageviews: 29, sessions: 27, engagementRate: '44.44%', sessionDuration: '1m 13s' },
        { title: 'TRICKY SUMS AND PSYCHOLOGY', path: '/tricky-sums-and-psychology/', pageviews: 7, sessions: 7, engagementRate: '0%', sessionDuration: '0s' },
        { title: 'eyes on the world travel photography in the 21st century', path: '/eyes-on-the-world-travel-photography/', pageviews: 4, sessions: 5, engagementRate: '40%', sessionDuration: '2m 17s' },
        { title: 'The Megafires of California-Second Nature', path: '/the-megafires-of-california-second-nature/', pageviews: 4, sessions: 4, engagementRate: '0%', sessionDuration: '2s' },
        { title: 'The Search for the Anti-aging Pill', path: '/the-search-for-the-anti-aging-pill/', pageviews: 4, sessions: 4, engagementRate: '0%', sessionDuration: '0s' },
      ],
      topQueries: [
        { query: 'plan of learning resource centre listening answers', clicks: 8, impressions: 291 },
        { query: 'plan of learning resource centre (ground floor)', clicks: 2, impressions: 112 },
        { query: 'building made of plastic ielts listening', clicks: 0, impressions: 1 },
        { query: 'fairview lake camping centre', clicks: 0, impressions: 1 },
        { query: 'free ielts academic reading practice tests in cameroon', clicks: 0, impressions: 1 },
      ]
    }
  };
}

export async function getGoogleMetrics() {
  try {
    // 1. Check if credentials exist
    let credentialsExist = false;
    try {
      await fs.access(credentialsPath);
      credentialsExist = true;
    } catch {
      return { setupRequired: true, error: 'credentials_missing' };
    }

    // 2. Fetch settings to get Property IDs
    const settings = await getSettings();
    const ga4PropertyId = settings?.analytics?.ga4PropertyId;
    const searchConsoleUrl = settings?.analytics?.searchConsoleUrl;

    if (!ga4PropertyId || !searchConsoleUrl) {
      return { setupRequired: true, error: 'property_ids_missing' };
    }

    // Initialize API clients
    const analyticsClient = new BetaAnalyticsDataClient({
      keyFilename: credentialsPath,
    });

    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
    
    const searchconsole = google.webmasters({
      version: 'v3',
      auth: auth,
    });

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
      // We don't fail entirely, just leave them as 0, or mark partial error
    }

    // 4. Fetch Search Console Data (Last 28 days)
    let clicks = 0;
    let impressions = 0;

    try {
      // Calculate dates for GSC (needs YYYY-MM-DD)
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
