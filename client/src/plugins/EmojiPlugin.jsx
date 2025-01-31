import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import twemoji from "twemoji";

const EmojiNode = Node.create({
  name: "emoji",

  group: "inline",
  inline: true,
  selectable: false,
  atom: true,

  addAttributes() {
    return {
      emoji: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-emoji"),
        renderHTML: (attributes) => ({
          "data-emoji": attributes.emoji,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-emoji]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmojiComponent);
  },

  addCommands() {
    return {
      insertEmoji:
        (emoji) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { emoji },
          });
        },
    };
  },
});

const EmojiComponent = ({ node }) => {
  const emoji = node.attrs.emoji;
  return (
    <span
      data-emoji={emoji}
      dangerouslySetInnerHTML={{ __html: twemoji.parse(emoji) }}
    />
  );
};

export default EmojiNode;
