import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useInView } from "react-cool-inview";
import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiH1,
  RiH2,
  RiH3,
  RiH4,
  RiParagraph,
  RiListOrdered,
  RiListUnordered,
  RiLink,
  RiLinkUnlink,
  RiDoubleQuotesL,
  RiFormatClear,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
} from "react-icons/ri";
import { FaSubscript, FaSuperscript } from "react-icons/fa";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import $ from "jquery";

import { setLink } from "@/utils/setLink";

import "./Toolbar.css";

function Toolbar({ editor }) {
  const isCursorOverLink = editor.getAttributes("link").href;

  const { observe, inView } = useInView({
    rootMargin: "-1px 0px 0px 0px",
    threshold: [1],
  });

  return (
    <div
      className={classNames("ToolbarContainer", { sticky: !inView })}
      ref={observe}
    >
      <div className="Toolbar">
        {window.innerWidth < 850 && (
          <>
            <MobileSelection
              editor={editor}
              isCursorOverLink={isCursorOverLink}
            />
            <div className="divider"></div>
          </>
        )}
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

        <div className="divider"></div>
        <div
          className={
            "icon" + (editor.isActive("heading", { level: 1 }) ? " active" : "")
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <RiH1 />
        </div>
        <div
          className={
            "icon" + (editor.isActive("heading", { level: 2 }) ? " active" : "")
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <RiH2 />
        </div>
        <div
          className={
            "icon" + (editor.isActive("heading", { level: 3 }) ? " active" : "")
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <RiH3 />
        </div>
        <div
          className={
            "icon" + (editor.isActive("heading", { level: 4 }) ? " active" : "")
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          <RiH4 />
        </div>
        <div
          className={"icon"}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <RiParagraph />
        </div>
        {window.innerWidth >= 850 && (
          <>
            <ToolBarBtns editor={editor} isCursorOverLink={isCursorOverLink} />
          </>
        )}
      </div>
    </div>
  );
}

const MobileSelection = ({ editor, isCursorOverLink }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) {
      $(".mobile-selection-options").slideDown(200);
    } else {
      $(".mobile-selection-options").slideUp(200);
    }
  }, [open]);
  $(".icon").click(() => setOpen(false));
  return (
    <div className="mobile-selection">
      <div
        className={"icon" + (open ? " active" : "")}
        onClick={() => setOpen(!open)}
      >
        {open ? <RxCross2 /> : <RxHamburgerMenu />}
      </div>
      <div className="mobile-selection-options">
        <ToolBarBtns
          editor={editor}
          isCursorOverLink={isCursorOverLink}
          mobile={true}
        />
      </div>
    </div>
  );
};

const ToolBarBtns = ({ editor, isCursorOverLink, mobile }) => {
  return (
    <>
      <div
        className={"icon" + (editor.isActive("bulletList") ? " active" : "")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <RiListUnordered />{" "}
        {mobile && <span className="title">Unordered List</span>}
      </div>
      <div
        className={"icon" + (editor.isActive("orderedList") ? " active" : "")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <RiListOrdered />
        {mobile && <span className="title">Ordered List</span>}
      </div>
      <div className="divider"></div>
      <div
        className={"icon" + (editor.isActive("link") ? " active" : "")}
        onClick={() => setLink(editor)}
      >
        <RiLink />
        {mobile && <span className="title">Link</span>}
      </div>
      <div
        className={"icon"}
        onClick={() => setLink(editor)}
        disabled={!isCursorOverLink}
      >
        <RiLinkUnlink />
        {mobile && <span className="title">Unlink</span>}
      </div>
      <div className="divider"></div>
      <div
        className={"icon" + (editor.isActive("blockquote") ? " active" : "")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <RiDoubleQuotesL />
        {mobile && <span className="title">Quote</span>}
      </div>
      <div
        className={
          "icon icon-fa" + (editor.isActive("subscript") ? " active" : "")
        }
        onClick={() => editor.chain().focus().toggleSubscript().run()}
      >
        <FaSubscript />
        {mobile && <span className="title">Subscript</span>}
      </div>
      <div
        className={
          "icon icon-fa" + (editor.isActive("superscript") ? " active" : "")
        }
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
      >
        <FaSuperscript />
        {mobile && <span className="title">Superscript</span>}
      </div>
      <div className="divider"></div>
      <div
        className={`icon`}
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
      >
        <RiFormatClear />
        {mobile && <span className="title">Clear Formatting</span>}
      </div>
      <div className="divider"></div>
      <div
        className="icon"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <RiArrowGoBackLine />
        {mobile && <span className="title">Undo</span>}
      </div>
      <div
        className="icon"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <RiArrowGoForwardLine />
        {mobile && <span className="title">Redo</span>}
      </div>
    </>
  );
};

export default Toolbar;
