/**
 * Helper function to fetch clean markdown content from any external web URL using Jina Reader API
 */
export async function fetchPageContentWithJina(url, maxLength = 30000) {
  if (!url || url.length > 2000) {
    throw new Error('Invalid URL length');
  }

  const fetchRes = await fetch(`https://r.jina.ai/${url}`);
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
