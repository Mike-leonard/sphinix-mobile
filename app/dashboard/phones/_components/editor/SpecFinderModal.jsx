'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  ExternalLink, 
  Check, 
  X, 
  AlertCircle, 
  ShieldCheck, 
  FileText,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { searchSingleAttributeWithWeb } from '@/actions/ai';

export default function SpecFinderModal({
  isOpen,
  onClose,
  attrName = '',
  groupName = '',
  deviceName = '',
  brand = '',
  onApplyValue
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [queryInput, setQueryInput] = useState('');

  const performSearch = async (overrideQuery = '') => {
    const targetQuery = overrideQuery || queryInput;
    if (!targetQuery.trim()) return;

    // Immediately reset search data so previous results never linger
    setIsLoading(true);
    setErrorMsg('');
    setSearchData(null);
    setSelectedValue('');

    try {
      const res = await searchSingleAttributeWithWeb(deviceName, brand, attrName, groupName, targetQuery);
      if (res.success && res.data) {
        setSearchData(res.data);
        setSelectedValue(res.data.recommendedValue || '');
        setQueryInput(res.data.queryUsed || targetQuery);
      } else {
        setErrorMsg(res.error || 'No search results found');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to perform web search');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && attrName && (deviceName || brand)) {
      const normGroup = (groupName || '').trim().toLowerCase();
      const normAttr = (attrName || '').trim().toLowerCase();

      const shouldIncludeGroup =
        groupName?.trim() &&
        !['general', 'quick specifications', 'specs', 'specifications'].includes(normGroup) &&
        !normAttr.includes(normGroup);

      const defaultQuery = [brand?.trim(), deviceName?.trim(), shouldIncludeGroup ? groupName.trim() : null, attrName?.trim()]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ');
      React.startTransition(() => {
        setIsLoading(false);
        setSearchData(null);
        setSelectedValue('');
        setErrorMsg('');
        setQueryInput(defaultQuery);
      });
    }
  }, [isOpen, attrName, deviceName, brand, groupName]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (selectedValue) {
      onApplyValue(selectedValue);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden text-slate-100 ring-1 ring-purple-500/20 flex flex-col max-h-[90vh] relative">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Live Web Spec Finder</h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full flex items-center gap-1">
                  <Globe className="w-3 h-3 text-purple-400" />
                  Live Search
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Searching Google & tech sources for <strong className="text-purple-300">{attrName}</strong> ({brand} {deviceName})
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

        {/* Top Animated Loading Progress Bar */}
        <div className="h-1 w-full bg-slate-950 overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-400 to-purple-600 animate-pulse w-full h-full" />
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Editable Search Query Bar */}
          <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2">
            <span className="shrink-0 font-semibold text-slate-500">Query:</span>
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), performSearch(queryInput))}
              placeholder="Search phrase..."
              className="flex-1 bg-transparent text-slate-200 font-medium border-none focus:outline-none focus:ring-0 p-0 text-xs"
            />
            <button
              type="button"
              onClick={() => performSearch(queryInput)}
              disabled={isLoading || !queryInput.trim()}
              className="text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-500/30 px-4 py-1.5 rounded-lg shrink-0 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>

          {isLoading ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center animate-bounce">
                <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
              </div>
              <p className="text-sm font-semibold text-slate-200">Searching web & extracting spec evidence...</p>
              <p className="text-xs text-slate-500 max-w-xs">Fetching live Google & tech spec results for <strong className="text-purple-300">&quot;{queryInput}&quot;</strong> inside app.</p>
            </div>
          ) : errorMsg ? (
            <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Search Failed</p>
                <p className="text-red-300/80 mt-1">{errorMsg}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => performSearch(queryInput)}
                  className="mt-3 text-xs border-red-500/40 text-red-200 hover:bg-red-900/40"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : searchData ? (
            <>
              {/* Selected Candidate Value */}
              <div className="space-y-2 bg-slate-950/60 border border-purple-500/30 p-4 rounded-xl shadow-sm">
                <label className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  Recommended Spec Value
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    placeholder="Enter or select value..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-purple-500"
                  />
                  <Button
                    type="button"
                    onClick={handleApply}
                    disabled={!selectedValue}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 text-xs font-bold shadow-md shadow-purple-600/30"
                  >
                    <Check className="w-4 h-4 mr-1" /> Use Value
                  </Button>
                </div>

                {/* Alternative values if any */}
                {searchData.alternativeValues?.length > 0 && (
                  <div className="pt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-slate-400 font-medium">Alternatives:</span>
                    {searchData.alternativeValues.map((alt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedValue(alt)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                      >
                        {alt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Web Sources & Citations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    In-App Web Search Results & Evidence ({searchData.sources?.length || 0})
                  </h3>
                </div>

                {searchData.sources?.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-4 bg-slate-950/40 rounded-xl border border-slate-800 text-center">
                    No web search snippets extracted. Try adjusting the query phrase above.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {searchData.sources.map((src, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 hover:border-purple-500/40 transition-colors group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-purple-400 hover:underline truncate flex items-center gap-1"
                          >
                            {src.title || src.url}
                            <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                          </a>
                          <span className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">
                            {src.url?.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                          </span>
                        </div>

                        {src.snippet && (
                          <div className="relative">
                            <p 
                              onClick={() => setSelectedValue(src.snippet)}
                              title="Click snippet text to copy into value input"
                              className="text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 font-mono leading-relaxed cursor-pointer hover:bg-purple-950/20 hover:border-purple-500/30 transition-colors"
                            >
                              &quot;{src.snippet}&quot;
                            </p>
                            <button
                              type="button"
                              onClick={() => setSelectedValue(src.snippet)}
                              className="mt-1 text-[10px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <Check className="w-3 h-3 text-purple-400" />
                              <span>Use this snippet text</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Initial Prompt State before Search button is clicked */
            <div className="py-10 text-center flex flex-col items-center justify-center space-y-3 border border-dashed border-slate-800 rounded-xl bg-slate-950/30 p-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Search className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">Ready to search live web specs</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Inspect or modify the query phrase above, then click <strong className="text-purple-300">Search</strong> to fetch live specifications inside this modal.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => performSearch(queryInput)}
                disabled={!queryInput.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold px-5 py-2 shadow-md shadow-purple-600/30 gap-1.5 cursor-pointer mt-2"
              >
                <Search className="w-4 h-4" /> Search Live Web Specs
              </Button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-slate-800 text-slate-300 hover:bg-slate-800 text-xs rounded-xl"
          >
            Cancel
          </Button>

          {searchData && (
            <Button
              type="button"
              onClick={handleApply}
              disabled={!selectedValue}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 gap-1"
            >
              <Check className="w-4 h-4" /> Apply Value to Field
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
