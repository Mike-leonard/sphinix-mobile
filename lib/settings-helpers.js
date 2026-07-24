export function deepMerge(target, source) {
  if (!source) return target;
  const output = { ...target };
  for (const key of Object.keys(target)) {
    if (source[key] !== undefined) {
      if (Array.isArray(target[key])) {
        output[key] = Array.isArray(source[key]) ? source[key] : target[key];
      } else if (typeof target[key] === 'object' && target[key] !== null) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
  }
  return output;
}

export function getEnvKeyAvailability() {
  return {
    gemini: !!process.env.GEMINI_API_KEY,
    openai: !!process.env.CHAT_GPT_API_KEY,
    anthropic: !!process.env.CLAUDE_API_KEY,
    openrouter: !!process.env.OPEN_ROUTER_API_KEY,
    kilo: !!process.env.KILO_CODE_API_KEY,
    ollama: !!process.env.OLLAMA_API_KEY,
  };
}

export const ENV_VAR_NAMES = {
  gemini: 'GEMINI_API_KEY',
  openai: 'CHAT_GPT_API_KEY',
  anthropic: 'CLAUDE_API_KEY',
  openrouter: 'OPEN_ROUTER_API_KEY',
  kilo: 'KILO_CODE_API_KEY',
  ollama: 'OLLAMA_API_KEY'
};
