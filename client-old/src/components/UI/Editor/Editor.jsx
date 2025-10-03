import { useState, useCallback, useRef, useEffect } from "react";
import { CustomToolbar } from "./CustomToolbar";
import "./Editor.css";

// Import KaTeX for math rendering
import katex from "katex";

export default function Editor({ content = "", register }) {
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showMathMenu, setShowMathMenu] = useState(false);
  const [mathInput, setMathInput] = useState("");
  const [mathType, setMathType] = useState("inline");
  const editorRef = useRef(null);
  const contentRef = useRef(null);
  const [editingMathId, setEditingMathId] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [currentUndoIndex, setCurrentUndoIndex] = useState(-1);

  // Initialize editor with content and ensure proper structure
  useEffect(() => {
    if (contentRef.current) {
      if (content) {
        contentRef.current.innerHTML = content;
      } else {
        // If no initial content, add an empty paragraph
        contentRef.current.innerHTML = "<p><br></p>";
      }

      renderAllMath();
      // Initialize undo stack with initial content
      setUndoStack([contentRef.current.innerHTML]);
      setCurrentUndoIndex(0);
    }
  }, [content]);

  // Load KaTeX CSS
  useEffect(() => {
    if (typeof document !== "undefined") {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css";
      link.integrity =
        "sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn";
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }
  }, []);

  // Render all math elements in the editor
  const renderAllMath = useCallback(() => {
    if (!contentRef.current || typeof window === "undefined" || !window.katex)
      return;

    const mathElements = contentRef.current.querySelectorAll(
      "[data-math-formula]"
    );
    mathElements.forEach((el) => {
      try {
        // Get the formula from the data attribute
        const formula = el.getAttribute("data-math-formula") || "";
        if (!formula) return;

        // Clear the element first
        el.innerHTML = "";

        // Render the formula
        window.katex.render(formula, el, {
          throwOnError: false,
          displayMode: el.classList.contains("math-block"),
        });

        // Add "double-click to edit" text only if the math block is inside the editor
        if (contentRef.current.contains(el)) {
          const editHint = document.createElement("span");
          editHint.className = "math-edit-hint";
          editHint.textContent = " (double-click to edit)";
          el.appendChild(editHint);
        }
      } catch (e) {
        console.error("KaTeX rendering error:", e);
      }
    });
  }, []);

  // Save current state to undo stack
  const saveToUndoStack = useCallback(() => {
    if (!contentRef.current) return;

    const currentContent = contentRef.current.innerHTML;

    // Only save if content has changed
    if (undoStack[currentUndoIndex] !== currentContent) {
      // Remove any redo states
      const newStack = undoStack.slice(0, currentUndoIndex + 1);
      newStack.push(currentContent);

      setUndoStack(newStack);
      setCurrentUndoIndex(newStack.length - 1);
    }
  }, [undoStack, currentUndoIndex]);

  // Custom undo function
  const handleUndo = useCallback(() => {
    if (currentUndoIndex > 0 && contentRef.current) {
      const newIndex = currentUndoIndex - 1;
      contentRef.current.innerHTML = undoStack[newIndex];
      setCurrentUndoIndex(newIndex);
      renderAllMath();
    }
  }, [currentUndoIndex, undoStack, renderAllMath]);

  // Custom redo function
  const handleRedo = useCallback(() => {
    if (currentUndoIndex < undoStack.length - 1 && contentRef.current) {
      const newIndex = currentUndoIndex + 1;
      contentRef.current.innerHTML = undoStack[newIndex];
      setCurrentUndoIndex(newIndex);
      renderAllMath();
    }
  }, [currentUndoIndex, undoStack, renderAllMath]);

  // Add a new function to ensure content is always wrapped in paragraphs
  const ensureContentStructure = useCallback(() => {
    if (!contentRef.current) return;

    // If the editor is completely empty, add a paragraph
    if (contentRef.current.innerHTML.trim() === "") {
      contentRef.current.innerHTML = "<p><br></p>";
      return;
    }

    // Check if there are any direct text nodes (not wrapped in paragraphs)
    let hasDirectTextNodes = false;
    for (let i = 0; i < contentRef.current.childNodes.length; i++) {
      const node = contentRef.current.childNodes[i];
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        hasDirectTextNodes = true;
        break;
      }
    }

    // If there are direct text nodes, wrap all content in paragraphs
    if (hasDirectTextNodes) {
      const tempDiv = document.createElement("div");

      // Move all content to the temp div
      while (contentRef.current.firstChild) {
        tempDiv.appendChild(contentRef.current.firstChild);
      }

      // Create a paragraph and move all content from temp div to it
      const paragraph = document.createElement("p");
      while (tempDiv.firstChild) {
        paragraph.appendChild(tempDiv.firstChild);
      }

      // Add the paragraph to the editor
      contentRef.current.appendChild(paragraph);
    }
  }, []);

  // Helper function to check if content is effectively empty
  const isContentEmpty = useCallback((element) => {
    // If there are no child nodes, it's empty
    if (element.childNodes.length === 0) {
      return true;
    }

    // Check if it only contains a single paragraph with just a <br> or nothing
    if (element.childNodes.length === 1) {
      const child = element.childNodes[0];

      // If it's a paragraph
      if (child.nodeName === "P") {
        // Empty or just contains a BR
        if (!child.textContent || child.textContent.trim() === "") {
          if (
            child.childNodes.length === 0 ||
            (child.childNodes.length === 1 &&
              child.childNodes[0].nodeName === "BR")
          ) {
            return true;
          }
        }
      }

      // If it's just a <br> tag
      if (child.nodeName === "BR") {
        return true;
      }
    }

    return false;
  }, []);

  // Update the handleContentChange function to ensure proper structure
  const handleContentChange = useCallback(() => {
    if (contentRef.current && register) {
      // Ensure content is properly structured
      ensureContentStructure();

      // First render all math
      renderAllMath();

      // Save to undo stack
      saveToUndoStack();

      // Check if the content is effectively empty
      const isEmpty = isContentEmpty(contentRef.current);

      // If the content is effectively empty, set it to an empty string
      if (isEmpty) {
        register.onChange({
          target: {
            name: "content",
            value: "",
          },
        });
      } else {
        // Otherwise, update with the current HTML content
        register.onChange({
          target: {
            name: "content",
            value: contentRef.current.innerHTML.trim(),
          },
        });
      }
    }
  }, [
    register,
    renderAllMath,
    saveToUndoStack,
    ensureContentStructure,
    isContentEmpty,
  ]);

  // Add a function to save and restore selection
  const [savedSelection, setSavedSelection] = useState(null);

  // Add this function to save the current selection
  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0).cloneRange());
    }
  }, []);

  // Add this function to restore the saved selection
  const restoreSelection = useCallback(() => {
    if (savedSelection && contentRef.current) {
      contentRef.current.focus();
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelection);
      }
    }
  }, [savedSelection]);

  // Update the handleLinkClick function to preserve selection
  const handleLinkClick = useCallback(() => {
    // Store the current selection before opening the link menu
    if (contentRef.current) {
      contentRef.current.focus();
    }
    saveSelection();
    setShowLinkMenu(true);
    setLinkUrl("");
  }, [saveSelection]);

  // Update the math click handler to save selection
  const handleMathClick = useCallback(
    (type) => {
      // Save the current selection before opening the math menu
      saveSelection();
      setEditingMathId(null);
      setMathType(type);
      setShowMathMenu(true);
      setMathInput("");
    },
    [saveSelection]
  );

  // Generate a unique ID for math elements
  const generateMathId = useCallback(() => {
    return `math-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }, []);

  // Add a function to handle double-click on math elements
  const handleDoubleClick = useCallback(
    (e) => {
      const target = e.target;
      const mathElement = target.closest("[data-math-formula]");

      if (mathElement) {
        e.preventDefault();

        // Get the formula from the element
        const formula = mathElement.getAttribute("data-math-formula") || "";
        const mathId = mathElement.getAttribute("id") || "";
        const isBlock = mathElement.classList.contains("math-block");

        // Open the math editor with the current formula
        setMathInput(formula);
        setMathType(isBlock ? "block" : "inline");
        setEditingMathId(mathId);
        setShowMathMenu(true);

        // Store the element to be updated
        const selection = window.getSelection();
        if (selection) {
          const range = document.createRange();
          range.selectNode(mathElement);
          selection.removeAllRanges();
          selection.addRange(range);
          saveSelection();
        }
      }
    },
    [saveSelection]
  );

  // Add a function to handle paste events for automatic link detection
  const handlePaste = useCallback(
    (e) => {
      // Check if the pasted content is plain text
      const text = e.clipboardData?.getData("text/plain");

      if (text && isValidUrl(text)) {
        e.preventDefault();

        // Create a link element
        const link = document.createElement("a");
        link.href = text;
        link.textContent = text;
        link.className = "editor-link";

        // Insert the link at the current selection
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(link);

          // Move cursor after the link
          range.setStartAfter(link);
          range.setEndAfter(link);
          selection.removeAllRanges();
          selection.addRange(range);

          handleContentChange();
        }
      }
    },
    [handleContentChange]
  );

  // Add a helper function to validate URLs
  const isValidUrl = (text) => {
    try {
      // Simple URL validation - checks if it starts with http:// or https://
      return /^(https?:\/\/|www\.)[^\s]+(\.[^\s]+)+/.test(text);
    } catch (e) {
      return false;
    }
  };

  // Ensure there's a paragraph after block math
  const ensureParagraphAfterMath = useCallback((mathElement) => {
    if (mathElement.classList.contains("math-block")) {
      // Check if there's already a paragraph after the math block
      const nextElement = mathElement.nextElementSibling;

      if (
        !nextElement ||
        (nextElement.tagName !== "P" && nextElement.tagName !== "DIV")
      ) {
        // Create a new paragraph
        const paragraph = document.createElement("p");
        paragraph.innerHTML = "<br>"; // Add a line break to make it selectable

        // Insert after the math block
        if (mathElement.nextSibling) {
          mathElement.parentNode?.insertBefore(
            paragraph,
            mathElement.nextSibling
          );
        } else {
          mathElement.parentNode?.appendChild(paragraph);
        }

        // Set cursor to the new paragraph
        const selection = window.getSelection();
        if (selection) {
          const range = document.createRange();
          range.setStart(paragraph, 0);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  }, []);

  // Update the insertMath function to create non-editable math elements with preserved formatting
  const insertMath = useCallback(() => {
    if (!mathInput.trim() || !contentRef.current) {
      setShowMathMenu(false);
      return;
    }

    // Save current state to undo stack before making changes
    saveToUndoStack();

    // Restore the saved selection
    restoreSelection();

    // Get the current selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setShowMathMenu(false);
      return;
    }

    // Generate a unique ID for this math element if not editing
    const mathId = editingMathId || generateMathId();

    // Create a math element
    const mathElement = document.createElement(
      mathType === "inline" ? "span" : "div"
    );
    mathElement.className =
      mathType === "inline" ? "math-inline" : "math-block";
    mathElement.setAttribute("data-math-formula", mathInput);
    mathElement.setAttribute("contenteditable", "false");
    mathElement.id = mathId;

    // Insert at the current selection
    const range = selection.getRangeAt(0);

    if (editingMathId) {
      // If editing, replace the existing element
      const existingMath = document.getElementById(editingMathId);
      if (existingMath) {
        existingMath.parentNode?.replaceChild(mathElement, existingMath);
      } else {
        range.deleteContents();
        range.insertNode(mathElement);
      }
    } else {
      // If new, insert at selection
      range.deleteContents();
      range.insertNode(mathElement);
    }

    // Render the math
    try {
      katex.render(mathInput, mathElement, {
        throwOnError: false,
        displayMode: mathType === "block",
      });
    } catch (e) {
      console.error("KaTeX rendering error:", e);
    }

    // For block math, ensure there's a paragraph after it
    if (mathType === "block") {
      ensureParagraphAfterMath(mathElement);
    } else {
      // For inline math, move cursor after the element
      range.setStartAfter(mathElement);
      range.setEndAfter(mathElement);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    setShowMathMenu(false);
    setMathInput("");
    setEditingMathId(null);
    handleContentChange();
  }, [
    mathInput,
    mathType,
    handleContentChange,
    restoreSelection,
    editingMathId,
    generateMathId,
    ensureParagraphAfterMath,
    saveToUndoStack,
  ]);

  // Add a keydown handler to ensure paragraphs are created when needed
  const handleKeyDown = useCallback(
    (e) => {
      if (!contentRef.current) return;

      // Handle keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z") {
          e.preventDefault();
          if (e.shiftKey) {
            // Ctrl+Shift+Z or Cmd+Shift+Z for Redo
            handleRedo();
          } else {
            // Ctrl+Z or Cmd+Z for Undo
            handleUndo();
          }
          return;
        } else if (e.key === "y") {
          // Ctrl+Y or Cmd+Y for Redo
          e.preventDefault();
          handleRedo();
          return;
        }
      }

      // Handle backspace key
      if (e.key === "Backspace") {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);

        // Check if the editor is effectively empty
        const isEmpty = isContentEmpty(contentRef.current);

        if (isEmpty) {
          e.preventDefault(); // Prevent the default backspace behavior

          // Ensure the editor has a single empty paragraph
          contentRef.current.innerHTML = "<p><br></p>";

          // Move the cursor to the empty paragraph
          const paragraph = contentRef.current.querySelector("p");
          if (paragraph) {
            const newRange = document.createRange();
            newRange.setStart(paragraph, 0);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }

          return;
        }

        // Handle backspace near math elements
        let mathElement = null;

        // Check if we're right after a math element
        const prevNode = range.startContainer.previousSibling;
        if (prevNode && prevNode.nodeType === Node.ELEMENT_NODE) {
          const prevElement = prevNode;
          if (prevElement.hasAttribute("data-math-formula")) {
            mathElement = prevElement;
          }
        }

        // If we found a math element, handle its deletion
        if (mathElement) {
          e.preventDefault(); // Prevent the default backspace behavior

          // Save current state to undo stack before deletion
          saveToUndoStack();

          // Remove the math element
          mathElement.parentNode?.removeChild(mathElement);

          // Trigger content change
          handleContentChange();
        }
      }

      // If the editor is empty and the user starts typing, ensure there's a paragraph
      if (
        contentRef.current.innerHTML.trim() === "" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        e.key.length === 1
      ) {
        // Let the default behavior happen first (character insertion)
        setTimeout(() => {
          ensureContentStructure();
        }, 0);
      }
    },
    [
      handleContentChange,
      handleRedo,
      handleUndo,
      saveToUndoStack,
      ensureContentStructure,
    ]
  );
  // Add a focus handler to ensure proper structure when the editor gets focus
  const handleFocus = useCallback(() => {
    saveSelection();
    ensureContentStructure();
  }, [saveSelection, ensureContentStructure]);

  // Add event listeners
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.addEventListener("dblclick", handleDoubleClick);
      contentRef.current.addEventListener("paste", handlePaste);
      contentRef.current.addEventListener("keydown", handleKeyDown);
      contentRef.current.addEventListener("focus", handleFocus);

      // Ensure proper structure on initial load
      ensureContentStructure();

      // Initial render of math elements
      renderAllMath();

      return () => {
        if (contentRef.current) {
          contentRef.current.removeEventListener("dblclick", handleDoubleClick);
          contentRef.current.removeEventListener("paste", handlePaste);
          contentRef.current.removeEventListener("keydown", handleKeyDown);
          contentRef.current.removeEventListener("focus", handleFocus);
        }
      };
    }
  }, [
    handleDoubleClick,
    handlePaste,
    handleKeyDown,
    handleFocus,
    renderAllMath,
    ensureContentStructure,
    contentRef,
  ]);

  // Re-render math when the editor content changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      renderAllMath();
    });

    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [renderAllMath]);

  return (
    <div className="editor-container" ref={editorRef}>
      <CustomToolbar
        contentRef={contentRef}
        onLinkClick={handleLinkClick}
        onMathClick={handleMathClick}
      />

      <div
        className="editor-content"
        ref={contentRef}
        contentEditable={true}
        onInput={handleContentChange}
        onBlur={handleContentChange}
        onFocus={handleFocus}
        onClick={saveSelection}
        suppressContentEditableWarning={true}
      />

      {showLinkMenu && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Insert Link</h3>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL"
              className="modal-input"
              autoFocus
            />
            <div className="modal-actions">
              <button
                className="button button-secondary"
                onClick={() => setShowLinkMenu(false)}
              >
                Cancel
              </button>
              <button
                className="button button-primary"
                onClick={() => {
                  if (!contentRef.current) {
                    setShowLinkMenu(false);
                    return;
                  }

                  // Save current state to undo stack before making changes
                  saveToUndoStack();

                  // Restore the saved selection
                  restoreSelection();

                  // Get the current selection
                  const selection = window.getSelection();
                  if (!selection || selection.rangeCount === 0) {
                    setShowLinkMenu(false);
                    return;
                  }

                  const range = selection.getRangeAt(0);
                  const selectedText = range.toString();

                  // Create a link element
                  const link = document.createElement("a");
                  link.href = linkUrl.startsWith("http")
                    ? linkUrl
                    : `https://${linkUrl}`;
                  link.textContent = selectedText || linkUrl;
                  link.className = "editor-link";

                  // Insert the link at the current selection
                  range.deleteContents();
                  range.insertNode(link);

                  // Move cursor after the link
                  range.setStartAfter(link);
                  range.setEndAfter(link);
                  selection.removeAllRanges();
                  selection.addRange(range);

                  setShowLinkMenu(false);
                  setLinkUrl("");
                  handleContentChange();
                }}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {showMathMenu && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              {mathType === "inline"
                ? "Insert Inline Math"
                : "Insert Math Block"}
            </h3>
            <p className="modal-description">
              Enter LaTeX formula (e.g., E = mc^2)
            </p>
            <p className="modal-hint">Use \\ for line breaks in block math</p>
            <textarea
              value={mathInput}
              onChange={(e) => setMathInput(e.target.value)}
              placeholder="Enter LaTeX formula"
              className="modal-textarea"
              autoFocus
            />
            <div className="modal-actions">
              <button
                className="button button-secondary"
                onClick={() => setShowMathMenu(false)}
              >
                Cancel
              </button>
              <button className="button button-primary" onClick={insertMath}>
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
