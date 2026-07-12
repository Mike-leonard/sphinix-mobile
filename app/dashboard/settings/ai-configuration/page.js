'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { getSettings, updateSettings } from '@/actions/settings';
import { Button } from '@/components/ui/button';
import { Save, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AIConfigurationPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [aiConfig, setAiConfig] = useState({
    enableAiFeatures: true,
    provider: 'gemini',
    model: 'gemini-3.5-flash',
    apiKey: '',
    temperature: 0.7,
    systemPrompt: ''
  });

  useEffect(() => {
    async function loadSettings() {
      const currentSettings = await getSettings();
      if (currentSettings?.ai) {
        setAiConfig({
          enableAiFeatures: currentSettings.ai.enableAiFeatures ?? true,
          provider: currentSettings.ai.provider || 'gemini',
          model: currentSettings.ai.model || 'gemini-3.5-flash',
          apiKey: currentSettings.ai.apiKey || '',
          temperature: currentSettings.ai.temperature ?? 0.7,
          systemPrompt: currentSettings.ai.systemPrompt || ''
        });
      }
    }
    loadSettings();
  }, []);

  const handleProviderChange = (e) => {
    const newProvider = e.target.value;
    let defaultModel = '';
    
    if (newProvider === 'gemini') defaultModel = 'gemini-3.5-flash';
    else if (newProvider === 'openai') defaultModel = 'gpt-4o';
    else if (newProvider === 'anthropic') defaultModel = 'claude-3-5-sonnet-20240620';

    setAiConfig({
      ...aiConfig,
      provider: newProvider,
      model: defaultModel
    });
  };

  const handleSave = () => {
    setMessage({ type: '', text: '' });
    
    if (aiConfig.enableAiFeatures && !aiConfig.apiKey) {
      setMessage({ type: 'error', text: 'API Key is required if AI features are enabled.' });
      return;
    }

    startTransition(async () => {
      const res = await updateSettings({ ai: aiConfig });
      if (res.success) {
        setMessage({ type: 'success', text: 'AI Configuration saved successfully!' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to save settings.' });
      }
    });
  };

  return (
    <div>
      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          AI Configuration
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
          Select your preferred AI provider for generating blog content and SEO metadata.
        </p>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-xl flex items-start gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="space-y-6 max-w-2xl">
        {/* Enable AI Features Toggle */}
        <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
          <div className="relative flex items-center">
            <input 
              type="checkbox" 
              checked={aiConfig.enableAiFeatures} 
              onChange={e => setAiConfig({ ...aiConfig, enableAiFeatures: e.target.checked })} 
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white text-sm">Enable AI Generation</div>
            <div className="text-xs text-slate-500">Allow the use of AI tools in the blog editor.</div>
          </div>
        </label>

        {aiConfig.enableAiFeatures && (
          <div className="space-y-6 p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
            
            {/* Provider Selection */}
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

            {/* Model Selection */}
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

            {/* API Key */}
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
          </div>
        )}

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button 
            type="button" 
            onClick={handleSave} 
            disabled={isPending}
            className="gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white"
          >
            <Save className="w-4 h-4" />
            {isPending ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>
    </div>
  );
}
