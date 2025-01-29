// import { remark } from "remark";
// import remarkHtml from "remark-html";
// import rehypeParse from "rehype-parse";
// import rehypeRemark from "rehype-remark";
// import remarkStringify from "remark-stringify";
// import TurndownService from "turndown";

// // Convert markdown to HTML using remark
// export function markdownToHtml(markdownText) {
//   const file = remark().use(remarkHtml).processSync(markdownText);
//   return String(file);
// }

// // Convert HTML to markdown using remark and rehype
// export function htmlToMarkdownRemark(htmlText) {
//   const file = remark()
//     .use(rehypeParse, { emitParseErrors: true, duplicateAttribute: false })
//     .use(rehypeRemark)
//     .use(remarkStringify)
//     .processSync(htmlText);

//   return String(file);
// }

// // Convert HTML to markdown using turndown (simpler alternative)
// export function htmlToMarkdownTurndown(htmlText) {
//   const turndownService = new TurndownService();
//   return turndownService.turndown(htmlText);
// }

// // Clean up fetched markdown by removing extra spaces after hyphens (list items)
// // This version will remove spaces after hyphens and before list item content
// export function cleanFetchedMarkdown(markdownText) {
//   return markdownText
//     .replace(/-\s+/g, "- ") // Removes extra spaces after hyphen in lists
//     .replace(/(\r?\n)-/g, "\n-") // Removes line breaks before hyphen
//     .replace(/- \s+/g, "- "); // Ensure that there is only one space after the hyphen
// }

import { remark } from "remark";
import remarkHtml from "remark-html";

import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";

export function markdownToHtml(markdownText) {
  const file = remark().use(remarkHtml).processSync(markdownText);
  return String(file);
}

export function htmlToMarkdown(htmlText) {
  const file = remark()
    .use(rehypeParse, { emitParseErrors: true, duplicateAttribute: false })
    .use(rehypeRemark)
    .use(remarkStringify)
    .processSync(htmlText);

  return String(file);
}
