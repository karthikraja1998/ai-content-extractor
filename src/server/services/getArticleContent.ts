import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

export default function cleanArticleContent(HTML: string): Promise<string[]> {
  console.log("original content length is ", HTML.length);
  const $ = cheerio.load(HTML);
  let bestScore = -1;
  let bestElement: cheerio.Cheerio<AnyNode> | null = null;

  $("script, style, noscript, iframe, nav, footer").remove();

  $("p, div, article, section").each((i: number, elem: AnyNode) => {
    const element = $(elem);
    const text = element.text().trim();
    const textLength = text.length;
    if (textLength < 50) return;

    const links = element.find("a").length;
    const score = textLength - links * 10;

    if (score > bestScore) {
      bestScore = score;
      bestElement = element;
    }
  });

  let content = "";
  if (bestElement) {
    content = (bestElement as cheerio.Cheerio<AnyNode>)
      .text()
      .replace(/\s+/g, " ")
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n+/g, "\\n")
      .trim();
  }
  console.log("Final content length is:", content.length);
  return splitIntoChunks(content, 8000);
}

const splitIntoChunks = async (text: string, charLimit: number) => {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = start + charLimit;
    while (end < text.length && text[end] !== "\n" && text[end] !== ".") {
      end++;
    }
    chunks.push(text.slice(start, end + 1));
    start = end + 1;
  }
  console.log("🚀 ~ splitIntoChunks ~ chunks:", chunks);
  return chunks;
};
