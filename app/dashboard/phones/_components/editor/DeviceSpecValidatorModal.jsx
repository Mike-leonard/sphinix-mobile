'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Trash2, 
  Link as LinkIcon, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  X, 
  Check, 
  RefreshCw, 
  FileText,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { crossValidateDeviceSpecs } from '@/actions/ai';

export default function DeviceSpecValidatorModal({
  isOpen,
  onClose,
  deviceName = '',
  brand = '',
  specs = {},
  onApplyValidatedSpecs
}) {
  const [sourceUrls, setSourceUrls] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'discrepancy' | 'missing' | 'matched'
  const [errorMsg, setErrorMsg] = useState('');
  const [localSpecs, setLocalSpecs] = useState(specs);

  if (!isOpen) return null;

  const handleAddSourceUrl = () => {
    let url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    if (sourceUrls.includes(url)) {
      setErrorMsg('URL already added.');
      return;
    }

    setErrorMsg('');
    setSourceUrls(prev => [...prev, url]);
    setUrlInput('');
  };

  const handleRemoveSourceUrl = (urlToRemove) => {
    setSourceUrls(prev => prev.filter(u => u !== urlToRemove));
  };

  const handleRunAudit = async () => {
    if (sourceUrls.length === 0) {
      setErrorMsg('Please add at least one reference source URL to audit against.');
      return;
    }

    setIsAuditing(true);
    setErrorMsg('');

    try {
      const res = await crossValidateDeviceSpecs(deviceName, brand, specs, sourceUrls);
      if (res.success && res.data) {
        setAuditReport(res.data);
        setLocalSpecs(JSON.parse(JSON.stringify(specs)));
      } else {
        setErrorMsg(res.error || 'Failed to complete spec cross-validation');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error occurred during cross-validation');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleUpdateSingleField = (groupName, slug, attrName, newValue) => {
    const updatedSpecs = { ...localSpecs };
    const groupList = [...(updatedSpecs[groupName] || [])];
    const existingIdx = groupList.findIndex(s => s.slug === slug || s.label === attrName);

    if (existingIdx >= 0) {
      groupList[existingIdx] = { ...groupList[existingIdx], value: newValue };
    } else {
      groupList.push({ label: attrName, slug, value: newValue });
    }

    updatedSpecs[groupName] = groupList;
    setLocalSpecs(updatedSpecs);

    // Update item status in audit report
    if (auditReport?.auditResults?.[groupName]) {
      setAuditReport(prev => {
        const newResults = { ...prev.auditResults };
        newResults[groupName] = newResults[groupName].map(item => {
          if (item.slug === slug || item.name === attrName) {
            return { ...item, siteValue: newValue, status: 'matched' };
          }
          return item;
        });
        return { ...prev, auditResults: newResults };
      });
    }
  };

  const handleSyncAllDiscrepanciesAndMissing = () => {
    if (!auditReport?.auditResults) return;

    const updatedSpecs = JSON.parse(JSON.stringify(localSpecs));

    Object.entries(auditReport.auditResults).forEach(([groupName, items]) => {
      if (!updatedSpecs[groupName]) updatedSpecs[groupName] = [];
      const groupList = updatedSpecs[groupName];

      items.forEach(item => {
        if ((item.status === 'discrepancy' || item.status === 'missing') && item.sourceValue) {
          const idx = groupList.findIndex(s => s.slug === item.slug || s.label === item.name);
          if (idx >= 0) {
            groupList[idx].value = item.sourceValue;
          } else {
            groupList.push({ label: item.name, slug: item.slug, value: item.sourceValue });
          }
          item.siteValue = item.sourceValue;
          item.status = 'matched';
        }
      });
    });

    setLocalSpecs(updatedSpecs);
    onApplyValidatedSpecs(updatedSpecs);
    onClose();
  };

  const handleSaveAndClose = () => {
    onApplyValidatedSpecs(localSpecs);
    onClose();
  };

  // Flatten items for filtering
  const allAuditedItems = [];
  if (auditReport?.auditResults) {
    Object.entries(auditReport.auditResults).forEach(([groupName, items]) => {
      items.forEach(item => {
        allAuditedItems.push({ ...item, groupName });
      });
    });
  }

  const filteredItems = allAuditedItems.filter(item => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100 ring-1 ring-emerald-500/20">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Spec Cross-Validation & Accuracy Auditor</h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Accuracy Check
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Audit current catalog specifications for <strong className="text-slate-200">{brand} {deviceName}</strong> against official web sources.
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

        {/* Body Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          
          {/* Left Panel: Sources & Controls (4 cols) */}
          <div className="lg:col-span-4 p-5 flex flex-col gap-4 overflow-y-auto bg-slate-950/40">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-emerald-400" /> Reference Web Sources
              </h3>
              <p className="text-[11px] text-slate-400">
                Paste official spec links (GSMArena, Manufacturer site, etc.) to validate your filled data.
              </p>
            </div>

            {/* Input URL */}
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSourceUrl())}
                placeholder="https://www.gsmarena.com/..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <Button
                type="button"
                onClick={handleAddSourceUrl}
                disabled={!urlInput.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs px-3 shadow-md shadow-emerald-600/20 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Added Sources List */}
            <div className="space-y-2 flex-1 min-h-[120px]">
              {sourceUrls.length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-xl p-4 text-center text-xs text-slate-500 bg-slate-900/30">
                  No source URLs added yet. Paste a link above to start cross-validating.
                </div>
              ) : (
                sourceUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="text-slate-300 truncate" title={url}>{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSourceUrl(url)}
                      className="text-slate-500 hover:text-red-400 shrink-0 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 font-medium">⚠️ {errorMsg}</p>
            )}

            {/* Run Audit Action */}
            <Button
              type="button"
              onClick={handleRunAudit}
              disabled={isAuditing || sourceUrls.length === 0}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl py-2.5 text-xs shadow-lg shadow-emerald-600/30 gap-2 cursor-pointer transition-all"
            >
              {isAuditing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scraping Sources & Auditing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Start Cross-Validation Audit</span>
                </>
              )}
            </Button>
          </div>

          {/* Right Panel: Audit Report View (8 cols) */}
          <div className="lg:col-span-8 p-5 flex flex-col gap-4 overflow-y-auto bg-slate-900/60">
            
            {isAuditing ? (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center animate-bounce">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-sm font-semibold text-slate-200">Scraping web sources & auditing spec table...</p>
                <p className="text-xs text-slate-500 max-w-xs">Comparing your catalog fields against reference page data.</p>
              </div>
            ) : auditReport ? (
              <>
                {/* Audit Summary Badges & Quick Sync */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-400">Audit Status:</span>
                    <button
                      type="button"
                      onClick={() => setActiveFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        activeFilter === 'all' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      All ({allAuditedItems.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilter('discrepancy')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                        activeFilter === 'discrepancy' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-amber-400/80 hover:text-amber-300'
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" /> Discrepancies ({allAuditedItems.filter(i => i.status === 'discrepancy').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilter('missing')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                        activeFilter === 'missing' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'text-red-400/80 hover:text-red-300'
                      }`}
                    >
                      <AlertCircle className="w-3 h-3" /> Missing ({allAuditedItems.filter(i => i.status === 'missing').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilter('matched')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                        activeFilter === 'matched' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-emerald-400/80 hover:text-emerald-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" /> Verified ({allAuditedItems.filter(i => i.status === 'matched').length})
                    </button>
                  </div>

                  {(allAuditedItems.some(i => i.status === 'discrepancy' || i.status === 'missing')) && (
                    <Button
                      type="button"
                      onClick={handleSyncAllDiscrepanciesAndMissing}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold px-3 py-1.5 shadow-md shadow-emerald-600/30 gap-1 shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Sync All Missing & Fixes
                    </Button>
                  )}
                </div>

                {/* Audit Items List */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {filteredItems.length === 0 ? (
                    <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
                      No attributes found matching filter <strong className="text-slate-300">{activeFilter}</strong>.
                    </div>
                  ) : (
                    filteredItems.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                          item.status === 'discrepancy'
                            ? 'bg-amber-950/20 border-amber-500/40'
                            : item.status === 'missing'
                            ? 'bg-red-950/20 border-red-500/40'
                            : 'bg-slate-950/40 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{item.name}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                              {item.groupName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.status === 'matched' && (
                              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Verified
                              </span>
                            )}
                            {item.status === 'discrepancy' && (
                              <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Discrepancy
                              </span>
                            )}
                            {item.status === 'missing' && (
                              <span className="text-[10px] font-semibold text-red-300 bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Missing Field
                              </span>
                            )}

                            {(item.status === 'discrepancy' || item.status === 'missing') && (
                              <button
                                type="button"
                                onClick={() => handleUpdateSingleField(item.groupName, item.slug, item.name, item.sourceValue)}
                                className="text-xs font-semibold text-emerald-300 bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" /> Apply Source Value
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Values Comparison */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">Your Site Value</span>
                            <span className={item.siteValue ? "text-slate-200 font-medium" : "text-slate-600 italic"}>
                              {item.siteValue || "(Empty / Blank)"}
                            </span>
                          </div>

                          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-emerald-400 uppercase font-semibold block mb-0.5">Source Reference Value</span>
                            <span className="text-emerald-200 font-medium">
                              {item.sourceValue || "Not found in source"}
                            </span>
                          </div>
                        </div>

                        {item.evidence && (
                          <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded-lg">
                            Evidence: &quot;{item.evidence}&quot;
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Save Action */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    onClick={handleSaveAndClose}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl px-4 py-2 shadow-md shadow-emerald-600/30 gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Save Validated Specs to Form
                  </Button>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-500 space-y-2">
                <ShieldCheck className="w-10 h-10 text-slate-700" />
                <p className="text-xs font-semibold text-slate-400">Ready to Cross-Validate</p>
                <p className="text-[11px] text-slate-500 max-w-xs">
                  Paste 1 or 2 reference URLs on the left and click <strong>Start Cross-Validation Audit</strong>.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
