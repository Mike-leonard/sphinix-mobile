/**
 * Helper function to fetch clean markdown content from any external web URL using Jina Reader API
 */
/**
 * Helper function to fetch clean markdown content from any external web URL using Jina Reader API
 */
export async function fetchPageContentWithJina(url, maxLength = 15000, tokenBudget = 4000) {
  if (!url || url.length > 2000) {
    throw new Error('Invalid URL length');
  }

  const headers = {
    'Accept': 'text/plain',
    'X-With-Generated-Alt': 'false',
    'X-With-Images-Summary': 'false',
    'X-Token-Budget': String(tokenBudget)
  };

  const apiKey = process.env.JINA_API_KEY;
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const fetchRes = await fetch(`https://r.jina.ai/${url}`, { headers });
  if (!fetchRes.ok) {
    throw new Error(`Failed to fetch the URL (Status: ${fetchRes.status})`);
  }

  let cleanText = await fetchRes.text();
  
  let pageTitle = "New Page";
  const titleMatch = cleanText.match(/^Title:\s+(.+)/im);
  if (titleMatch) {
    pageTitle = titleMatch[1].trim();
  }

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


