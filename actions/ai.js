'use server';

import { GoogleGenAI } from '@google/genai';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { getSettings } from './settings';
import { verifySession } from './auth';

/**
 * Unified text generation function that handles Gemini, OpenAI, and Anthropic.
 */
async function generateText(prompt, systemInstruction = '', jsonMode = false) {
  const settings = await getSettings();
  if (!settings?.ai?.enableAiFeatures) {
    throw new Error('AI features are disabled in settings.');
  }

  const { provider, model, apiKey: dbApiKey } = settings.ai;

  let apiKey = dbApiKey;
  if (provider === 'gemini') {
    apiKey = process.env.GEMINI_API_KEY || dbApiKey;
  } else if (provider === 'openai') {
    apiKey = process.env.CHAT_GPT_API_KEY || dbApiKey;
  } else if (provider === 'anthropic') {
    apiKey = process.env.CLAUDE_API_KEY || dbApiKey;
  } else if (provider === 'openrouter') {
    apiKey = process.env.OPEN_ROUTER_API_KEY || dbApiKey;
  } else if (provider === 'kilo') {
    apiKey = process.env.KILO_CODE_API_KEY || dbApiKey;
  } else if (provider === 'ollama') {
    apiKey = process.env.OLLAMA_API_KEY || dbApiKey;
  }

  if (!apiKey && provider !== 'ollama') {
    throw new Error(`API Key for ${provider} is missing in .env / .env.local or settings.`);
  }

  if (provider === 'gemini') {
    const ai = new GoogleGenAI({ apiKey });
    const fullPrompt = systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt;

    const config = {};
    if (jsonMode) config.responseMimeType = 'application/json';

    const response = await ai.models.generateContent({
      model: model || 'gemini-3.5-flash',
      contents: fullPrompt,
      config
    });
    return response.text;
  }

  if (provider === 'openai' || provider === 'openrouter' || provider === 'kilo' || provider === 'ollama') {
    const messages = [];
    if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
    messages.push({ role: 'user', content: prompt });

    let defaultModel = 'gpt-4o';
    if (provider === 'openrouter') defaultModel = 'openai/gpt-4o';
    if (provider === 'ollama') defaultModel = 'llama3';

    const body = {
      model: model || defaultModel,
      messages,
      max_tokens: 2000,
    };
    if (jsonMode) body.response_format = { type: 'json_object' };

    let url = 'https://api.openai.com/v1/chat/completions';
    if (provider === 'openrouter') url = 'https://openrouter.ai/api/v1/chat/completions';
    if (provider === 'kilo') url = 'https://api.kilo.ai/api/gateway/chat/completions';
    if (provider === 'ollama') {
      if (apiKey && apiKey.startsWith('http')) {
        url = `${apiKey.replace(/\/$/, '')}/v1/chat/completions`;
      } else if (apiKey) {
        url = 'https://ollama.com/v1/chat/completions';
      } else {
        url = 'http://localhost:11434/v1/chat/completions';
      }
    }

    const headers = {
      'Content-Type': 'application/json',
    };
    if (apiKey && provider !== 'ollama') {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    if (provider === 'openrouter') {
      headers['HTTP-Referer'] = 'https://sphinix-mobile.com'; // Optional
      headers['X-Title'] = 'Sphinix Mobile'; // Optional
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const data = await res.json();
    const errorMessage = typeof data.error === 'string' ? data.error : data.error?.message;
    if (!res.ok) throw new Error(errorMessage || `${provider} API Error`);
    return data.choices[0].message.content;
  }

  if (provider === 'anthropic') {
    const messages = [{ role: 'user', content: prompt }];

    let anthropicPrompt = prompt;
    // Anthropic doesn't have a strict JSON mode flag, so we enforce it in the prompt
    if (jsonMode) {
      anthropicPrompt = `${prompt}\n\nReturn ONLY valid JSON. Do not include markdown formatting.`;
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-sonnet-20240620',
        max_tokens: 4096,
        system: systemInstruction,
        messages: [{ role: 'user', content: anthropicPrompt }],
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Anthropic API Error');
    return data.content[0].text;
  }

  throw new Error(`Unknown AI provider: ${provider}`);
}

/**
 * Generate a complete blog post HTML based on a title.
 */
export async function generateBlogFromTitle(title) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    if (!title || title.length > 500) throw new Error('Invalid title length');

    const settings = await getSettings();
    const system = settings?.ai?.systemPrompt || `You are an expert tech blog writer for Sphinix Mobile, a premium smartphone and tech review site.`;
    const prompt = `
      Write a highly engaging, structured, and informative blog post based on the following title: "${title}"
      
      REQUIREMENTS:
      1. Write the content entirely in clean HTML.
      2. Do NOT wrap the HTML in a markdown code block (no \`\`\`html).
      3. Use <h2> and <h3> for subheadings.
      4. Use <p> for paragraphs.
      5. Use <ul>, <ol>, and <li> for lists where appropriate.
      6. Use <strong> and <em> for emphasis.
      7. The article should be around 500-800 words and feel professional, analytical, yet accessible.
      8. Do NOT include an <h1> tag (the title is already handled by the page).
      9. Output ONLY the raw HTML string.
    `;

    let htmlContent = await generateText(prompt, system, false);

    // Clean up potential markdown formatting if the AI ignores instruction #2
    if (htmlContent.startsWith('```html')) {
      htmlContent = htmlContent.replace(/^```html\n?/, '').replace(/\n?```$/, '');
    }

    return { success: true, data: htmlContent.trim() };
  } catch (error) {
    console.error('Error generating blog:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate SEO metadata (Title, Description, Keywords) based on blog HTML content.
 */
export async function generateSEOFromContent(htmlContent, currentTitle) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    if (!htmlContent || htmlContent.length > 50000) throw new Error('Content too large');

    const system = `You are an expert SEO specialist.`;
    const prompt = `
      Review the following blog post HTML content and its original title.
      
      Original Title: "${currentTitle}"
      
      Content:
      ${htmlContent.substring(0, 3000)}... 
      
      Generate SEO metadata for this post.
      
      REQUIREMENTS:
      Return the output as a strict JSON object with EXACTLY these three keys:
      {
        "metaTitle": "An optimized, catchy version of the title (under 60 characters)",
        "metaDescription": "A highly clickable and engaging meta description summarizing the content (under 160 characters)",
        "keywords": "5-8 highly relevant, comma-separated keywords (e.g. 'smartphones, tech review, apple')"
      }
      Do NOT wrap the JSON in markdown code blocks. Output ONLY valid JSON.
    `;

    let rawJson = await generateText(prompt, system, true);

    // Clean up potential markdown formatting
    if (rawJson.startsWith('```json')) {
      rawJson = rawJson.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }

    const seoData = JSON.parse(rawJson);
    return { success: true, data: seoData };
  } catch (error) {
    console.error('Error generating SEO:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate a blog post by scraping an external URL.
 */
export async function generateBlogFromUrl(url) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    if (!url || url.length > 2000) throw new Error('Invalid URL length');

    // Use Jina Reader API to bypass bot protections (Cloudflare) and get clean markdown
    const fetchRes = await fetch(`https://r.jina.ai/${url}`);

    if (!fetchRes.ok) throw new Error(`Failed to fetch the URL (Status: ${fetchRes.status})`);

    let cleanText = await fetchRes.text();

    // Jina returns "Title: <title>" at the top of the markdown
    let pageTitle = "New Article";
    const titleMatch = cleanText.match(/^Title:\s+(.+)/im);
    if (titleMatch) {
      pageTitle = titleMatch[1].trim();
    }

    // Limit text to avoid blowing up context window
    if (cleanText.length > 20000) {
      cleanText = cleanText.substring(0, 20000);
    }

    const settings = await getSettings();
    const system = settings?.ai?.systemPrompt || `You are an expert tech blog writer for Sphinix Mobile, a premium smartphone and tech review site.`;

    const prompt = `
      Rewrite the following raw article content into a highly engaging, structured, and original blog post for our tech blog.
      
      Original Source Title: "${pageTitle}"
      
      Raw Content:
      ${cleanText}
      
      REQUIREMENTS:
      1. Write the content entirely in clean HTML.
      2. Do NOT wrap the HTML in a markdown code block (no \`\`\`html).
      3. Use <h2> and <h3> for subheadings.
      4. Use <p> for paragraphs.
      5. Use <ul>, <ol>, and <li> for lists where appropriate.
      6. Use <strong> and <em> for emphasis.
      7. The article should be around 500-800 words and feel professional, analytical, yet accessible.
      8. Do NOT include an <h1> tag.
      9. Output ONLY the raw HTML string.
    `;

    let htmlContent = await generateText(prompt, system, false);

    if (htmlContent.startsWith('```html')) {
      htmlContent = htmlContent.replace(/^```html\n?/, '').replace(/\n?```$/, '');
    }

    // We return both title and content so the frontend can populate the title input too
    return { success: true, data: { title: pageTitle.trim(), content: htmlContent.trim() } };
  } catch (error) {
    console.error('Error generating blog from URL:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate SEO metadata (Title, Description, Keywords) based on device details.
 */
export async function generateDeviceSEO(deviceName, brand, description) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    if (!deviceName) throw new Error('Device name is required');

    const system = `You are an expert tech SEO specialist.`;
    const prompt = `
      Review the following smartphone/device details:
      
      Name: "${brand} ${deviceName}"
      
      Description/Overview:
      ${(description || '').substring(0, 3000)}... 
      
      Generate SEO metadata for this device's product page.
      
      REQUIREMENTS:
      Return the output as a strict JSON object with EXACTLY these three keys:
      {
        "metaTitle": "An optimized, catchy product title (under 60 characters, e.g., 'Samsung Galaxy S24 Ultra Specs & Review')",
        "metaDescription": "A highly clickable and engaging meta description summarizing the device (under 160 characters)",
        "keywords": "5-8 highly relevant, comma-separated keywords (e.g. 'smartphones, specs, ${brand}, ${deviceName}')"
      }
      Do NOT wrap the JSON in markdown code blocks. Output ONLY valid JSON.
    `;

    let rawJson = await generateText(prompt, system, true);

    // Clean up potential markdown formatting
    if (rawJson.startsWith('\`\`\`json')) {
      rawJson = rawJson.replace(/^\`\`\`json\n?/, '').replace(/\n?\`\`\`$/, '');
    }

    const seoData = JSON.parse(rawJson);
    return { success: true, data: seoData };
  } catch (error) {
    console.error('Error generating device SEO:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate full device data (Price, Quick Specs, Detailed Specs, Description)
 */
export async function generateDeviceData(deviceName, brand) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    if (!deviceName) throw new Error('Device name is required');

    // Read attributes dynamically
    const attributesPath = path.join(process.cwd(), 'data', 'device-attributes.json');
    const attributesStr = await fs.promises.readFile(attributesPath, 'utf8');
    const allAttributes = JSON.parse(attributesStr);

    // Exclude attributes that ONLY belong to Quick Specifications
    const detailedAttributes = allAttributes.filter(a =>
      a.groupIds.some(g => g !== 'Quick Specifications')
    );

    // Create a compact schema map for the AI to understand what keys it can fill
    const schemaMap = {};
    detailedAttributes.forEach(a => {
      const mainGroup = a.groupIds.find(g => g !== 'Quick Specifications') || 'General';
      schemaMap[a.slug] = `${a.name} (Group: ${mainGroup})`;
    });

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

    if (rawJson.startsWith('\`\`\`json')) {
      rawJson = rawJson.replace(/^\`\`\`json\n?/, '').replace(/\n?\`\`\`$/, '');
    }

    const aiData = JSON.parse(rawJson);

    // Post-process detailed specs into frontend expected shape: { "Group Name": [ { label, slug, value } ] }
    const formattedDetailedSpecs = {};

    if (aiData.detailedSpecs) {
      for (const [slug, value] of Object.entries(aiData.detailedSpecs)) {
        const attr = detailedAttributes.find(a => a.slug === slug);
        if (attr && value && typeof value === 'string') {
          const group = attr.groupIds.find(g => g !== 'Quick Specifications') || 'General';
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
 * Generate full device data (Price, Quick Specs, Detailed Specs, Description) from an external URL
 */
export async function generateDeviceDataFromUrl(url) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');
    if (!url || url.length > 2000) throw new Error('Invalid URL length');

    // Use Jina Reader API to bypass bot protections (Cloudflare) and get clean markdown
    const fetchRes = await fetch(`https://r.jina.ai/${url}`);
    if (!fetchRes.ok) throw new Error(`Failed to fetch the URL (Status: ${fetchRes.status})`);

    let cleanText = await fetchRes.text();

    // Extract title (Brand + Name)
    let pageTitle = "New Device";
    const titleMatch = cleanText.match(/^Title:\s+(.+)/im);
    if (titleMatch) {
      pageTitle = titleMatch[1].trim();
    }

    // Limit text to avoid blowing up context window
    if (cleanText.length > 30000) {
      cleanText = cleanText.substring(0, 30000);
    }

    // Read attributes dynamically
    const attributesPath = path.join(process.cwd(), 'data', 'device-attributes.json');
    const attributesStr = await fs.promises.readFile(attributesPath, 'utf8');
    const allAttributes = JSON.parse(attributesStr);

    // Exclude attributes that ONLY belong to Quick Specifications
    const detailedAttributes = allAttributes.filter(a =>
      a.groupIds.some(g => g !== 'Quick Specifications')
    );

    // Create a compact schema map for the AI to understand what keys it can fill
    const schemaMap = {};
    detailedAttributes.forEach(a => {
      const mainGroup = a.groupIds.find(g => g !== 'Quick Specifications') || 'General';
      schemaMap[a.slug] = `${a.name} (Group: ${mainGroup})`;
    });

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

    if (rawJson.startsWith('\`\`\`json')) {
      rawJson = rawJson.replace(/^\`\`\`json\n?/, '').replace(/\n?\`\`\`$/, '');
    }

    const aiData = JSON.parse(rawJson);

    // Post-process detailed specs into frontend expected shape
    const formattedDetailedSpecs = {};
    if (aiData.detailedSpecs) {
      for (const [slug, value] of Object.entries(aiData.detailedSpecs)) {
        const attr = detailedAttributes.find(a => a.slug === slug);
        if (attr && value && typeof value === 'string') {
          const group = attr.groupIds.find(g => g !== 'Quick Specifications') || 'General';
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
