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
import { ArrowLeft, Save, Send, Eye } from 'lucide-react';

import BlogHero from '@/app/(main)/blogs/[blogSlug]/_components/BlogHero';
import BlogMeta from '@/app/(main)/blogs/[blogSlug]/_components/BlogMeta';
import BlogContent from '@/app/(main)/blogs/[blogSlug]/_components/BlogContent';

import EditorMenuBar from './EditorMenuBar';
import BlogHeader from './BlogHeader';
import BlogSEOSettings from './BlogSEOSettings';
import BlogSidebar from './BlogSidebar';
import LeaveConfirmationModal from './LeaveConfirmationModal';

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
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    category: initialData?.category || '',
    author: initialData?.author || 'Admin',
    image: initialData?.image || '',
    status: initialData?.status || 'draft',
    seo: initialData?.seo || { metaTitle: '', metaDescription: '', keywords: '' }
  });

  const [initialFormState] = useState(formData);

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
    onUpdate: ({ editor }) => {
      if (editor.isFocused) {
        setIsDirty(true);
      }
    },
  });

  // Track form data changes
  React.useEffect(() => {
    if (JSON.stringify(formData) !== JSON.stringify(initialFormState)) {
      setIsDirty(true);
    }
  }, [formData, initialFormState]);

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
          <Button type="button" onClick={() => handleSave('published')} disabled={isPending || (initialData?.status === 'published' && !isDirty)} className={`gap-2 rounded-xl text-white shadow-lg shadow-brand-500/25 ${initialData?.status === 'published' && !isDirty ? 'bg-brand-400 opacity-80 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'}`}>
            <Send className="w-4 h-4" /> {isPending ? 'Publishing...' : (initialData?.status === 'published' && !isDirty ? 'Published' : 'Publish')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <BlogHeader 
              titleRef={titleRef}
              formData={formData}
              setFormData={setFormData}
              handleGenerateBlog={handleGenerateBlog}
              isGeneratingBlog={isGeneratingBlog}
            />
            
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
                <EditorMenuBar editor={editor} />
                <EditorContent editor={editor} />
              </div>
            )}
          </div>

          {/* SEO Controls */}
          <BlogSEOSettings 
            formData={formData}
            setFormData={setFormData}
            handleGenerateSEO={handleGenerateSEO}
            isGeneratingSEO={isGeneratingSEO}
          />
        </div>

        {/* Sidebar Controls */}
        <BlogSidebar 
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          sourceUrl={sourceUrl}
          setSourceUrl={setSourceUrl}
          handleGenerateFromUrl={handleGenerateFromUrl}
          isGeneratingFromUrl={isGeneratingFromUrl}
        />
      </div>

      {/* Leave Confirmation Modal */}
      <LeaveConfirmationModal 
        showLeaveModal={showLeaveModal}
        setShowLeaveModal={setShowLeaveModal}
        handleDiscard={() => {
          setIsDirty(false);
          router.push('/dashboard/blogs');
        }}
      />
    </div>
  );
}
