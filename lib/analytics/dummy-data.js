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
        { name: 'Organic Search', value: 89.2, color: '#fcd34d' },
        { name: 'Direct', value: 7.9, color: '#c084fc' },
        { name: 'Referral', value: 2.1, color: '#93c5fd' },
        { name: 'Others', value: 0.8, color: '#fca5a5' },
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
