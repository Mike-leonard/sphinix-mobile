import { GoogleGenAI } from '@google/genai';
import { getSettings } from '@/actions/settings';

/**
 * Unified text generation driver supporting Gemini, OpenAI, Anthropic, OpenRouter, Kilo, and Ollama.
 */
export async function generateText(prompt, systemInstruction = '', jsonMode = false) {
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
      headers['HTTP-Referer'] = 'https://sphinix-mobile.com';
      headers['X-Title'] = 'Sphinix Mobile';
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
    let anthropicPrompt = prompt;
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
