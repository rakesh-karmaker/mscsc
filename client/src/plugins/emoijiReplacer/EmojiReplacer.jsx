import { Node, PasteRule } from "@tiptap/core";
import {
  EMOJI_EMOTICONS,
  EMOTICON_REGEX_PASTE,
  UNICODE_REGEX,
  UNICODE_REGEX_PASTE,
} from "./Emojis";
import { parseTwemoji } from "./ParseTwemoji";

const EmojiReplacer = Node.create({
  name: "emojiReplacer",
  group: "inline",
  inline: true,
  selectable: false,
  atom: true,

  addAttributes() {
    return {
      emoji: {
        default: null,
        parseHTML: (element) => element.children[0].getAttribute("alt"),
        renderHTML: (attributes) => {
          if (!attributes.emoji) {
            return {};
          }

          if (UNICODE_REGEX.test(attributes.emoji)) {
            return parseTwemoji(attributes.emoji);
          }

          return parseTwemoji(EMOJI_EMOTICONS[attributes.emoji]);
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-emoji-replacer]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", { "data-emoji-replacer": "" }, ["img", HTMLAttributes]];
  },

  renderText({ node }) {
    return node.attrs.emoji;
  },

  addCommands() {
    return {
      insertEmoji:
        (emoji) =>
        ({ tr, dispatch }) => {
          const node = this.type.create({ emoji });

          if (dispatch) {
            tr.replaceRangeWith(tr.selection.from, tr.selection.to, node);
          }

          return true;
        },
    };
  },

  addPasteRules() {
    return [
      new PasteRule({
        find: EMOTICON_REGEX_PASTE,
        handler: ({ state, range, match }) => {
          console.log("EMOTICON_REGEX_PASTE handler called");
          const { tr } = state;

          // Check if the match is part of a URL
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const textAroundMatch = state.doc.textBetween(
            Math.max(0, range.from - 10),
            Math.min(state.doc.content.size, range.to + 10),
            " "
          );

          console.log("Text around match:", textAroundMatch);

          if (urlRegex.test(textAroundMatch)) {
            console.log("Match is part of a URL, skipping replacement.");
            return;
          }

          tr.replaceWith(
            range.from,
            range.to,
            this.type.create({
              emoji: match[0].trim(),
            })
          );
        },
      }),
      new PasteRule({
        find: UNICODE_REGEX_PASTE,
        handler: ({ state, range, match }) => {
          console.log("UNICODE_REGEX_PASTE handler called");
          const { tr } = state;

          // Check if the match is part of a URL
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const textAroundMatch = state.doc.textBetween(
            Math.max(0, range.from - 10),
            Math.min(state.doc.content.size, range.to + 10),
            " "
          );

          console.log("Text around match:", textAroundMatch);

          if (urlRegex.test(textAroundMatch)) {
            console.log("Match is part of a URL, skipping replacement.");
            return;
          }

          tr.replaceWith(
            range.from,
            range.to,
            this.type.create({
              emoji: match[0].trim(),
            })
          );
        },
      }),
    ];
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

export { EmojiReplacer };
