import React from 'react';

export default function PromptConfigurationSection({ aiConfig, setAiConfig }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Blog Generation Guidelines (System Prompt)
        </label>
        <textarea
          rows={6}
          placeholder="E.g., You are an expert tech blog writer..."
          value={aiConfig.systemPrompt || ''}
          onChange={(e) => setAiConfig({ ...aiConfig, systemPrompt: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none resize-y"
        />
        <p className="text-xs text-slate-500 mt-2">
          Instruct the AI on the tone, personality, and format it should use when generating blog posts.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {aiConfig.provider === 'ollama' ? 'Ollama API Key (Leave blank for Localhost)' : 'API Key'}
        </label>
        <input
          type="password"
          placeholder={aiConfig.provider === 'ollama' ? 'Enter API Key for Web Ollama, or a custom URL...' : `Enter your ${aiConfig.provider} API key...`}
          value={aiConfig.apiKey || ''}
          onChange={e => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
          className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
        />
        <p className="text-xs text-slate-500 mt-2">
          Your API key is stored securely in settings.json and is never exposed to the client browser.
        </p>
      </div>
    </>
  );
}
