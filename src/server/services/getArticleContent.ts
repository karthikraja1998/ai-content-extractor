import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

export default function cleanArticleContent(HTML: string): Promise<string[]> {
  console.log("original content length is ", HTML.length);
  const $ = cheerio.load(HTML);
  let content = "";
  $(
    "script, style, noscript, iframe, nav, footer, header, aside, button, form",
  ).remove();
  $("p, article, section, .content, .article-body, .post-content").each(
    (i: number, elem: AnyNode) => {
      const element = $(elem);
      const text = element.text().trim();
      const textLength = text.length;
      const links = element.find("a").length;
      const linkDensity = links / textLength;
      if (textLength < 40 || linkDensity > 0.2) return;
      if (text) {
        content += text + "\n\n";
      }
    },
  );
  content = content
    .replace(/\s+/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n+/g, "\\n")
    .trim();
  console.log("Final content length is:", content.length);
  return splitIntoChunks(content, 8000);
}

const splitIntoChunks = async (text: string, charLimit: number) => {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = start + charLimit;
    if (end >= text.length) {
      end = text.length;
    } else {
      while (end < text.length && text[end] !== "\n" && text[end] !== ".") {
        end++;
      }
      if (end === text.length) {
        end = text.length;
      }
    }
    chunks.push(text.slice(start, end + 1));
    start = end + 1;
  }
  console.log("🚀 ~ splitIntoChunks ~ chunks:", chunks);
  return chunks;
};
