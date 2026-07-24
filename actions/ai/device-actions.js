'use server';

import { generateText } from '@/lib/ai/text-generator';
import { fetchPageContentWithJina } from '@/lib/ai/jina-scraper';
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
 * Generate full device data (Price, Quick Specs, Detailed Specs, Description)
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
 * Generate full device data (Price, Quick Specs, Detailed Specs, Description) from an external URL
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
