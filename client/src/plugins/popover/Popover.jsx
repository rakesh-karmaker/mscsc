import React from "react";
import { BubbleMenu } from "@tiptap/react";
import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiH1,
  RiH2,
  RiLink,
  RiLinkUnlink,
} from "react-icons/ri";

import { setLink } from "@/utils/setLink";

import "./Popover.css";

function Popover({ editor }) {
  const isSelectionOverLink = editor.getAttributes("link").href;

  return (
    <BubbleMenu className="Popover" editor={editor}>
      <div
        className={"icon" + (editor.isActive("bold") ? " active" : "")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <RiBold />
      </div>
      <div
        className={"icon" + (editor.isActive("italic") ? " active" : "")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <RiItalic />
      </div>
      <div
        className={"icon" + (editor.isActive("strike") ? " active" : "")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <RiStrikethrough />
      </div>
      <div
        className={
          "icon" + (editor.isActive("heading", { level: 1 }) ? " active" : "")
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <RiH1 />
      </div>
      <div
        className={
          "icon" + (editor.isActive("heading", { level: 2 }) ? " active" : "")
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <RiH2 />
      </div>
      <div
        className={"icon" + (editor.isActive("link") ? " active" : "")}
        onClick={() =>
          isSelectionOverLink
            ? editor.chain().focus().unsetLink().run()
            : setLink(editor)
        }
      >
        {isSelectionOverLink ? <RiLinkUnlink /> : <RiLink />}
      </div>
    </BubbleMenu>
  );
}

export { Popover };
