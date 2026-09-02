/**
 * Generates mock analytics & search traffic data for development / demo mode
 */
export function getDummySiteKitData() {
  const searchTrafficChartData = [];
  const visitorsChartData = [];
  const now = new Date();
  
  for (let i = 27; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    searchTrafficChartData.push({
      date: dateString,
      current: Math.floor(Math.random() * 85) + 20,
      previous: Math.floor(Math.random() * 60) + 10,
    });
    
    visitorsChartData.push({
      date: dateString,
      visitors: Math.floor(Math.random() * 120) + 30,
    });
  }

  return {
    setupRequired: false,
    isDummy: true,
    data: {
      activeUsers: 503,
      pageViews: 1842,
      clicks: 86,
      impressions: 1420,
      uniqueVisitors: 412,
      searchTrafficChartData,
      visitorsChartData,
      channelsData: [
        { name: 'Organic Search', value: 64.5, color: '#1a73e8' },
        { name: 'Direct', value: 22.1, color: '#188038' },
        { name: 'Social', value: 8.4, color: '#f9ab00' },
        { name: 'Referral', value: 5.0, color: '#ea4335' },
      ],
      locationsData: [
        { name: 'United States', value: 42.0, color: '#1a73e8' },
        { name: 'United Kingdom', value: 18.5, color: '#188038' },
        { name: 'Germany', value: 14.2, color: '#f9ab00' },
        { name: 'India', value: 12.8, color: '#ea4335' },
        { name: 'Others', value: 12.5, color: '#a855f7' }
      ],
      devicesData: [
        { name: 'Mobile', value: 71.4, color: '#1a73e8' },
        { name: 'Desktop', value: 24.2, color: '#188038' },
        { name: 'Tablet', value: 4.4, color: '#f9ab00' }
      ],
      topContent: [
        { title: 'Xiaomi 17T Pro Full Review & Specifications', path: '/phones/xiaomi/xiaomi-17t-pro', pageviews: 524, sessions: 480, engagementRate: '68.5%', sessionDuration: '2m 14s' },
        { title: 'Honor Magic V6 Ultra-Thin Foldable Review', path: '/phones/honor/honor-magic-v6', path: '/phones/honor/honor-magic-v6', pageviews: 388, sessions: 340, engagementRate: '72.1%', sessionDuration: '2m 45s' },
        { title: 'Samsung Galaxy S24 Ultra vs POCO X8 Pro Max', path: '/comparisons', pageviews: 295, sessions: 260, engagementRate: '61.0%', sessionDuration: '1m 58s' },
        { title: 'Top 10 Flagship Smartphones of 2026', path: '/blogs/top-10-flagships-2026', pageviews: 210, sessions: 195, engagementRate: '54.8%', sessionDuration: '1m 32s' },
        { title: 'MediaTek Dimensity 9500 Benchmark Analysis', path: '/blogs/dimensity-9500-benchmarks', pageviews: 165, sessions: 150, engagementRate: '59.4%', sessionDuration: '1m 40s' },
      ],
      topQueries: [
        { query: 'xiaomi 17t pro specifications review', clicks: 24, impressions: 380 },
        { query: 'honor magic v6 price and release date', clicks: 18, impressions: 290 },
        { query: 'sphinix mobile phone comparison', clicks: 15, impressions: 210 },
        { query: 'dimensity 9500 vs snapdragon 8 gen 3', clicks: 12, impressions: 185 },
        { query: 'poco x8 pro max battery test', clicks: 9, impressions: 140 },
      ]
    }
  };
}
