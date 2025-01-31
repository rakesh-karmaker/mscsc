import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm"; // Add this import to handle strikethrough

import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";

export function markdownToHtml(markdownText) {
  const file = remark()
    .use(remarkGfm) // Use this plugin to handle strikethrough
    .use(remarkHtml)
    .processSync(markdownText);
  return String(file);
}

export function htmlToMarkdown(htmlText) {
  const file = remark()
    .use(rehypeParse, { emitParseErrors: true, duplicateAttribute: false })
    .use(rehypeRemark)
    .use(remarkGfm) // Use this plugin to handle strikethrough
    .use(remarkStringify)
    .processSync(htmlText);

  return String(file);
}
