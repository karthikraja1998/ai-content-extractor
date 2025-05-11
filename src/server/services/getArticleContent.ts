/**
 * @jest-environment node
 */
import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

export default function cleanArticleContent(HTML: string): Promise<string[]> {
  const $ = cheerio.load(HTML);
  let content = "";
  $(
    "script, style, noscript, iframe, nav, footer, header, aside, button, form",
  ).remove();
  $("p, article, section, .content, .article-body, .post-content").each(
    (i: number, elem: AnyNode) => {
      const element = $(elem);
      const text = element.text().trim();
      const paragraphs = text.split(/\n+/); // Split text into individual paragraphs

      paragraphs.forEach((paragraph) => {
        const trimmedParagraph = paragraph.trim();
        const textLength = trimmedParagraph.replace(/\s+/g, "").length; // Exclude whitespace from length calculation
        const wordCount = trimmedParagraph.split(/\s+/).length; // Count words
        const links = element.find("a").length;
        const linkDensity = links / textLength;

        console.log(`Processing paragraph: "${trimmedParagraph}"`);
        console.log(
          `Text length: ${textLength}, Word count: ${wordCount}, Link density: ${linkDensity}`,
        );

        // Adjusted filters
        if ((textLength < 40 && wordCount < 5) || linkDensity > 0.1) {
          console.log("Excluding paragraph based on filters.");
          return;
        }

        if (trimmedParagraph) {
          content += trimmedParagraph + "\n\n";
        }
      });
    },
  );
  if (!content.trim()) {
    return Promise.resolve([""]);
  }
  content = content
    .replace(/\s+/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n+/g, "\n")
    .trim();

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
      let foundSplitPoint = false;
      while (end > start && text[end] !== "\n" && text[end] !== ".") {
        end--;
        if (end - start <= charLimit * 0.8) {
          // Prevent excessive shrinking
          foundSplitPoint = true;
          break;
        }
      }
      if (!foundSplitPoint) {
        end = start + charLimit; // Force split if no suitable point is found
      }
    }
    chunks.push(text.slice(start, end).trim());
    start = end;
  }
  return chunks;
};
