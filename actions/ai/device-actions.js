'use server';

import { generateText } from '@/lib/ai/text-generator';
import { fetchPageContentWithJina, searchWebWithJina } from '@/lib/ai/jina-scraper';
import { buildOptimizedSearchQuery } from '@/lib/ai/device-query-optimizer';
import { verifySession } from '@/actions/auth';
import { getDeviceAttributes } from '@/actions/device-attributes';

/**
 * Helper to build dynamic schema map from device attributes stored in PostgreSQL
 */
async function getDeviceAttributesSchema() {
  const allAttributes = await getDeviceAttributes();

  const detailedAttributes = (allAttributes || []).filter(a => {
    const groupList = a.groupIds || [];
    return groupList.some(g => g !== 'Quick Specifications') && a.group !== 'Quick Specifications';
  });
  
  const schemaMap = {};
  detailedAttributes.forEach(a => {
    const groupList = a.groupIds || [];
    const mainGroup = a.group || groupList.find(g => g !== 'Quick Specifications') || 'General';
    schemaMap[a.slug] = `${a.name} (Group: ${mainGroup})`;
  });

  return { detailedAttributes, schemaMap };
}

/**
 * -----------------------------------------------------------------------------
 * AI DEVICE ACTION: generateDeviceData
 * -----------------------------------------------------------------------------
 * @description Auto-generates full smartphone specifications, estimated launch price, quick specs, and HTML overview using AI.
 * @why Saves administrative data entry time when adding a new phone model to the catalog.
 * @where Called by: `app/dashboard/phones/_components/editor/DeviceBasicInfo.jsx` (AI Auto-Fill button)
 * @security Session authentication required (`verifySession()`). Admin access.
 * @param {string} deviceName - Target device model name (e.g. "Galaxy S25 Ultra").
 * @param {string} brand - Device manufacturer brand (e.g. "Samsung").
 * @returns {Promise<{ success: boolean, data?: { price: string, description: string, quickSpecs: object, detailedSpecs: object }, error?: string }>}
 */
export async function generateDeviceData(deviceName, brand) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    if (!deviceName) throw new Error('Device name is required');

    const { detailedAttributes, schemaMap } = await getDeviceAttributesSchema();

    const system = `You are a highly authoritative tech expert and database scraper for Sphinix Mobile.`;
    const prompt = `
      I am adding a new smartphone/device to our database: "${brand} ${deviceName}".
      
      Generate comprehensive specifications, an estimated launch price, and an HTML overview description for this exact device. If this device has not been officially released, provide the most accurate leaked or rumored specs.

      REQUIREMENTS:
      Return the output as a strict JSON object with EXACTLY these four root keys:
      {
        "price": "Estimated launch price in USD, e.g. '$999' or 'N/A'",
        "description": "A well-written, engaging HTML overview (using <p>, <h3>, <ul>). Do not wrap in markdown.",
        "quickSpecs": {
          "screen": "e.g. 6.8 inches, AMOLED",
          "chipset": "e.g. Snapdragon 8 Gen 3",
          "camera": "e.g. 200MP + 50MP + 12MP",
          "battery": "e.g. 5000 mAh, 45W",
          "ram": "e.g. 12GB",
          "storage": "e.g. 256GB / 512GB",
          "os": "e.g. Android 14"
        },
        "detailedSpecs": {
          // Fill out as many of the following keys as you know with accurate data for this device.
          // Omit the key entirely if you have absolutely no data for it.
          // Keys MUST be chosen ONLY from this specific schema:
          ${JSON.stringify(schemaMap, null, 2).replace(/^/gm, '          ')}
        }
      }
      
      Do NOT wrap the JSON in markdown code blocks (\`\`\`json). Output ONLY valid JSON.
    `;

    let rawJson = await generateText(prompt, system, true);
    
    if (rawJson.startsWith('```json')) {
      rawJson = rawJson.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }

    const aiData = JSON.parse(rawJson);
    
    const formattedDetailedSpecs = {};
    if (aiData.detailedSpecs) {
      for (const [slug, value] of Object.entries(aiData.detailedSpecs)) {
        const attr = detailedAttributes.find(a => a.slug === slug);
        if (attr && value && typeof value === 'string') {
          const groupList = attr.groupIds || [];
          const group = attr.group || groupList.find(g => g !== 'Quick Specifications') || 'General';
          if (!formattedDetailedSpecs[group]) {
            formattedDetailedSpecs[group] = [];
          }
          formattedDetailedSpecs[group].push({
            label: attr.name,
            slug: attr.slug,
            value: value.trim()
          });
        }
      }
    }

    return { 
      success: true, 
      data: {
        price: aiData.price,
        description: aiData.description,
        quickSpecs: aiData.quickSpecs || {},
        detailedSpecs: formattedDetailedSpecs
      }
    };
  } catch (error) {
    console.error('Error generating device data:', error);
    return { success: false, error: error.message };
  }
}

/**
 * -----------------------------------------------------------------------------
 * AI DEVICE ACTION: generateDeviceDataFromUrl
 * -----------------------------------------------------------------------------
 * @description Scrapes an external GSMArena or spec page URL via Jina Reader and parses full device specs into schema format.
 * @why Enables admins to instantly import specifications from external product announcement URLs.
 * @where Called by: `app/dashboard/phones/_components/editor/DeviceBasicInfo.jsx` (Import from URL button)
 * @security Session authentication required (`verifySession()`). Admin access.
 * @param {string} url - External webpage URL to scrape specs from.
 * @returns {Promise<{ success: boolean, data?: { extractedName: string, price: string, description: string, quickSpecs: object, detailedSpecs: object }, error?: string }>}
 */
export async function generateDeviceDataFromUrl(url) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const { title: pageTitle, text: cleanText } = await fetchPageContentWithJina(url, 30000);
    const { detailedAttributes, schemaMap } = await getDeviceAttributesSchema();

    const system = `You are a highly authoritative tech expert and database scraper for Sphinix Mobile.`;
    const prompt = `
      Extract device specifications, estimated launch price, and write an HTML overview description based entirely on the following raw webpage content.
      
      Original Source Title: "${pageTitle}"
      
      Raw Content:
      ${cleanText}

      REQUIREMENTS:
      Return the output as a strict JSON object with EXACTLY these four root keys:
      {
        "price": "Estimated launch price in USD, e.g. '$999' or 'N/A'",
        "description": "A well-written, engaging HTML overview (using <p>, <h3>, <ul>). Do not wrap in markdown.",
        "quickSpecs": {
          "screen": "e.g. 6.8 inches, AMOLED",
          "chipset": "e.g. Snapdragon 8 Gen 3",
          "camera": "e.g. 200MP + 50MP + 12MP",
          "battery": "e.g. 5000 mAh, 45W",
          "ram": "e.g. 12GB",
          "storage": "e.g. 256GB / 512GB",
          "os": "e.g. Android 14"
        },
        "detailedSpecs": {
          // Fill out as many of the following keys as you can extract from the provided content.
          // Omit the key entirely if there is absolutely no data for it in the content.
          // Keys MUST be chosen ONLY from this specific schema:
          ${JSON.stringify(schemaMap, null, 2).replace(/^/gm, '          ')}
        }
      }
      
      Do NOT wrap the JSON in markdown code blocks (\`\`\`json). Output ONLY valid JSON.
    `;

    let rawJson = await generateText(prompt, system, true);
    
    if (rawJson.startsWith('```json')) {
      rawJson = rawJson.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }

    const aiData = JSON.parse(rawJson);
    
    const formattedDetailedSpecs = {};
    if (aiData.detailedSpecs) {
      for (const [slug, value] of Object.entries(aiData.detailedSpecs)) {
        const attr = detailedAttributes.find(a => a.slug === slug);
        if (attr && value && typeof value === 'string') {
          const groupList = attr.groupIds || [];
          const group = attr.group || groupList.find(g => g !== 'Quick Specifications') || 'General';
          if (!formattedDetailedSpecs[group]) {
            formattedDetailedSpecs[group] = [];
          }
          formattedDetailedSpecs[group].push({
            label: attr.name,
            slug: attr.slug,
            value: value.trim()
          });
        }
      }
    }

    return { 
      success: true, 
      data: {
        extractedName: pageTitle,
        price: aiData.price,
        description: aiData.description,
        quickSpecs: aiData.quickSpecs || {},
        detailedSpecs: formattedDetailedSpecs
      }
    };
  } catch (error) {
    console.error('Error generating device data from URL:', error);
    return { success: false, error: error.message };
  }
}

/**
 * -----------------------------------------------------------------------------
 * AI DEVICE ACTION: scrapeSourceUrl
 * -----------------------------------------------------------------------------
 * @description Scrapes external article/spec URL using Jina Reader to provide context for Notebook LLM.
 * @security Session authentication required (`verifySession()`).
 * @param {string} url - Webpage URL to scrape.
 * @returns {Promise<{ success: boolean, data?: { title: string, text: string }, error?: string }>}
 */
export async function scrapeSourceUrl(url) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    if (!url) throw new Error('URL is required');

    const { title, text } = await fetchPageContentWithJina(url, 25000);
    return { success: true, data: { title: title || 'Scraped Source', text } };
  } catch (error) {
    console.error('Error scraping source URL:', error);
    return { success: false, error: error.message };
  }
}

/**
 * -----------------------------------------------------------------------------
 * AI DEVICE ACTION: generateDeviceOverviewNotebook
 * -----------------------------------------------------------------------------
 * @description Generates a Google NotebookLM-style synthesized rich HTML overview description for a device.
 * @security Session authentication required (`verifySession()`).
 * @param {Object} options
 * @param {string} [options.deviceName] - Name of the device.
 * @param {string} [options.brand] - Brand of the device.
 * @param {Array<{ url: string, title?: string, text?: string }>} [options.sources] - Scraped source contents or URLs.
 * @param {string} [options.customPrompt] - Custom instruction or focus directive.
 * @param {string} [options.tone] - 'comprehensive' | 'highlights' | 'pros_cons' | 'executive'
 * @param {string} [options.lengthStyle] - 'concise' | 'standard' | 'indepth'
 * @returns {Promise<{ success: boolean, data?: string, error?: string }>}
 */
export async function generateDeviceOverviewNotebook({
  deviceName = '',
  brand = '',
  sources = [],
  customPrompt = '',
  tone = 'comprehensive',
  lengthStyle = 'standard'
}) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    // Scrape any sources that do not yet have extracted text
    const processedSources = await Promise.all(
      (sources || []).map(async (src) => {
        if (src.text) return src;
        if (src.url) {
          try {
            const { title, text } = await fetchPageContentWithJina(src.url, 20000);
            return { ...src, title: src.title || title, text };
          } catch (err) {
            console.warn(`Failed to scrape source ${src.url}:`, err.message);
            return null;
          }
        }
        return null;
      })
    );

    const validSources = processedSources.filter(Boolean);

    let toneInstruction = '';
    switch (tone) {
      case 'highlights':
        toneInstruction = 'Focus heavily on key highlights, standout hardware features, target audience, and buying recommendations using clear bold subheadings and structured bullet points.';
        break;
      case 'pros_cons':
        toneInstruction = 'Organize the overview around major strengths (Pros) and potential compromises/weaknesses (Cons), supported by in-depth technical context.';
        break;
      case 'executive':
        toneInstruction = 'Write a sleek, high-level executive summary tailored for tech enthusiasts and power buyers, emphasizing market positioning and overall value proposition.';
        break;
      case 'comprehensive':
      default:
        toneInstruction = 'Provide a full, well-rounded overview covering design & build quality, display performance, camera system, chipset performance, battery/charging, and software ecosystem.';
        break;
    }

    let lengthInstruction = '';
    switch (lengthStyle) {
      case 'concise':
        lengthInstruction = 'Keep the overview punchy and concise (around 250-400 words).';
        break;
      case 'indepth':
        lengthInstruction = 'Write a detailed, comprehensive tech breakdown (around 700-1000 words).';
        break;
      case 'standard':
      default:
        lengthInstruction = 'Write a balanced overview (around 450-650 words).';
        break;
    }

    let sourcesContext = '';
    if (validSources.length > 0) {
      sourcesContext = `
The user has provided ${validSources.length} external source(s) as reference context:
${validSources.map((s, idx) => `
--- SOURCE ${idx + 1}: ${s.title || s.url} ---
${s.text}
`).join('\n')}

Synthesize key specs, findings, reviewer impressions, and features from these provided sources accurately. Do not invent contradictory facts.
`;
    } else {
      sourcesContext = `
No external source links were provided. Use your authoritative internal tech knowledge about "${brand} ${deviceName}" (or general smartphone standards if specs are unknown) to generate an accurate, compelling overview description.
`;
    }

    const systemPrompt = `You are NotebookLLM for Sphinix Mobile, an expert AI research assistant and tech writer specializing in high-end consumer technology and mobile devices.`;

    const userPrompt = `
Generate an awesome, beautifully structured rich-text HTML overview for the device: "${brand} ${deviceName}".

${sourcesContext}

DIRECTIVES:
- Tone & Focus: ${toneInstruction}
- Word Count Target: ${lengthInstruction}
${customPrompt ? `- Custom User Note/Instruction: "${customPrompt}"` : ''}

HTML FORMATTING REQUIREMENTS:
1. Format output as clean, semantic HTML suitable for a TipTap rich-text editor.
2. Use <h3> for section headings (e.g. <h3>Design & Build Quality</h3>, <h3>Display & Visuals</h3>, <h3>Performance & Camera</h3>, <h3>Verdict & Key Highlights</h3>). Do NOT use <h1> or <h2>.
3. Use <p> for body paragraphs with clean transitions.
4. Use <ul> and <li> for lists of key specs or takeaways.
5. Use <strong> for emphasizing key specs or feature names.
6. Use <blockquote> for key summary callouts if appropriate.
7. Do NOT wrap output in markdown code blocks (\`\`\`html). Output ONLY the raw HTML string without extra formatting.
`;

    let htmlContent = await generateText(userPrompt, systemPrompt, false);

    if (htmlContent.startsWith('```html')) {
      htmlContent = htmlContent.replace(/^```html\n?/, '').replace(/\n?```$/, '');
    } else if (htmlContent.startsWith('```')) {
      htmlContent = htmlContent.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    return { success: true, data: htmlContent.trim() };
  } catch (error) {
    console.error('Error generating Notebook LLM overview:', error);
    return { success: false, error: error.message };
  }
}

/**
 * -----------------------------------------------------------------------------
 * AI DEVICE ACTION: generateSingleAttributeValue
 * -----------------------------------------------------------------------------
 * @description Fetches/deduces the value for a single missing specification attribute using AI.
 * @security Session authentication required (`verifySession()`).
 * @param {string} deviceName - Name of the device.
 * @param {string} brand - Brand of the device.
 * @param {string} attributeName - Attribute name (e.g. "2G Network", "GPU").
 * @param {string} [groupName] - Optional category group (e.g. "Network").
 * @returns {Promise<{ success: boolean, data?: string, error?: string }>}
 */
export async function generateSingleAttributeValue(deviceName, brand, attributeName, groupName = '') {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    if (!attributeName) throw new Error('Attribute name is required');

    const system = `You are an authoritative smartphone database scraper and tech spec assistant for Sphinix Mobile.`;
    const prompt = `
Search query focus: "${brand} ${deviceName} ${attributeName}"

Target Device: "${brand} ${deviceName}"
Attribute requested: "${attributeName}" ${groupName ? `(Category: ${groupName})` : ''}

Provide the exact, accurate specification value for "${attributeName}" for "${brand} ${deviceName}".

REQUIREMENTS:
1. Return ONLY the exact specification value (e.g., "GSM 850 / 900 / 1800 / 1900" or "Adreno 750" or "5000 mAh" or "Yes, stereo" or "Unspecified" if unknown).
2. Do NOT add labels, prefixes, markdown formatting, HTML, or explanations.
3. Keep it clean and concise, matching standard smartphone database spec formatting.
`;

    let value = await generateText(prompt, system, false);
    if (value) {
      value = value.trim().replace(/^["']|["']$/g, '');
    }
    return { success: true, data: value || '' };
  } catch (error) {
    console.error('Error generating single attribute value:', error);
    return { success: false, error: error.message };
  }
}



/**
 * -----------------------------------------------------------------------------
 * AI DEVICE ACTION: searchSingleAttributeWithWeb
 * -----------------------------------------------------------------------------
 * @description Performs a live Google/web search via Jina Search API to find real-time spec data, citations, and candidate values.
 * @security Session authentication required (`verifySession()`).
 * @param {string} deviceName
 * @param {string} brand
 * @param {string} attributeName
 * @param {string} [groupName]
 * @returns {Promise<{ success: boolean, data?: { recommendedValue: string, queryUsed: string, sources: Array<{ title: string, url: string, snippet: string }>, alternativeValues: string[] }, error?: string }>}
 */
export async function searchSingleAttributeWithWeb(deviceName, brand, attributeName, groupName = '', customQueryOverride = '') {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    if (!attributeName && !customQueryOverride) throw new Error('Attribute name or custom query is required');

    const dbAttributes = await getDeviceAttributes();
    const searchQuery = customQueryOverride.trim() || buildOptimizedSearchQuery(brand, deviceName, attributeName, groupName, dbAttributes);
    const searchResults = await searchWebWithJina(searchQuery, 6000, 1500);

    const system = `You are an expert tech reviewer and database accuracy checker for Sphinix Mobile.`;
    const prompt = `
I performed a live web search for: "${searchQuery}"

Web Search Results:
${searchResults.text}

Task:
Extract the exact, authoritative specification value for "${attributeName}" for "${brand} ${deviceName}" from the search results above.

Return a strict JSON object with EXACTLY these keys:
{
  "recommendedValue": "Exact spec value (e.g., 'March 1, 2026' or 'GSM 850 / 900 / 1800 / 1900' or 'Adreno 750'). Keep concise and standard.",
  "alternativeValues": ["Alternative regional variant if any, otherwise empty array []"],
  "sources": [
    {
      "title": "Title of source page",
      "url": "https://...",
      "snippet": "Direct excerpt or sentence from search results supporting this value"
    }
  ]
}

REQUIREMENTS:
- Do NOT wrap in markdown (\`\`\`json). Return ONLY valid JSON.
- Include up to 3 relevant source excerpts.
`;

    let rawJson = await generateText(prompt, system, true);
    if (rawJson.startsWith('```json')) {
      rawJson = rawJson.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (rawJson.startsWith('```')) {
      rawJson = rawJson.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const data = JSON.parse(rawJson);
    return {
      success: true,
      data: {
        recommendedValue: data.recommendedValue || '',
        queryUsed: searchQuery,
        sources: data.sources || [],
        alternativeValues: data.alternativeValues || []
      }
    };

  } catch (error) {
    console.error('Error in searchSingleAttributeWithWeb:', error);
    return { success: false, error: error.message };
  }
}

/**
 * -----------------------------------------------------------------------------
 * AI DEVICE ACTION: crossValidateDeviceSpecs
 * -----------------------------------------------------------------------------
 * @description Audits current filled device JSON specs against 1 or more external source web page URLs.
 * @security Session authentication required (`verifySession()`).
 * @param {string} deviceName
 * @param {string} brand
 * @param {Object} currentSpecs - Current specs state object (grouped by category)
 * @param {Array<string>} sourceUrls - List of reference webpage URLs
 * @returns {Promise<{ success: boolean, data?: { summary: { totalAudited: number, matchedCount: number, discrepancyCount: number, missingCount: number }, auditResults: Object }, error?: string }>}
 */
export async function crossValidateDeviceSpecs(deviceName, brand, currentSpecs = {}, sourceUrls = []) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    if (!sourceUrls || sourceUrls.length === 0) {
      throw new Error('At least one source URL is required for cross-validation');
    }

    // Scrape reference URLs using Jina Reader
    const scrapedSources = await Promise.all(
      sourceUrls.map(async (url) => {
        try {
          const { title, text } = await fetchPageContentWithJina(url, 45000, 8000);
          return { url, title, text };
        } catch (e) {
          console.warn(`Failed scraping ${url}:`, e.message);
          return null;
        }
      })
    );

    const validSources = scrapedSources.filter(Boolean);
    if (validSources.length === 0) {
      throw new Error('Could not fetch content from any of the provided source URLs');
    }

    const { schemaMap } = await getDeviceAttributesSchema();

    const system = `You are an expert technical specification auditor for Sphinix Mobile.`;
    const prompt = `
Audit current site specifications for "${brand} ${deviceName}" against reference webpage content.

CURRENT SITE SPECIFICATIONS:
${JSON.stringify(currentSpecs, null, 2)}

REFERENCE WEBPAGE SOURCES CONTENT:
${validSources.map((s, idx) => `
--- SOURCE ${idx + 1}: ${s.title} (${s.url}) ---
${s.text}
`).join('\n')}

AVAILABLE SCHEMA ATTRIBUTES BY CATEGORY:
${JSON.stringify(schemaMap, null, 2)}

AUDIT INSTRUCTIONS & RULES:
1. Carefully search the REFERENCE WEBPAGE SOURCES for values corresponding to every attribute.
2. Semantic Matching:
   - Treat equivalent descriptions as "matched" (e.g. site has "Stereo speakers", source has "Loudspeaker: Yes, with stereo speakers" -> "matched").
   - If site value has content and source confirms or describes it, mark "matched" and provide the source's exact spec text in "sourceValue".
   - If site value is wrong/conflicting with source, mark "discrepancy" and provide the correct "sourceValue" from reference source.
   - If site value is empty/blank but reference source has spec data, mark "missing" and provide the "sourceValue".
   - ONLY mark "unverified" if the reference text genuinely contains NO information about that spec item.

Return a strict JSON object with EXACTLY this structure:
{
  "summary": {
    "totalAudited": 40,
    "matchedCount": 30,
    "discrepancyCount": 5,
    "missingCount": 5
  },
  "auditResults": {
    "General": [
      {
        "slug": "announced",
        "name": "Announced",
        "siteValue": "2026, March",
        "sourceValue": "March 01, 2026",
        "status": "matched",
        "evidence": "Source lists Announcement date as March 01, 2026"
      }
    ]
  }
}

Output ONLY valid raw JSON. Do NOT wrap in markdown (\`\`\`json).`;

    let rawJson = await generateText(prompt, system, true);
    if (rawJson.startsWith('```json')) {
      rawJson = rawJson.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (rawJson.startsWith('```')) {
      rawJson = rawJson.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const auditData = JSON.parse(rawJson);
    return {
      success: true,
      data: auditData
    };
  } catch (error) {
    console.error('Error cross-validating device specs:', error);
    return { success: false, error: error.message };
  }
}



