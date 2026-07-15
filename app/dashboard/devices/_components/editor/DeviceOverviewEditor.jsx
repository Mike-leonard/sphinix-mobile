'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { FileText } from 'lucide-react';
import EditorMenuBar from '@/app/dashboard/blogs/_components/editor/EditorMenuBar';

export default function DeviceOverviewEditor({ description, onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        link: false,
      }),
      Placeholder.configure({
        placeholder: 'Write a compelling overview for this device...',
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
    content: description || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[250px] px-6 py-6',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-emerald-500" />
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Overview Description</h2>
          <p className="text-sm text-slate-500">Write a custom rich-text description for the Overview tab.</p>
        </div>
      </div>
      
      <div className="flex flex-col">
        <EditorMenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
