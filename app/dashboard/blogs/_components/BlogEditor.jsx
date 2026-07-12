'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { createBlog, updateBlog } from '@/actions/blogs';
import { generateBlogFromTitle, generateSEOFromContent, generateBlogFromUrl } from '@/actions/ai';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Send, Image as ImageIcon, Settings2, Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Eye, Link2, Code, Sparkles, Wand2, Loader2 } from 'lucide-react';
import Link from 'next/link';

import BlogHero from '@/app/(main)/blogs/[blogSlug]/_components/BlogHero';
import BlogMeta from '@/app/(main)/blogs/[blogSlug]/_components/BlogMeta';
import BlogContent from '@/app/(main)/blogs/[blogSlug]/_components/BlogContent';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('URL');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-t-xl">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('bold') ? 'bg-slate-200 dark:bg-slate-800 text-brand-600' : 'text-slate-600 dark:text-slate-400'}`}>
        <Bold className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('italic') ? 'bg-slate-200 dark:bg-slate-800 text-brand-600' : 'text-slate-600 dark:text-slate-400'}`}>
        <Italic className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 dark:bg-slate-800 text-brand-600' : 'text-slate-600 dark:text-slate-400'}`}>
        <Heading1 className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 dark:bg-slate-800 text-brand-600' : 'text-slate-600 dark:text-slate-400'}`}>
        <Heading2 className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 dark:bg-slate-800 text-brand-600' : 'text-slate-600 dark:text-slate-400'}`}>
        <Heading3 className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('bulletList') ? 'bg-slate-200 dark:bg-slate-800 text-brand-600' : 'text-slate-600 dark:text-slate-400'}`}>
        <List className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('orderedList') ? 'bg-slate-200 dark:bg-slate-800 text-brand-600' : 'text-slate-600 dark:text-slate-400'}`}>
        <ListOrdered className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('blockquote') ? 'bg-slate-200 dark:bg-slate-800 text-brand-600' : 'text-slate-600 dark:text-slate-400'}`}>
        <Quote className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1" />
      <button type="button" onClick={setLink} className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('link') ? 'bg-slate-200 dark:bg-slate-800 text-brand-600' : 'text-slate-600 dark:text-slate-400'}`}>
        <Link2 className="w-4 h-4" />
      </button>
      <button type="button" onClick={addImage} className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400`}>
        <ImageIcon className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('code') ? 'bg-slate-200 dark:bg-slate-800 text-brand-600' : 'text-slate-600 dark:text-slate-400'}`}>
        <Code className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function BlogEditor({ initialData = null, categories = [] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isPreview, setIsPreview] = useState(false);
  const [isGeneratingBlog, setIsGeneratingBlog] = useState(false);
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [sourceUrl, setSourceUrl] = useState('');
  const [isGeneratingFromUrl, setIsGeneratingFromUrl] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const titleRef = React.useRef(null);
  const isInitialMount = React.useRef(true);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    category: initialData?.category || '',
    author: initialData?.author || 'Admin',
    image: initialData?.image || '',
    status: initialData?.status || 'draft',
    seo: initialData?.seo || { metaTitle: '', metaDescription: '', keywords: '' }
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        link: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your amazing blog post here...',
        emptyEditorClass: 'is-editor-empty',
      }),
      Heading.configure({ levels: [1, 2, 3] }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-h-[500px] w-auto object-cover',
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-500 underline underline-offset-2',
        },
      }),
    ],
    content: initialData?.content || (initialData?.excerpt ? `<p>${initialData.excerpt}</p>` : ''),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-6 py-6',
      },
    },
    onUpdate: () => {
      setIsDirty(true);
    },
  });

  // Track form data changes
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setIsDirty(true);
    }
  }, [formData]);

  // Block tab closing/reloading
  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  React.useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, [formData.title]);

  const handleGenerateBlog = async () => {
    if (!formData.title) {
      alert('Please enter a title first!');
      return;
    }
    setIsGeneratingBlog(true);
    const res = await generateBlogFromTitle(formData.title);
    setIsGeneratingBlog(false);
    
    if (res.success) {
      editor.commands.setContent(res.data);
    } else {
      alert(res.error);
    }
  };

  const handleGenerateFromUrl = async () => {
    if (!sourceUrl) {
      alert('Please paste a URL first!');
      return;
    }
    setIsGeneratingFromUrl(true);
    const res = await generateBlogFromUrl(sourceUrl);
    setIsGeneratingFromUrl(false);
    
    if (res.success) {
      editor.commands.setContent(res.data.content);
      setFormData(prev => ({ ...prev, title: res.data.title }));
      setSourceUrl('');
    } else {
      alert(res.error);
    }
  };

  const handleGenerateSEO = async () => {
    const currentHtml = editor.getHTML();
    if (!currentHtml || currentHtml === '<p></p>') {
      alert('Please write some content first!');
      return;
    }
    
    setIsGeneratingSEO(true);
    const res = await generateSEOFromContent(currentHtml, formData.title);
    setIsGeneratingSEO(false);
    
    if (res.success) {
      setFormData({
        ...formData,
        seo: res.data
      });
    } else {
      alert(res.error);
    }
  };

  const handleSave = (status) => {
    startTransition(async () => {
      const dataToSave = {
        ...formData,
        status,
        content: editor.getHTML(),
        readTime: `${Math.ceil(editor.getText().split(' ').length / 200)} min read`
      };

      let res;
      if (initialData) {
        res = await updateBlog(initialData.id, dataToSave);
      } else {
        res = await createBlog(dataToSave);
      }

      if (res.success) {
        setIsDirty(false);
        router.push('/dashboard/blogs');
      } else {
        alert(res.error);
      }
    });
  };

  const previewBlog = {
    ...formData,
    content: editor?.getHTML(),
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    readTime: `${Math.ceil((editor?.getText().split(' ').length || 1) / 200)} min read`
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-20">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <button 
          type="button"
          onClick={(e) => {
            if (isDirty) {
              e.preventDefault();
              setShowLeaveModal(true);
            } else {
              router.push('/dashboard/blogs');
            }
          }}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </button>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => setIsPreview(!isPreview)} className="gap-2 rounded-xl">
            <Eye className="w-4 h-4" /> {isPreview ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => handleSave('draft')} disabled={isPending} className="gap-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700">
            <Save className="w-4 h-4" /> {isPending ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button type="button" onClick={() => handleSave('published')} disabled={isPending} className="gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25">
            <Send className="w-4 h-4" /> {isPending ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
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
            
            {isPreview ? (
              <div className="bg-white dark:bg-slate-900 overflow-hidden w-full">
                <BlogHero blog={previewBlog} />
                <BlogMeta blog={previewBlog} />
                <div className="pointer-events-none">
                  <BlogContent blog={previewBlog} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
              </div>
            )}
          </div>

          {/* SEO Controls */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-brand-500" />
                Search Engine Optimization
              </h3>
              <Button 
                type="button" 
                onClick={handleGenerateSEO} 
                disabled={isGeneratingSEO}
                variant="outline"
                className="gap-2 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl text-xs h-8"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
                {isGeneratingSEO ? 'Analyzing...' : 'Auto-Fill SEO'}
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Title</label>
                <input 
                  type="text" 
                  value={formData.seo.metaTitle} 
                  onChange={e => setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })} 
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Description</label>
                <textarea 
                  rows={2} 
                  value={formData.seo.metaDescription} 
                  onChange={e => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })} 
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm resize-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keywords</label>
                <input 
                  type="text" 
                  placeholder="tech, smartphones, review"
                  value={formData.seo.keywords} 
                  onChange={e => setFormData({ ...formData, seo: { ...formData.seo, keywords: e.target.value } })} 
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              AI Tools
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Generate from URL</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="url" 
                    placeholder="https://example.com/article"
                    value={sourceUrl}
                    onChange={e => setSourceUrl(e.target.value)}
                    className="flex-1 px-4 h-[42px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" 
                  />
                  <Button 
                    type="button" 
                    title="Generate from URL"
                    onClick={handleGenerateFromUrl}
                    disabled={isGeneratingFromUrl || !sourceUrl}
                    className="cursor-pointer shrink-0 w-[42px] h-[42px] p-0 flex items-center justify-center bg-brand-600 hover:bg-brand-700 text-white rounded-xl"
                  >
                    {isGeneratingFromUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">Paste a link to any article and AI will rewrite it perfectly for your blog.</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Post Settings</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <div className="relative">
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })} 
                    className="w-full pl-4 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm appearance-none" 
                  >
                    <option value="" disabled>Select a category...</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Author</label>
                <input 
                  type="text" 
                  value={formData.author} 
                  onChange={e => setFormData({ ...formData, author: e.target.value })} 
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cover Image</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="url" 
                    placeholder="https://..."
                    value={formData.image} 
                    onChange={e => setFormData({ ...formData, image: e.target.value })} 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" 
                  />
                </div>
                {formData.image && (
                  <div className="mt-2 rounded-xl overflow-hidden h-32 border border-slate-200 dark:border-slate-800">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Short Excerpt</label>
                <textarea 
                  rows={4} 
                  value={formData.excerpt} 
                  onChange={e => setFormData({ ...formData, excerpt: e.target.value })} 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/50 text-sm resize-none" 
                />
                <p className="text-xs text-slate-500 mt-1">This will be shown on the blog cards.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Confirmation Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Unsaved Changes</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              You have unsaved changes. Are you sure you want to leave without saving? Your changes will be permanently lost.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowLeaveModal(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white" 
                onClick={() => {
                  setIsDirty(false);
                  router.push('/dashboard/blogs');
                }}
              >
                Discard Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
