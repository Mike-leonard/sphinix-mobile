import React from 'react';
import { Button } from '@/components/ui/button';

export default function BlogHeader({ titleRef, formData, setFormData, handleGenerateBlog, isGeneratingBlog }) {
  return (
    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start gap-4">
      <textarea
        ref={titleRef}
        rows={1}
        placeholder="Post Title..."
        value={formData.title}
        onChange={e => setFormData({ ...formData, title: e.target.value })}
        className="w-full text-3xl font-bold bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 resize-none overflow-hidden"
      />
      <Button 
        type="button" 
        onClick={handleGenerateBlog} 
        disabled={isGeneratingBlog || !formData.title}
        className="shrink-0 gap-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/25"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/><path d="M19 3v4"/><path d="M21 5h-4"/></svg>
        {isGeneratingBlog ? 'Generating...' : 'AI Generate'}
      </Button>
    </div>
  );
}
