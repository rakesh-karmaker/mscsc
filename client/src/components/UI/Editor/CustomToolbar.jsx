import { useCallback, useState, useRef, useEffect } from "react";
import "./CustomToolbar.css";
import {
  LuAlignCenter,
  LuAlignLeft,
  LuAlignRight,
  LuBold,
  LuCodeXml,
  LuHeading,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHighlighter,
  LuIndentDecrease,
  LuIndentIncrease,
  LuItalic,
  LuLink,
  LuList,
  LuListOrdered,
  LuPalette,
  LuQuote,
  LuRedo2,
  LuStrikethrough,
  LuUnderline,
  LuUndo2,
  LuUnlink,
  LuX,
} from "react-icons/lu";
import { TbPlusEqual } from "react-icons/tb";
import { MdEmojiEmotions } from "react-icons/md";
import "./CustomToolbar.css";

export function CustomToolbar({ contentRef, onLinkClick, onMathClick }) {
  // Create refs for each dropdown to access them directly
  const headingDropdownRef = useRef(null);
  const fontSizeDropdownRef = useRef(null);
  const textColorDropdownRef = useRef(null);
  const highlightDropdownRef = useRef(null);
  const mathDropdownRef = useRef(null);
  const emojiDropdownRef = useRef(null);

  // Replace the positionDropdown function with this safer version

  const positionDropdown = (event, setIsOpen, isOpen, dropdownRef) => {
    // Toggle the dropdown state
    setIsOpen(!isOpen);

    // If we're closing the dropdown, no need to position it
    if (isOpen) return;

    // Store a reference to the button element
    const button = event.currentTarget;

    // Use a mutation observer to detect when the dropdown is rendered
    const observer = new MutationObserver(() => {
      if (!dropdownRef.current || !button) return; // Ensure both dropdown and button exist

      const dropdown = dropdownRef.current;

      // Reset any previously set positioning
      dropdown.style.left = "";
      dropdown.style.right = "";
      dropdown.style.maxWidth = "";

      // Get the button and dropdown positions
      const buttonRect = button.getBoundingClientRect();
      const dropdownRect = dropdown.getBoundingClientRect();

      // Get the editor-container dimensions
      const editorContainer = document.querySelector(".editor-container");
      if (!editorContainer) return; // Ensure the editor-container exists
      const editorRect = editorContainer.getBoundingClientRect();

      // Calculate available space on both sides relative to the editor-container
      const spaceOnLeft = buttonRect.left - editorRect.left;
      const spaceOnRight = editorRect.right - buttonRect.right;

      // Determine the best position for the dropdown
      if (spaceOnRight >= dropdownRect.width) {
        // Align to the button's right edge within the editor-container
        dropdown.style.left = `${0}px`;
        dropdown.style.right = "auto";
      } else if (spaceOnLeft >= dropdownRect.width) {
        // Align to the button's left edge within the editor-container
        dropdown.style.left = `${0}px`;
        dropdown.style.right = "auto";
      } else {
        // If neither side has enough space, align to the side with more space
        if (spaceOnRight > spaceOnLeft) {
          dropdown.style.left = `${
            buttonRect.right - editorRect.left - dropdownRect.width
          }px`;
          dropdown.style.right = "auto";
        } else {
          dropdown.style.left = `${buttonRect.left - editorRect.left}px`;
          dropdown.style.right = "auto";
        }
      }

      // Ensure the dropdown fits within the editor-container
      const updatedRect = dropdown.getBoundingClientRect();
      if (updatedRect.right > editorRect.right) {
        // If still overflowing right, force it to fit within the editor-container
        dropdown.style.left = "auto";
        dropdown.style.right = "0";
        dropdown.style.maxWidth = `${editorRect.width - 10}px`;
      } else if (updatedRect.left < editorRect.left) {
        // If overflowing left, align to the left edge of the editor-container
        dropdown.style.left = "0";
        dropdown.style.right = "auto";
        dropdown.style.maxWidth = `${editorRect.width - 10}px`;
      }

      // Disconnect the observer once the dropdown is positioned
      observer.disconnect();
    });

    // Observe the dropdown for changes
    observer.observe(document.body, { childList: true, subtree: true });
  };

  // Update the execCommand function to properly handle selection and focus
  const execCommand = useCallback(
    (command, value) => {
      if (!contentRef.current) return;

      // Focus the editor first to ensure we have a selection
      contentRef.current.focus();

      // Execute the command
      document.execCommand(command, false, value);

      // Focus back on the editor to maintain cursor position
      contentRef.current.focus();
    },
    [contentRef]
  );

  // Custom indent/outdent handlers to avoid styling issues
  const handleIndent = useCallback(() => {
    if (!contentRef.current) return;

    contentRef.current.focus();

    // Get the current selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Get the current node
    const range = selection.getRangeAt(0);
    let node = range.commonAncestorContainer;

    // If the node is a text node, get its parent
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    // Find the closest block element
    let blockElement = node;
    while (
      blockElement &&
      blockElement !== contentRef.current &&
      ![
        "P",
        "DIV",
        "LI",
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "BLOCKQUOTE",
      ].includes(blockElement.nodeName)
    ) {
      blockElement = blockElement.parentNode;
    }

    if (blockElement && blockElement !== contentRef.current) {
      // Apply padding-left instead of using execCommand
      const currentPadding =
        Number.parseInt(window.getComputedStyle(blockElement).paddingLeft) || 0;
      blockElement.style.paddingLeft = `${currentPadding + 20}px`;
    }
  }, [contentRef]);

  const handleOutdent = useCallback(() => {
    if (!contentRef.current) return;

    contentRef.current.focus();

    // Get the current selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Get the current node
    const range = selection.getRangeAt(0);
    let node = range.commonAncestorContainer;

    // If the node is a text node, get its parent
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    // Find the closest block element
    let blockElement = node;
    while (
      blockElement &&
      blockElement !== contentRef.current &&
      ![
        "P",
        "DIV",
        "LI",
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "BLOCKQUOTE",
      ].includes(blockElement.nodeName)
    ) {
      blockElement = blockElement.parentNode;
    }

    if (blockElement && blockElement !== contentRef.current) {
      // Reduce padding-left instead of using execCommand
      const currentPadding =
        Number.parseInt(window.getComputedStyle(blockElement).paddingLeft) || 0;
      if (currentPadding > 0) {
        blockElement.style.paddingLeft = `${Math.max(
          0,
          currentPadding - 20
        )}px`;
      }
    }
  }, [contentRef]);

  // Handle text formatting
  const handleBold = useCallback(() => {
    execCommand("bold");
  }, [execCommand]);

  const handleItalic = useCallback(() => {
    execCommand("italic");
  }, [execCommand]);

  const handleUnderline = useCallback(() => {
    execCommand("underline");
  }, [execCommand]);

  const handleStrikethrough = useCallback(() => {
    execCommand("strikeThrough");
  }, [execCommand]);

  // Handle lists
  const handleBulletList = useCallback(() => {
    execCommand("insertUnorderedList");
  }, [execCommand]);

  const handleOrderedList = useCallback(() => {
    execCommand("insertOrderedList");
  }, [execCommand]);

  // Handle alignment
  const handleAlignLeft = useCallback(() => {
    execCommand("justifyLeft");
  }, [execCommand]);

  const handleAlignCenter = useCallback(() => {
    execCommand("justifyCenter");
  }, [execCommand]);

  const handleAlignRight = useCallback(() => {
    execCommand("justifyRight");
  }, [execCommand]);

  // Handle headings
  const handleHeading = useCallback(
    (level) => {
      execCommand("formatBlock", `<h${level}>`);
    },
    [execCommand]
  );

  const handleParagraph = useCallback(() => {
    execCommand("formatBlock", "<p>");
  }, [execCommand]);

  // Handle color
  const handleColor = useCallback(
    (color) => {
      execCommand("foreColor", color);
    },
    [execCommand]
  );

  // Handle highlight
  const handleHighlight = useCallback(
    (color) => {
      execCommand("hiliteColor", color);
    },
    [execCommand]
  );

  // Handle font size
  const handleFontSize = useCallback(
    (size) => {
      // Convert px to pt for execCommand (approximate conversion)
      const pxValue = Number.parseInt(size);
      const ptValue = Math.round(pxValue * 0.75);

      execCommand("fontSize", ptValue.toString());
    },
    [execCommand]
  );

  // Handle emoji insertion
  const handleEmoji = useCallback(
    (emoji) => {
      execCommand("insertText", emoji);
    },
    [execCommand]
  );

  // Handle undo/redo
  const handleUndo = useCallback(() => {
    execCommand("undo");
  }, [execCommand]);

  const handleRedo = useCallback(() => {
    execCommand("redo");
  }, [execCommand]);

  // Handle blockquote
  const handleBlockquote = useCallback(() => {
    execCommand("formatBlock", "<blockquote>");
  }, [execCommand]);

  // Handle code block
  const handleCodeBlock = useCallback(() => {
    execCommand("formatBlock", "<pre>");
  }, [execCommand]);

  // Handle clear formatting
  const handleClearFormatting = useCallback(() => {
    execCommand("removeFormat");
  }, [execCommand]);

  // Update the handleLinkClick function to handle selected text
  const handleLinkClick = useCallback(() => {
    if (!contentRef.current) return;

    // Focus the editor to ensure we have a selection
    contentRef.current.focus();

    // Get the current selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Call the parent's onLinkClick handler
    onLinkClick();
  }, [contentRef, onLinkClick]);

  // Add a function to remove links
  const handleUnlink = useCallback(() => {
    if (!contentRef.current) return;

    // Focus the editor to ensure we have a selection
    contentRef.current.focus();

    // Get the current selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Check if the selection is inside a link
    const range = selection.getRangeAt(0);
    const linkElement = findLinkInSelection(range);

    if (linkElement) {
      // If a link is found, replace it with its text content
      const textContent = linkElement.textContent || "";
      const textNode = document.createTextNode(textContent);

      linkElement.parentNode?.replaceChild(textNode, linkElement);

      // Update the selection to include the new text node
      range.selectNodeContents(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // If no link is found, try the unlink command
      execCommand("unlink");
    }
  }, [contentRef, execCommand]);

  // Helper function to find a link element in the selection
  const findLinkInSelection = (range) => {
    let node = range.commonAncestorContainer;

    // If the node is a text node, get its parent
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    // Check if the node is a link
    if (node.nodeName === "A") {
      return node;
    }

    // Check if any parent is a link
    let parent = node.parentNode;
    while (parent) {
      if (parent.nodeName === "A") {
        return parent;
      }
      parent = parent.parentNode;
    }

    return null;
  };

  // Text colors
  const TEXT_COLORS = [
    { name: "Default", value: "inherit" },
    { name: "Black", value: "#000000" },
    { name: "White", value: "#ffffff" },
    { name: "Gray", value: "#6b7280" },
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f97316" },
    { name: "Yellow", value: "#eab308" },
    { name: "Green", value: "#22c55e" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
  ];

  // Highlight colors
  const HIGHLIGHT_COLORS = [
    { name: "Default", value: "inherit" },
    { name: "Yellow", value: "#fef08a" },
    { name: "Green", value: "#bbf7d0" },
    { name: "Blue", value: "#bfdbfe" },
    { name: "Pink", value: "#fbcfe8" },
    { name: "Purple", value: "#e9d5ff" },
    { name: "Orange", value: "#fed7aa" },
  ];

  // Font sizes
  const FONT_SIZES = [
    "8px",
    "10px",
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "30px",
    "36px",
    "48px",
  ];

  // Emojis
  const EMOJIS = [
    "😀",
    "😂",
    "😊",
    "🥰",
    "😎",
    "🤔",
    "👍",
    "👏",
    "🎉",
    "❤️",
    "🔥",
    "⭐",
    "✅",
    "❌",
    "⚠️",
    "🚀",
    "💡",
    "📝",
  ];

  // State for dropdowns
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [showTextColorMenu, setShowTextColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [showMathMenu, setShowMathMenu] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close all dropdowns when clicking outside
      if (
        showHeadingMenu &&
        headingDropdownRef.current &&
        !headingDropdownRef.current.contains(event.target) &&
        !event.target.closest(".toolbar-button")
      ) {
        setShowHeadingMenu(false);
      }
      if (
        showFontSizeMenu &&
        fontSizeDropdownRef.current &&
        !fontSizeDropdownRef.current.contains(event.target) &&
        !event.target.closest(".toolbar-button")
      ) {
        setShowFontSizeMenu(false);
      }
      if (
        showTextColorMenu &&
        textColorDropdownRef.current &&
        !textColorDropdownRef.current.contains(event.target) &&
        !event.target.closest(".toolbar-button")
      ) {
        setShowTextColorMenu(false);
      }
      if (
        showHighlightMenu &&
        highlightDropdownRef.current &&
        !highlightDropdownRef.current.contains(event.target) &&
        !event.target.closest(".toolbar-button")
      ) {
        setShowHighlightMenu(false);
      }
      if (
        showMathMenu &&
        mathDropdownRef.current &&
        !mathDropdownRef.current.contains(event.target) &&
        !event.target.closest(".toolbar-button")
      ) {
        setShowMathMenu(false);
      }
      if (
        showEmojiMenu &&
        emojiDropdownRef.current &&
        !emojiDropdownRef.current.contains(event.target) &&
        !event.target.closest(".toolbar-button")
      ) {
        setShowEmojiMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    showHeadingMenu,
    showFontSizeMenu,
    showTextColorMenu,
    showHighlightMenu,
    showMathMenu,
    showEmojiMenu,
  ]);

  return (
    <div className="toolbar">
      {/* Text Formatting */}
      <button
        type="button"
        className="toolbar-button"
        onClick={handleBold}
        title="Bold"
      >
        <LuBold />
      </button>

      <button
        type="button"
        className="toolbar-button"
        onClick={handleItalic}
        title="Italic"
      >
        <LuItalic />
      </button>

      <button
        type="button"
        className="toolbar-button"
        onClick={handleUnderline}
        title="Underline"
      >
        <LuUnderline />
      </button>

      <button
        type="button"
        className="toolbar-button"
        onClick={handleStrikethrough}
        title="Strikethrough"
      >
        <LuStrikethrough />
      </button>

      <div className="toolbar-separator"></div>

      {/* Headings */}
      <div className="toolbar-dropdown">
        <button
          type="button"
          className="toolbar-button toolbar-button-with-text"
          onClick={(e) =>
            positionDropdown(
              e,
              setShowHeadingMenu,
              showHeadingMenu,
              headingDropdownRef
            )
          }
          title="Heading"
        >
          <LuHeading />
          <span>Heading</span>
        </button>
        {showHeadingMenu && (
          <div className="dropdown-menu" ref={headingDropdownRef}>
            <button
              type="button"
              className="dropdown-item"
              onClick={() => {
                handleParagraph();
                setShowHeadingMenu(false);
              }}
            >
              Paragraph
            </button>
            <button
              type="button"
              className="dropdown-item"
              onClick={() => {
                handleHeading(1);
                setShowHeadingMenu(false);
              }}
            >
              <LuHeading1 />
              <span>Heading 1</span>
            </button>
            <button
              type="button"
              className="dropdown-item"
              onClick={() => {
                handleHeading(2);
                setShowHeadingMenu(false);
              }}
            >
              <LuHeading2 />
              <span>Heading 2</span>
            </button>
            <button
              type="button"
              className="dropdown-item"
              onClick={() => {
                handleHeading(3);
                setShowHeadingMenu(false);
              }}
            >
              <LuHeading3 />
              <span>Heading 3</span>
            </button>
            <button
              type="button"
              className="dropdown-item"
              onClick={() => {
                handleHeading(4);
                setShowHeadingMenu(false);
              }}
            >
              <LuHeading4 />
              <span>Heading 4</span>
            </button>
            <button
              type="button"
              className="dropdown-item"
              onClick={() => {
                handleHeading(5);
                setShowHeadingMenu(false);
              }}
            >
              <LuHeading5 />
              <span>Heading 5</span>
            </button>
          </div>
        )}
      </div>

      {/* Font Size */}
      <div className="toolbar-dropdown">
        <button
          type="button"
          className="toolbar-button toolbar-button-with-text"
          onClick={(e) =>
            positionDropdown(
              e,
              setShowFontSizeMenu,
              showFontSizeMenu,
              fontSizeDropdownRef
            )
          }
          title="Font Size"
        >
          <span>Size</span>
        </button>
        {showFontSizeMenu && (
          <div className="dropdown-menu" ref={fontSizeDropdownRef}>
            {FONT_SIZES.map((size) => (
              <button
                type="button"
                key={size}
                className="dropdown-item"
                onClick={() => {
                  handleFontSize(size);
                  setShowFontSizeMenu(false);
                }}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="toolbar-separator"></div>

      {/* Text Color */}
      <div className="toolbar-dropdown">
        <button
          type="button"
          className="toolbar-button"
          onClick={(e) =>
            positionDropdown(
              e,
              setShowTextColorMenu,
              showTextColorMenu,
              textColorDropdownRef
            )
          }
          title="Text Color"
        >
          <LuPalette />
        </button>
        {showTextColorMenu && (
          <div className="dropdown-menu color-menu" ref={textColorDropdownRef}>
            {TEXT_COLORS.map((color) => (
              <button
                type="button"
                key={color.value}
                className="color-item"
                style={{ backgroundColor: color.value }}
                onClick={() => {
                  handleColor(color.value);
                  setShowTextColorMenu(false);
                }}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Highlight Color */}
      <div className="toolbar-dropdown">
        <button
          type="button"
          className="toolbar-button"
          onClick={(e) =>
            positionDropdown(
              e,
              setShowHighlightMenu,
              showHighlightMenu,
              highlightDropdownRef
            )
          }
          title="Highlight Color"
        >
          <LuHighlighter />
        </button>
        {showHighlightMenu && (
          <div className="dropdown-menu color-menu" ref={highlightDropdownRef}>
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                type="button"
                key={color.value}
                className="color-item"
                style={{ backgroundColor: color.value }}
                onClick={() => {
                  handleHighlight(color.value);
                  setShowHighlightMenu(false);
                }}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>

      <div className="toolbar-separator"></div>

      {/* Lists */}
      <button
        type="button"
        className="toolbar-button"
        onClick={handleBulletList}
        title="Bullet List"
      >
        <LuList />
      </button>

      <button
        type="button"
        className="toolbar-button"
        onClick={handleOrderedList}
        title="Ordered List"
      >
        <LuListOrdered />
      </button>

      <button
        type="button"
        className="toolbar-button"
        onClick={handleOutdent}
        title="Decrease Indent"
      >
        <LuIndentDecrease />
      </button>

      <button
        type="button"
        className="toolbar-button"
        onClick={handleIndent}
        title="Increase Indent"
      >
        <LuIndentIncrease />
      </button>

      <div className="toolbar-separator"></div>

      {/* Alignment */}
      <button
        type="button"
        className="toolbar-button"
        onClick={handleAlignLeft}
        title="Align Left"
      >
        <LuAlignLeft />
      </button>

      <button
        type="button"
        className="toolbar-button"
        onClick={handleAlignCenter}
        title="Align Center"
      >
        <LuAlignCenter />
      </button>

      <button
        type="button"
        className="toolbar-button"
        onClick={handleAlignRight}
        title="Align Right"
      >
        <LuAlignRight />
      </button>

      <div className="toolbar-separator"></div>

      {/* Special Formatting */}
      <button
        type="button"
        className="toolbar-button"
        onClick={handleCodeBlock}
        title="Code Block"
      >
        <LuCodeXml />
      </button>

      <button
        type="button"
        className="toolbar-button"
        onClick={handleBlockquote}
        title="Quote"
      >
        <LuQuote />
      </button>

      {/* Math */}
      <div className="toolbar-dropdown">
        <button
          type="button"
          className="toolbar-button"
          onClick={(e) =>
            positionDropdown(e, setShowMathMenu, showMathMenu, mathDropdownRef)
          }
          title="Math"
        >
          <TbPlusEqual />
        </button>
        {showMathMenu && (
          <div className="dropdown-menu" ref={mathDropdownRef}>
            <button
              type="button"
              className="dropdown-item"
              onClick={() => {
                onMathClick("inline");
                setShowMathMenu(false);
              }}
            >
              Inline Math
            </button>
            <button
              type="button"
              className="dropdown-item"
              onClick={() => {
                onMathClick("block");
                setShowMathMenu(false);
              }}
            >
              Math Block
            </button>
          </div>
        )}
      </div>

      <div className="toolbar-separator"></div>

      {/* Links */}
      <button
        type="button"
        className="toolbar-button"
        onClick={handleLinkClick}
        title="Add Link"
      >
        <LuLink />
      </button>

      <button
        type="button"
        className="toolbar-button"
        onClick={handleUnlink}
        title="Remove Link"
      >
        <LuUnlink />
      </button>

      <div className="toolbar-separator"></div>

      {/* Emojis */}
      <div className="toolbar-dropdown">
        <button
          type="button"
          className="toolbar-button"
          onClick={(e) =>
            positionDropdown(
              e,
              setShowEmojiMenu,
              showEmojiMenu,
              emojiDropdownRef
            )
          }
          title="Emoji"
        >
          <MdEmojiEmotions />
        </button>
        {showEmojiMenu && (
          <div className="dropdown-menu emoji-menu" ref={emojiDropdownRef}>
            {EMOJIS.map((emoji) => (
              <button
                type="button"
                key={emoji}
                className="emoji-item"
                onClick={() => {
                  handleEmoji(emoji);
                  setShowEmojiMenu(false);
                }}
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="toolbar-separator"></div>

      {/* Undo/Redo */}
      <button
        type="button"
        className="toolbar-button"
        onClick={handleUndo}
        title="Undo"
      >
        <LuUndo2 />
      </button>

      <button
        type="button"
        className="toolbar-button"
        onClick={handleRedo}
        title="Redo"
      >
        <LuRedo2 />
      </button>

      <div className="toolbar-separator"></div>

      {/* Clear Formatting */}
      <button
        type="button"
        className="toolbar-button"
        onClick={handleClearFormatting}
        title="Clear Formatting"
      >
        <LuX />
      </button>
    </div>
  );
}
