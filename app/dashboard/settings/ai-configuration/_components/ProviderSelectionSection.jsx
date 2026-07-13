import React from 'react';

export default function ProviderSelectionSection({ aiConfig, setAiConfig, handleProviderChange }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">AI Provider</label>
        <select
          value={aiConfig.provider}
          onChange={handleProviderChange}
          className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
        >
          <option value="gemini">Google Gemini</option>
          <option value="openai">OpenAI (ChatGPT)</option>
          <option value="anthropic">Anthropic (Claude)</option>
          <option value="openrouter">OpenRouter</option>
          <option value="kilo">Kilo Gateway</option>
          <option value="ollama">Ollama (Web & Local)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Model</label>
        <select
          value={aiConfig.model}
          onChange={e => setAiConfig({ ...aiConfig, model: e.target.value })}
          className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
        >
          {aiConfig.provider === 'gemini' && (
            <>
              <option value="gemini-3.5-flash">Gemini 3.5 Flash (Fast & Cheap)</option>
              <option value="gemini-pro-latest">Gemini Pro Latest (High Quality)</option>
            </>
          )}
          {aiConfig.provider === 'openai' && (
            <>
              <option value="gpt-4o">GPT-4o (Best overall)</option>
              <option value="gpt-4o-mini">GPT-4o Mini (Fast & Cheap)</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
            </>
          )}
          {aiConfig.provider === 'anthropic' && (
            <>
              <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</option>
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
            </>
          )}
          {aiConfig.provider === 'openrouter' && (
            <>
              <option value="openai/gpt-4o">OpenAI: GPT-4o</option>
              <option value="openai/gpt-4o-mini">OpenAI: GPT-4o Mini</option>
              <option value="anthropic/claude-3.5-sonnet">Anthropic: Claude 3.5 Sonnet</option>
              <option value="meta-llama/llama-3-8b-instruct">Meta: Llama 3 8B</option>
              <option value="meta-llama/llama-3-70b-instruct">Meta: Llama 3 70B</option>
              <option value="google/gemini-pro-1.5">Google: Gemini 1.5 Pro</option>
            </>
          )}
          {aiConfig.provider === 'kilo' && (
            <>
              <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet (via Kilo)</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku (via Kilo)</option>
              <option value="gpt-4o">GPT-4o (via Kilo)</option>
              <option value="gpt-4o-mini">GPT-4o Mini (via Kilo)</option>
              <option value="tencent/hunyuan3">Tencent Hunyuan 3 (via Kilo)</option>
              <option value="poolside/laguna">Poolside Laguna (via Kilo)</option>
            </>
          )}
          {aiConfig.provider === 'ollama' && (
            <>
              <option value="llama3">Llama 3</option>
              <option value="gemma2">Gemma 2</option>
              <option value="mistral">Mistral</option>
              <option value="phi3">Phi 3</option>
              <option value="qwen2">Qwen 2</option>
            </>
          )}
        </select>
      </div>
    </>
  );
}
