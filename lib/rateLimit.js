/**
 * Basic In-Memory Rate Limiter
 * 
 * NOTE: This works perfectly if you are hosting on a single VPS (Node.js). 
 * If you deploy to Vercel (Serverless/Edge), this memory map will reset frequently 
 * and won't be shared across serverless functions. For Vercel, you should replace this 
 * with @upstash/ratelimit and a Redis database.
 */

const rateLimitMap = new Map();

export function checkRateLimit(ip, maxRequests, timeWindowMinutes) {
  const now = Date.now();
  const windowMs = timeWindowMinutes * 60 * 1000;

  // Cleanup old entries to prevent memory leaks
  for (const [key, record] of rateLimitMap.entries()) {
    if (now - record.startTime > windowMs) {
      rateLimitMap.delete(key);
    }
  }

  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return { success: true };
  }

  if (now - record.startTime > windowMs) {
    // Window expired, reset
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return { success: true };
  }

  if (record.count >= maxRequests) {
    return { success: false, retryAfter: windowMs - (now - record.startTime) };
  }

  record.count += 1;
  return { success: true };
}
