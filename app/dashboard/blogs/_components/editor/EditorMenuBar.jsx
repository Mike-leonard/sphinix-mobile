import React from 'react';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Link2, Code, Image as ImageIcon } from 'lucide-react';

export default function EditorMenuBar({ editor }) {
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
}
