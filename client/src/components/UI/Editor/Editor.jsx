import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EmojiReplacer } from "@/plugins/emoijiReplacer/EmojiReplacer";
import Toolbar from "@/plugins/toolbar/Toolbar";
import { Popover } from "@/plugins/popover/Popover";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import "./Editor.css";
import "./TipTap.css";

function Editor({ register, content = "" }) {
  const extensions = [
    StarterKit,
    EmojiReplacer,
    Typography,
    Subscript,
    Superscript,
    Link.configure({
      linkOnPaste: true,
      openOnClick: false,
    }),
    Placeholder.configure({
      placeholder: "Type Something Here…",
    }),
  ];

  const editor = useEditor({
    content: content.trim(),
    extensions,
    onUpdate: ({ editor }) => {
      register.onChange({
        target: {
          name: "content",
          value: editor.getHTML(),
        },
      });
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div id="Wrapper">
      <div className="WhiteCard">
        <Toolbar editor={editor} />
        {window.innerWidth >= 1080 && <Popover editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default Editor;
