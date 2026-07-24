import React from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';

export default function PromptConfigurationSection({ aiConfig, setAiConfig, envMeta }) {
  const provider = aiConfig.provider || 'gemini';
  const isEnvConfigured = envMeta?.envKeysAvailable?.[provider];
  const envVarName = {
    gemini: 'GEMINI_API_KEY',
    openai: 'CHAT_GPT_API_KEY',
    anthropic: 'CLAUDE_API_KEY',
    openrouter: 'OPEN_ROUTER_API_KEY',
    kilo: 'KILO_CODE_API_KEY',
    ollama: 'OLLAMA_API_KEY'
  }[provider];

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
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {aiConfig.provider === 'ollama' ? 'Ollama API Key / Host' : 'API Key'}
          </label>
          {isEnvConfigured && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Prefilled from .env ({envVarName})
            </span>
          )}
        </div>

        <input
          type="password"
          placeholder={
            isEnvConfigured 
              ? `Using ${envVarName} from environment (.env)`
              : (aiConfig.provider === 'ollama' ? 'Enter API Key for Web Ollama, or custom URL...' : `Enter your ${aiConfig.provider} API key...`)
          }
          value={aiConfig.apiKey || ''}
          onChange={e => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
          className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
        />

        <p className="text-xs text-slate-500 mt-2 flex items-start gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          {isEnvConfigured ? (
            <span>
              <strong className="text-slate-700 dark:text-slate-300 font-medium">Configured in environment:</strong> Loaded automatically from <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-indigo-600 dark:text-indigo-400">{envVarName}</code> in your <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300">.env / .env.local</code>. You can leave this input blank or enter a custom key to override.
            </span>
          ) : (
            <span>
              Stored securely in database settings and masked from client-side bundles.
            </span>
          )}
        </p>
      </div>
    </>
  );
}
