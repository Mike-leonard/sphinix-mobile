'use client';

import React from 'react';
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';
import { Node, mergeAttributes } from '@tiptap/core';
import { FileText, GripVertical, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import EditorMenuBar from '@/app/dashboard/blogs/_components/editor/EditorMenuBar';

const VideoNodeView = (props) => {
  const { node, deleteNode, getPos, editor } = props;
  const src = node.attrs.src;

  const moveUp = () => {
    const pos = getPos();
    if (typeof pos !== 'number') return;
    const $pos = editor.state.doc.resolve(pos);
    const nodeBefore = $pos.nodeBefore;
    if (nodeBefore) {
      const beforePos = pos - nodeBefore.nodeSize;
      editor.chain()
        .deleteRange({ from: pos, to: pos + node.nodeSize })
        .insertContentAt(beforePos, { type: 'customVideo', attrs: node.attrs })
        .focus()
        .run();
    }
  };

  const moveDown = () => {
    const pos = getPos();
    if (typeof pos !== 'number') return;
    const afterPos = pos + node.nodeSize;
    const $pos = editor.state.doc.resolve(afterPos);
    const nodeAfter = $pos.nodeAfter;
    if (nodeAfter) {
      const targetPos = afterPos + nodeAfter.nodeSize;
      editor.chain()
        .deleteRange({ from: pos, to: pos + node.nodeSize })
        .insertContentAt(targetPos - node.nodeSize, { type: 'customVideo', attrs: node.attrs })
        .focus()
        .run();
    }
  };

  return (
    <NodeViewWrapper className="relative group my-4 select-none" data-drag-handle>
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-2 py-1.5 rounded-lg border border-slate-700 shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={moveUp}
          className="p-1 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded transition-colors"
          title="Move Up"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={moveDown}
          className="p-1 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded transition-colors"
          title="Move Down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-700 mx-0.5" />
        <button
          type="button"
          onClick={deleteNode}
          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors"
          title="Delete Video"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 shadow-lg cursor-grab active:cursor-grabbing">
        <GripVertical className="w-3.5 h-3.5 text-slate-400" />
        <span>Drag to Move</span>
      </div>

      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full max-h-[500px] rounded-xl overflow-hidden shadow-sm object-cover bg-black pointer-events-none"
      />
    </NodeViewWrapper>
  );
};

const YoutubeNodeView = (props) => {
  const { node, deleteNode, getPos, editor } = props;
  const src = node.attrs.src;

  let embedUrl = src;
  if (src && src.includes('watch?v=')) {
    embedUrl = src.replace('watch?v=', 'embed/');
  } else if (src && src.includes('youtu.be/')) {
    embedUrl = src.replace('youtu.be/', 'youtube.com/embed/');
  }

  const moveUp = () => {
    const pos = getPos();
    if (typeof pos !== 'number') return;
    const $pos = editor.state.doc.resolve(pos);
    const nodeBefore = $pos.nodeBefore;
    if (nodeBefore) {
      const beforePos = pos - nodeBefore.nodeSize;
      editor.chain()
        .deleteRange({ from: pos, to: pos + node.nodeSize })
        .insertContentAt(beforePos, { type: 'youtube', attrs: node.attrs })
        .focus()
        .run();
    }
  };

  const moveDown = () => {
    const pos = getPos();
    if (typeof pos !== 'number') return;
    const afterPos = pos + node.nodeSize;
    const $pos = editor.state.doc.resolve(afterPos);
    const nodeAfter = $pos.nodeAfter;
    if (nodeAfter) {
      const targetPos = afterPos + nodeAfter.nodeSize;
      editor.chain()
        .deleteRange({ from: pos, to: pos + node.nodeSize })
        .insertContentAt(targetPos - node.nodeSize, { type: 'youtube', attrs: node.attrs })
        .focus()
        .run();
    }
  };

  return (
    <NodeViewWrapper className="relative group my-4 select-none" data-drag-handle>
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-2 py-1.5 rounded-lg border border-slate-700 shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={moveUp}
          className="p-1 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded transition-colors"
          title="Move Up"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={moveDown}
          className="p-1 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded transition-colors"
          title="Move Down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-700 mx-0.5" />
        <button
          type="button"
          onClick={deleteNode}
          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors"
          title="Delete Video"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 shadow-lg cursor-grab active:cursor-grabbing">
        <GripVertical className="w-3.5 h-3.5 text-slate-400" />
        <span>Drag to Move</span>
      </div>

      <iframe
        src={embedUrl}
        className="w-full aspect-video rounded-xl overflow-hidden shadow-md pointer-events-none border-0"
      />
    </NodeViewWrapper>
  );
};

export const CustomVideoNode = Node.create({
  name: 'customVideo',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      autoplay: { default: true },
      loop: { default: true },
      muted: { default: true }
    };
  },

  parseHTML() {
    return [{ tag: 'video' }];
  },

  renderHTML({ HTMLAttributes }) {
    const { controls, ...cleanAttrs } = HTMLAttributes;
    return [
      'video',
      mergeAttributes(
        {
          class: 'w-full max-h-[500px] rounded-xl overflow-hidden my-4 shadow-sm object-cover bg-black pointer-events-none select-none',
          autoplay: 'autoplay',
          loop: 'loop',
          muted: 'muted',
          playsinline: 'playsinline'
        },
        cleanAttrs
      )
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoNodeView);
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: options
            });
          }
    };
  }
});

const ExtendedYoutube = Youtube.extend({
  draggable: true,
  selectable: true,
  atom: true,
  addNodeView() {
    return ReactNodeViewRenderer(YoutubeNodeView);
  }
});

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
      ExtendedYoutube.configure({
        controls: false,
        loop: true,
        nocookie: true,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-xl overflow-hidden my-4 shadow-md pointer-events-none select-none',
        },
      }),
      CustomVideoNode,
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
