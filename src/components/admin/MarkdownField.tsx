"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Markdown, type MarkdownStorage } from "tiptap-markdown";
import { Bold, Italic, Heading2, List, Link2 } from "lucide-react";

interface MarkdownFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

function ToolbarButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Bold;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`rounded p-1.5 transition hover:bg-gray-200 hover:text-ink-900 ${
        active ? "bg-gray-200 text-ink-900" : "text-gray-500"
      }`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1">
      <ToolbarButton
        icon={Bold}
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={Italic}
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={Heading2}
        label="Heading"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        icon={List}
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        icon={Link2}
        label="Link"
        active={editor.isActive("link")}
        onClick={() => {
          if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
            return;
          }
          const url = window.prompt("Link URL");
          if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }}
      />
    </div>
  );
}

export default function MarkdownField({ label, value, onChange, rows = 6 }: MarkdownFieldProps) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false }), Markdown],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const markdownStorage = editor.storage as unknown as { markdown: MarkdownStorage };
      onChange(markdownStorage.markdown.getMarkdown());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-neutral max-w-none px-3 py-2.5 focus:outline-none prose-headings:font-serif prose-headings:text-ink-900 prose-a:text-gold-600 prose-p:leading-relaxed prose-p:text-gray-600",
        style: `min-height: ${rows * 1.5}rem`,
      },
    },
  });

  return (
    <div>
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <div className="mt-1 overflow-hidden rounded-lg border border-gray-200 focus-within:border-gold-500">
        {editor && <Toolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
      <p className="mt-1 text-[11px] text-gray-400">Select text and use the toolbar to format — bold, italic, headings, links, lists.</p>
    </div>
  );
}
