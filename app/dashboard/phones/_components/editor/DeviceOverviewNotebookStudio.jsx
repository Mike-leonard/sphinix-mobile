'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Plus, 
  Trash2, 
  Link as LinkIcon, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Copy, 
  Check, 
  Sliders, 
  Globe, 
  Wand2, 
  FileText,
  Eye,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scrapeSourceUrl, generateDeviceOverviewNotebook } from '@/actions/ai';

export default function DeviceOverviewNotebookStudio({ 
  isOpen, 
  onClose, 
  deviceName = '', 
  brand = '', 
  onApplyContent 
}) {
  const [sources, setSources] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [isAddingSource, setIsAddingSource] = useState(false);
  
  const [tone, setTone] = useState('comprehensive');
  const [lengthStyle, setLengthStyle] = useState('standard');
  const [customPrompt, setCustomPrompt] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'html'
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAddSource = async () => {
    let url = urlInput.trim();
    if (!url) return;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    // Prevent duplicate URLs
    if (sources.some(s => s.url.toLowerCase() === url.toLowerCase())) {
      setErrorMsg('This source URL has already been added.');
      return;
    }

    setErrorMsg('');
    const newSource = {
      id: Date.now().toString(),
      url,
      title: url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0],
      text: '',
      status: 'scraping', // 'scraping' | 'ready' | 'error'
      active: true
    };

    setSources(prev => [...prev, newSource]);
    setUrlInput('');
    setIsAddingSource(true);

    try {
      const res = await scrapeSourceUrl(url);
      if (res.success && res.data) {
        setSources(prev => prev.map(s => {
          if (s.id === newSource.id) {
            return {
              ...s,
              title: res.data.title || s.title,
              text: res.data.text,
              status: 'ready'
            };
          }
          return s;
        }));
      } else {
        setSources(prev => prev.map(s => {
          if (s.id === newSource.id) {
            return { ...s, status: 'error', error: res.error || 'Failed to fetch page content' };
          }
          return s;
        }));
      }
    } catch (err) {
      setSources(prev => prev.map(s => {
        if (s.id === newSource.id) {
          return { ...s, status: 'error', error: err.message };
        }
        return s;
      }));
    } finally {
      setIsAddingSource(false);
    }
  };

  const handleRemoveSource = (id) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

  const handleToggleSource = (id) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleRetryScrape = async (source) => {
    setSources(prev => prev.map(s => s.id === source.id ? { ...s, status: 'scraping', error: null } : s));
    try {
      const res = await scrapeSourceUrl(source.url);
      if (res.success && res.data) {
        setSources(prev => prev.map(s => s.id === source.id ? { ...s, title: res.data.title || s.title, text: res.data.text, status: 'ready' } : s));
      } else {
        setSources(prev => prev.map(s => s.id === source.id ? { ...s, status: 'error', error: res.error } : s));
      }
    } catch (err) {
      setSources(prev => prev.map(s => s.id === source.id ? { ...s, status: 'error', error: err.message } : s));
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg('');

    // Filter active & ready sources
    const activeSources = sources.filter(s => s.active && s.status === 'ready' && s.text);

    try {
      const res = await generateDeviceOverviewNotebook({
        deviceName,
        brand,
        sources: activeSources,
        customPrompt,
        tone,
        lengthStyle
      });

      if (res.success && res.data) {
        setGeneratedHtml(res.data);
      } else {
        setErrorMsg(res.error || 'Failed to generate overview description.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedHtml) return;
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeSourceCount = sources.filter(s => s.active && s.status === 'ready').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100 ring-1 ring-purple-500/20">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Notebook LLM Studio</h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  Notebook Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Provide reference source links to synthesize or generate awesome overviews for {brand ? `${brand} ${deviceName}` : 'your device'}.
              </p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Split View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          
          {/* Left Column: Notebook Sources (5 cols) */}
          <div className="lg:col-span-5 p-5 flex flex-col gap-4 overflow-y-auto bg-slate-950/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Notebook Sources</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium bg-slate-800 px-2 py-0.5 rounded-md">
                {activeSourceCount} active
              </span>
            </div>

            {/* Add Source Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSource())}
                  placeholder="Paste review or spec URL..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              <Button
                type="button"
                onClick={handleAddSource}
                disabled={isAddingSource || !urlInput.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs px-3 shadow-md shadow-purple-600/20 shrink-0"
              >
                {isAddingSource ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </Button>
            </div>

            {/* Sources List */}
            <div className="space-y-2.5 flex-1 min-h-[140px]">
              {sources.length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-xl p-5 text-center flex flex-col items-center justify-center bg-slate-900/30">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
                    <Globe className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-medium text-slate-300">No sources added yet</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[240px]">
                    Paste web links (GSMArena, tech news, official site) to synthesize content, or click <strong>Generate</strong> below to write using internal AI knowledge.
                  </p>
                </div>
              ) : (
                sources.map((source) => (
                  <div
                    key={source.id}
                    className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      source.active
                        ? 'bg-slate-900/90 border-purple-500/40 shadow-sm'
                        : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={source.active}
                      onChange={() => handleToggleSource(source.id)}
                      className="mt-1 rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-200 truncate" title={source.title}>
                          {source.title}
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-slate-400 truncate mt-0.5" title={source.url}>
                        {source.url}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        {source.status === 'scraping' && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                            <Loader2 className="w-3 h-3 animate-spin" /> Scraping...
                          </span>
                        )}
                        {source.status === 'ready' && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Source Scraped
                          </span>
                        )}
                        {source.status === 'error' && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-red-400 font-medium">
                            <AlertCircle className="w-3 h-3 text-red-400" /> Scrape Failed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {source.status === 'error' && (
                        <button
                          type="button"
                          onClick={() => handleRetryScrape(source)}
                          className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                          title="Retry Scraping"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveSource(source.id)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
                        title="Remove Source"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Notebook Info Banner */}
            <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl text-xs text-purple-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-purple-200">Google Notebook Mode</p>
                <p className="text-[11px] text-purple-300/80 mt-0.5 leading-relaxed">
                  Notebook LLM extracts key details from checked web sources and synthesizes a complete rich-text overview tailored for mobile catalogs.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Generation Controls & Result (7 cols) */}
          <div className="lg:col-span-7 p-5 flex flex-col gap-4 overflow-y-auto bg-slate-900/60">
            
            {/* Directives & Presets Panel */}
            <div className="space-y-4 bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Generation Directives</h3>
              </div>

              {/* Tone Presets */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Overview Style & Focus</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'comprehensive', label: 'Full Review', desc: 'Design, Display, Specs & Verdict' },
                    { id: 'highlights', label: 'Key Highlights', desc: 'Hardware Standouts & Buying Advice' },
                    { id: 'pros_cons', label: 'Pros & Cons', desc: 'Strengths vs Compromises' },
                    { id: 'executive', label: 'Executive', desc: 'Sleek Tech Summary' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTone(t.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        tone === t.id
                          ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm ring-1 ring-purple-500/30'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <p className="text-xs font-bold">{t.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Length & Custom Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4 space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Target Length</label>
                  <select
                    value={lengthStyle}
                    onChange={(e) => setLengthStyle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="concise">Concise (~300w)</option>
                    <option value="standard">Standard (~550w)</option>
                    <option value="indepth">In-depth (~850w)</option>
                  </select>
                </div>

                <div className="sm:col-span-8 space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Custom Focus / Note (Optional)</label>
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Highlight gaming benchmarks, battery & night mode..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Generate Action Button */}
            <div className="flex items-center justify-between gap-4">
              {errorMsg ? (
                <p className="text-xs text-red-400 font-medium truncate flex-1" title={errorMsg}>
                  ⚠️ {errorMsg}
                </p>
              ) : (
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  Output formatted directly for TipTap Editor
                </p>
              )}

              <Button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl px-5 py-2.5 font-bold shadow-lg shadow-purple-600/30 gap-2 shrink-0 transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Notebook LLM Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
                    <span>Generate Overview</span>
                  </>
                )}
              </Button>
            </div>

            {/* Output / Preview Box */}
            <div className="flex-1 flex flex-col border border-slate-800 bg-slate-950/80 rounded-xl overflow-hidden min-h-[260px]">
              
              {/* Tab Bar & Quick Actions */}
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                      activeTab === 'preview' ? 'bg-slate-800 text-purple-300 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('html')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                      activeTab === 'html' ? 'bg-slate-800 text-purple-300 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" /> HTML
                  </button>
                </div>

                {generatedHtml && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {/* Output Content Display */}
              <div className="flex-1 p-5 overflow-y-auto max-h-[300px] text-xs">
                {isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center animate-bounce">
                        <BookOpen className="w-6 h-6 text-purple-400" />
                      </div>
                      <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
                    </div>
                    <p className="text-sm font-semibold text-slate-200">Notebook LLM is reading sources & generating description...</p>
                    <p className="text-xs text-slate-500 max-w-xs">Synthesizing device specs, features, and key takeaways into structured HTML.</p>
                  </div>
                ) : generatedHtml ? (
                  activeTab === 'preview' ? (
                    <div 
                      className="prose prose-invert max-w-none prose-sm prose-h3:text-purple-300 prose-h3:font-bold prose-h3:mt-4 prose-h3:mb-2 prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300"
                      dangerouslySetInnerHTML={{ __html: generatedHtml }}
                    />
                  ) : (
                    <pre className="font-mono text-[11px] text-slate-300 whitespace-pre-wrap break-all bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      {generatedHtml}
                    </pre>
                  )
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
                    <Wand2 className="w-8 h-8 text-slate-600 mb-2" />
                    <p className="text-xs font-medium text-slate-400">Ready to generate overview</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Select directives above and click <strong>Generate Overview</strong> to synthesize content.
                    </p>
                  </div>
                )}
              </div>

              {/* Apply / Insert Footer Buttons */}
              {generatedHtml && (
                <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      onApplyContent(generatedHtml, 'append');
                      onClose();
                    }}
                    className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs rounded-xl"
                  >
                    Append to Editor
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      onApplyContent(generatedHtml, 'replace');
                      onClose();
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/30 gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Replace Editor Content
                  </Button>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
