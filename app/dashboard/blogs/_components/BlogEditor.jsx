'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import { createBlog, updateBlog } from '@/actions/blogs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Send, Image as ImageIcon, Settings2, Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Eye, Link2, Code } from 'lucide-react';
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
    extensions: [
      StarterKit,
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
    content: initialData?.content || (initialData?.excerpt ? `<p>${initialData.excerpt}</p>` : '<p>Start writing your amazing blog post here...</p>'),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-6 py-6',
      },
    },
  });

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
        <Link href="/dashboard/blogs" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>
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
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <input
                type="text"
                placeholder="Post Title..."
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-3xl font-bold bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700"
              />
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
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Settings2 className="w-5 h-5 text-brand-500" />
              Search Engine Optimization
            </h3>
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
    </div>
  );
}
