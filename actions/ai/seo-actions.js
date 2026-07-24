'use server';

import { generateText } from '@/lib/ai/text-generator';
import { verifySession } from '@/actions/auth';

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
    
    if (rawJson.startsWith('```json')) {
      rawJson = rawJson.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }

    const seoData = JSON.parse(rawJson);
    return { success: true, data: seoData };
  } catch (error) {
    console.error('Error generating device SEO:', error);
    return { success: false, error: error.message };
  }
}
