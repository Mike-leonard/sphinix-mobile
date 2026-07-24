'use server';

import { generateText } from '@/lib/ai/text-generator';
import { fetchPageContentWithJina } from '@/lib/ai/jina-scraper';
import { getSettings } from '@/actions/settings';
import { verifySession } from '@/actions/auth';

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
 * Generate a blog post by scraping an external URL.
 */
export async function generateBlogFromUrl(url) {
  try {
    const user = await verifySession();
    if (!user) throw new Error('Unauthorized');

    const { title: pageTitle, text: cleanText } = await fetchPageContentWithJina(url, 20000);

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
    
    return { success: true, data: { title: pageTitle.trim(), content: htmlContent.trim() } };
  } catch (error) {
    console.error('Error generating blog from URL:', error);
    return { success: false, error: error.message };
  }
}
