'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { UploadCloud, Link as LinkIcon, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon, Video as VideoIcon, X, FolderOpen, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadMediaFromUrl, listR2MediaObjects } from '@/actions/media-actions';

/**
 * Dual-Mode Modal allowing users to:
 * 1. Browse & Select existing images/videos stored in Cloudflare R2 under brand/device folders.
 * 2. Import external image/video URLs into Cloudflare R2.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onMediaUploaded - Callback with selected/uploaded R2 public URL
 * @param {string} [props.brandName] - Smartphone brand (e.g. "Honor")
 * @param {string} [props.deviceName] - Smartphone model (e.g. "Magic V6")
 * @param {string} [props.defaultFolderType="gallery"] - Subfolder type ("gallery", "videos", "posters")
 */
export default function R2MediaImporterModal({
  isOpen,
  onClose,
  onMediaUploaded,
  brandName = '',
  deviceName = '',
  defaultFolderType = 'gallery',
  targetIdx = null
}) {
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'import'
  const [mediaUrl, setMediaUrl] = useState('');
  const [folderType, setFolderType] = useState(defaultFolderType);
  
  // Library state
  const [existingFiles, setExistingFiles] = useState([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState('');
  const [libraryError, setLibraryError] = useState('');

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');
  const [successUrl, setSuccessUrl] = useState('');

  // Fetch library objects when modal opens or folderType/brandName/deviceName changes
  const fetchR2Library = useCallback(async () => {
    setIsLoadingLibrary(true);
    setLibraryError('');
    setSelectedFileUrl('');

    try {
      const res = await listR2MediaObjects({
        brandName,
        deviceName,
        folderType
      });

      if (res.success) {
        setExistingFiles(res.files || []);
      } else {
        setLibraryError(res.error || 'Could not fetch files from Cloudflare R2');
      }
    } catch (err) {
      setLibraryError(err.message || 'Error loading R2 media library');
    } finally {
      setIsLoadingLibrary(false);
    }
  }, [brandName, deviceName, folderType]);

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      listR2MediaObjects({ brandName, deviceName, folderType })
        .then((res) => {
          if (isMounted) {
            if (res.success) {
              setExistingFiles(res.files || []);
              setLibraryError('');
            } else {
              setLibraryError(res.error || 'Could not fetch files from Cloudflare R2');
            }
          }
        })
        .catch((err) => {
          if (isMounted) {
            setLibraryError(err.message || 'Error loading R2 media library');
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsLoadingLibrary(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, brandName, deviceName, folderType]);

  if (!isOpen) return null;

  const handleUploadNew = async () => {
    if (!mediaUrl.trim()) return;

    setIsUploading(true);
    setUploadErrorMsg('');
    setSuccessUrl('');

    try {
      const res = await uploadMediaFromUrl({
        mediaUrl: mediaUrl.trim(),
        brandName,
        deviceName,
        folderType
      });

      if (!res.success) {
        throw new Error(res.error || 'Failed to upload media to Cloudflare R2');
      }

      setSuccessUrl(res.url);
      if (onMediaUploaded) {
        onMediaUploaded(res.url, targetIdx);
      }

      setTimeout(() => {
        setIsUploading(false);
        setMediaUrl('');
        setSuccessUrl('');
        onClose();
      }, 1000);
    } catch (err) {
      setUploadErrorMsg(err.message || 'Error downloading and uploading media link');
      setIsUploading(false);
    }
  };

  const handleSelectExistingFile = (fileUrl) => {
    setSelectedFileUrl(fileUrl);
    if (onMediaUploaded) {
      onMediaUploaded(fileUrl, targetIdx);
    }
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden text-slate-100 ring-1 ring-purple-500/20 flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-500/20">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Cloudflare R2 Media Library</h3>
              <p className="text-[11px] text-slate-400">
                Directory: <strong className="text-purple-300">{brandName || 'brand'}/{deviceName || 'model'}/{folderType}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category & Mode Bar */}
        <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          
          {/* Subfolder Category Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Folder:</span>
            <button
              type="button"
              onClick={() => setFolderType('gallery')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                folderType === 'gallery'
                  ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3 h-3" /> Gallery
            </button>
            <button
              type="button"
              onClick={() => setFolderType('videos')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                folderType === 'videos'
                  ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <VideoIcon className="w-3 h-3" /> Videos
            </button>
            <button
              type="button"
              onClick={() => setFolderType('posters')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                folderType === 'posters'
                  ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <UploadCloud className="w-3 h-3" /> Posters
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto justify-center">
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Browse R2 Media ({existingFiles.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('import')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'import'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              + Import New URL
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* TAB 1: Existing R2 Media Library */}
          {activeTab === 'library' && (
            <div className="space-y-3">
              {(!process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || existingFiles.some(f => f.url?.includes('cloudflarestorage.com'))) && (
                <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-200">Public R2 Domain Required for Browser Image Preview</p>
                    <p className="text-amber-300/80 mt-0.5 leading-relaxed">
                      Cloudflare R2 buckets are private by default, so <code className="text-amber-200 font-mono">*.cloudflarestorage.com</code> S3 URLs return <strong>403 Forbidden</strong> in web browsers.
                      Enable <strong>R2.dev Subdomain</strong> in Cloudflare Dashboard (R2 ➔ sphinix-mobile ➔ Settings ➔ Public Access) and add <code className="text-amber-200 font-mono">NEXT_PUBLIC_R2_PUBLIC_DOMAIN=&quot;https://pub-xxx.r2.dev&quot;</code> to <code className="text-amber-200 font-mono">.env.local</code>.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Select any existing media file from your R2 storage bucket:
                </p>
                <button
                  type="button"
                  onClick={fetchR2Library}
                  disabled={isLoadingLibrary}
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingLibrary ? 'animate-spin' : ''}`} /> Refresh
                </button>
              </div>

              {isLoadingLibrary ? (
                <div className="py-12 text-center flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                  <p className="text-xs text-slate-400 font-medium">Scanning R2 bucket storage...</p>
                </div>
              ) : libraryError ? (
                <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Library Fetch Failed</p>
                    <p className="text-red-300/80 mt-0.5">{libraryError}</p>
                  </div>
                </div>
              ) : existingFiles.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center space-y-3 bg-slate-950/30">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-300">No R2 files found in this folder</p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-1">
                      No uploaded files found under <code className="text-purple-300 font-mono">{brandName || 'brand'}/{deviceName || 'model'}/{folderType}</code>. Switch to <strong>+ Import New URL</strong> tab to save media.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setActiveTab('import')}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold px-4 py-1.5 shadow-md shadow-purple-600/30 gap-1.5"
                  >
                    <UploadCloud className="w-3.5 h-3.5" /> Import First Media Link
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {existingFiles.map((file, idx) => {
                    const isVideo = file.filename.endsWith('.mp4') || file.filename.endsWith('.webm') || file.filename.endsWith('.mov');
                    const isSelected = selectedFileUrl === file.url;

                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectExistingFile(file.url)}
                        className={`group relative rounded-xl border p-2.5 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                          isSelected
                            ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/50'
                            : 'bg-slate-950/60 border-slate-800 hover:border-purple-500/40 hover:bg-slate-900'
                        }`}
                      >
                        {/* Media Preview Box */}
                        <div className="w-full h-24 rounded-lg bg-slate-900 overflow-hidden relative flex items-center justify-center border border-slate-800/80">
                          {isVideo ? (
                            <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
                              <VideoIcon className="w-6 h-6 text-purple-400" />
                              <span className="text-[10px] font-mono text-slate-500">Video File</span>
                            </div>
                          ) : (
                            <img
                              src={file.url}
                              alt={file.filename}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white bg-purple-600 px-2 py-1 rounded-md shadow-md flex items-center gap-1">
                              <Check className="w-3 h-3" /> Select
                            </span>
                          </div>
                        </div>

                        {/* File Details */}
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-semibold text-slate-200 truncate" title={file.filename}>
                            {file.filename}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                            <span>{formatFileSize(file.size)}</span>
                            <span>{new Date(file.lastModified).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Import New External URL */}
          {activeTab === 'import' && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-purple-400" /> External Image / Video Link
                </label>
                <p className="text-[11px] text-slate-400">
                  Paste any media URL from the web. Our server will download it and store it in your Cloudflare R2 bucket under <code className="text-purple-300 font-mono">{brandName || 'brand'}/{deviceName || 'model'}/{folderType}</code>.
                </p>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://example.com/honor-magic-v6-front.jpg"
                  disabled={isUploading}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              {/* Feedback States */}
              {uploadErrorMsg && (
                <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{uploadErrorMsg}</span>
                </div>
              )}

              {successUrl && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Uploaded to Cloudflare R2! Selected as gallery image.</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Button
                  type="button"
                  onClick={handleUploadNew}
                  disabled={isUploading || !mediaUrl.trim()}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold px-5 py-2 shadow-md shadow-purple-600/30 gap-1.5 cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Downloading & Saving to R2...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Import & Save to R2</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500 font-mono">
            Cloudflare R2 • sphinix-mobile
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUploading}
            className="border-slate-800 text-slate-300 hover:bg-slate-800 text-xs rounded-xl"
          >
            Close
          </Button>
        </div>

      </div>
    </div>
  );
}
