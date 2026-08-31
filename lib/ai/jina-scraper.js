/**
 * Helper to extract phone model keywords from official URLs (e.g. honor-magic-v6, galaxy-s26)
 * Handles client-side JS single-page applications where raw HTML is an empty shell.
 */
function extractDeviceQueryFromUrl(urlStr) {
  try {
    const parsed = new URL(urlStr);
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    const relevant = pathParts.filter(p => !['global', 'phones', 'smartphones', 'product', 'specs', 'spec', 'uk', 'us', 'en', 'mobile', 'buy'].includes(p.toLowerCase()));
    if (relevant.length > 0) {
      const rawModel = relevant[relevant.length - 1].replace(/-/g, ' ');
      const hostBrand = parsed.hostname.replace(/^www\./, '').split('.')[0];
      const brand = hostBrand.length > 2 ? hostBrand : '';
      return `${brand} ${rawModel} technical specifications`.trim();
    }
  } catch (e) {
    // ignore
  }
  return '';
}

export async function fetchPageContentWithJina(url, maxLength = 45000, tokenBudget = 8000) {
  if (!url || url.length > 2000) {
    throw new Error('Invalid URL length');
  }

  const apiKey = process.env.JINA_API_KEY;
  let cleanText = '';
  let pageTitle = "New Page";

  // 1. Primary Attempt: Jina Reader with Token-Budget headers
  const headers = {
    'Accept': 'text/plain',
    'X-With-Generated-Alt': 'false',
    'X-With-Images-Summary': 'false'
  };

  if (tokenBudget) {
    headers['X-Token-Budget'] = String(tokenBudget);
  }

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  try {
    const fetchRes = await fetch(`https://r.jina.ai/${url}`, { headers });
    if (fetchRes.ok) {
      cleanText = await fetchRes.text();
    } else {
      console.warn(`Jina Reader primary fetch returned status ${fetchRes.status} for ${url}. Retrying with clean fallback...`);
    }
  } catch (err) {
    console.warn(`Jina Reader fetch failed for ${url}:`, err.message);
  }

  // 2. Second Attempt: Clean fetch without extra X- headers if 409/403 header conflict occurred
  if (!cleanText || cleanText.length < 50) {
    try {
      const cleanHeaders = { 'Accept': 'text/plain' };
      if (apiKey) cleanHeaders['Authorization'] = `Bearer ${apiKey}`;
      const fetchRes = await fetch(`https://r.jina.ai/${url}`, { headers: cleanHeaders });
      if (fetchRes.ok) {
        cleanText = await fetchRes.text();
      }
    } catch (err) {
      console.warn(`Clean Jina fallback failed for ${url}:`, err.message);
    }
  }

  // 3. Third Attempt: Search Reader fallback if URL is protected or blocked (e.g. anti-bot 409)
  if (!cleanText || cleanText.length < 50) {
    try {
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(url)}`;
      const fetchRes = await fetch(`https://r.jina.ai/${searchUrl}`, {
        headers: { 'Accept': 'text/plain' }
      });
      if (fetchRes.ok) {
        cleanText = await fetchRes.text();
      }
    } catch (err) {
      console.warn(`DuckDuckGo fallback failed for ${url}:`, err.message);
    }
  }

  // 4. Fourth Attempt: For Client-Side JS rendered SPAs (e.g. honor.com, samsung.com), extract device keywords from URL & run live search
  const isSparse = !cleanText || cleanText.length < 300 || !/(battery|display|camera|chipset|ram|storage|processor|screen)/i.test(cleanText);
  if (isSparse) {
    const urlQuery = extractDeviceQueryFromUrl(url);
    if (urlQuery) {
      try {
        const searchRes = await searchWebWithJina(urlQuery, maxLength, tokenBudget);
        if (searchRes && searchRes.text && searchRes.text.length > 300) {
          cleanText = searchRes.text;
          pageTitle = urlQuery;
        }
      } catch (err) {
        console.warn(`URL keyword search fallback failed for ${url}:`, err.message);
      }
    }
  }

  if (!cleanText || cleanText.length < 50) {
    throw new Error(`Unable to fetch web content from URL. The target site may be blocking automated scrapers.`);
  }

  const titleMatch = cleanText.match(/^Title:\s+(.+)/im);
  if (titleMatch) {
    pageTitle = titleMatch[1].trim();
  }

  // Remove common website header/footer nav noise so spec data is prioritized
  cleanText = cleanText
    .replace(/^URL Source:.*$/gm, '')
    .replace(/^Markdown Content:.*$/gm, '')
    .replace(/\[?(?:Home|News|Reviews|Videos|Featured|Phone finder|Tools|Coverage|Contact us|Terms of use|Privacy|Cookies)\]?\(.*?\)/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (cleanText.length > maxLength) {
    cleanText = cleanText.substring(0, maxLength);
  }

  return { title: pageTitle, text: cleanText };
}

/**
 * Helper function to perform live Google/web search using Jina Search API or free Jina Reader search fallback
 */
export async function searchWebWithJina(query, maxLength = 8000, tokenBudget = 2000) {
  if (!query || query.length > 500) {
    throw new Error('Invalid query string');
  }

  const apiKey = process.env.JINA_API_KEY;
  const encodedQuery = encodeURIComponent(query.trim());

  // Token-saving & speed optimization headers
  const searchHeaders = {
    'Accept': 'text/plain',
    'X-No-Cache': 'true',
    'X-With-Generated-Alt': 'false',
    'X-With-Images-Summary': 'false',
    'X-Token-Budget': String(tokenBudget)
  };

  if (apiKey) {
    searchHeaders['Authorization'] = `Bearer ${apiKey}`;
  }

  // 1. Try Jina Search API if JINA_API_KEY is available or attempt direct request
  try {
    const fetchRes = await fetch(`https://s.jina.ai/${encodedQuery}`, {
      headers: searchHeaders
    });

    if (fetchRes.ok) {
      const cleanText = await fetchRes.text();
      return { query, text: cleanText.substring(0, maxLength) };
    }
  } catch (e) {
    console.warn('Jina Search API call failed, trying free search fallback:', e.message);
  }

  // 2. Fallback: Perform live web search using free Jina Reader via DuckDuckGo HTML search
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodedQuery}`;
    const fetchRes = await fetch(`https://r.jina.ai/${searchUrl}`, {
      headers: {
        'Accept': 'text/plain',
        'X-With-Generated-Alt': 'false',
        'X-With-Images-Summary': 'false',
        'X-Token-Budget': String(tokenBudget)
      }
    });

    if (fetchRes.ok) {
      const cleanText = await fetchRes.text();
      if (cleanText && cleanText.length > 100) {
        return { query, text: cleanText.substring(0, maxLength) };
      }
    }
  } catch (e) {
    console.warn('DuckDuckGo Jina Reader search fallback failed:', e.message);
  }

  // 3. Fallback: GSMArena direct search via Jina Reader
  try {
    const gsmUrl = `https://www.gsmarena.com/res.php3?sSearch=${encodedQuery}`;
    const fetchRes = await fetch(`https://r.jina.ai/${gsmUrl}`, {
      headers: {
        'Accept': 'text/plain',
        'X-With-Generated-Alt': 'false',
        'X-With-Images-Summary': 'false',
        'X-Token-Budget': String(tokenBudget)
      }
    });

    if (fetchRes.ok) {
      const cleanText = await fetchRes.text();
      if (cleanText && cleanText.length > 100) {
        return { query, text: cleanText.substring(0, maxLength) };
      }
    }
  } catch (e) {
    console.warn('GSMArena Jina Reader search fallback failed:', e.message);
  }

  throw new Error('Web search unavailable. Please check your network connection or add JINA_API_KEY to .env.local');
}


