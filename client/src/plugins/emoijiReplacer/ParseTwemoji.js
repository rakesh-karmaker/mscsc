import { parse } from "twemoji-parser";

function parseTwemoji(emoji) {
  const [twemoji] = parse(emoji);

  return {
    src: twemoji.url,
    alt: twemoji.text,
    class: "emoji",
    draggable: "false",
  };
}

export { parseTwemoji };
