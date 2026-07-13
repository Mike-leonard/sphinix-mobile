'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { getSettings, updateSettings } from '@/actions/settings';
import { Button } from '@/components/ui/button';
import { Save, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

import AiToggleSection from './AiToggleSection';
import ProviderSelectionSection from './ProviderSelectionSection';
import PromptConfigurationSection from './PromptConfigurationSection';

export default function AiConfigurationForm() {
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
        <AiToggleSection aiConfig={aiConfig} setAiConfig={setAiConfig} />

        {aiConfig.enableAiFeatures && (
          <div className="space-y-6 p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
            <ProviderSelectionSection 
              aiConfig={aiConfig} 
              setAiConfig={setAiConfig} 
              handleProviderChange={handleProviderChange} 
            />
            <PromptConfigurationSection 
              aiConfig={aiConfig} 
              setAiConfig={setAiConfig} 
            />
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
