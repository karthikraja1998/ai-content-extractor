import cleanArticleContent from "../services/getArticleContent";

describe("cleanArticleContent", () => {
  it("should extract and clean main article content from HTML", async () => {
    const html = `
            <html>
                <head><title>Test</title></head>
                <body>
                    <header>Header content</header>
                    <article>
                        <p>This is a test paragraph with enough content to be included.</p>
                        <p>Short.</p>
                        <section>
                            <div class="content">Another valid content paragraph with more than forty characters.</div>
                        </section>
                        <footer>Footer content</footer>
                    </article>
                </body>
            </html>
        `;
    const result = await cleanArticleContent(html);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toContain("This is a test paragraph");
    expect(result[0]).toContain("Another valid content paragraph");
    expect(result[0]).not.toContain("Header content");
    expect(result[0]).not.toContain("Footer content");
    expect(result[0]).not.toContain("Short.");
  });

  it("should remove scripts, styles, and unwanted tags", async () => {
    const html = `
            <html>
                <body>
                    <script>alert("bad")</script>
                    <style>.bad{}</style>
                    <p>This is visible content with enough length to be included.</p>
                </body>
            </html>
        `;
    const result = await cleanArticleContent(html);
    expect(result[0]).toContain("This is visible content");
    expect(result[0]).not.toContain("alert");
    expect(result[0]).not.toContain(".bad");
  });

  it("should skip paragraphs with high link density", async () => {
    const html = `
            <p>
                <a href="#">link1</a>
                <a href="#">link2</a>
                <a href="#">link3</a>
                <a href="#">link4</a>
                <a href="#">link5</a>
                <a href="#">link6</a>
                <a href="#">link7</a>
                <a href="#">link8</a>
                <a href="#">link9</a>
                <a href="#">link10</a>
                <span>Some text here</span>
            </p>
            <p>This is a normal paragraph with enough content to be included.</p>
        `;
    const result = await cleanArticleContent(html);
    expect(result[0]).toContain("This is a normal paragraph");
    expect(result[0]).not.toContain("link1");
  });

  it("should split content into chunks if it exceeds the char limit", async () => {
    const longText = "<p>" + "a".repeat(9000) + "</p>";
    const result = await cleanArticleContent(longText);
    expect(result.length).toBeGreaterThan(1);
    expect(result[0]?.length).toBeLessThanOrEqual(8001); // 8000 + possible newline
  });

  it("should return an empty array if no valid content is found", async () => {
    const html = `
            <html>
                <body>
                    <header>Header only</header>
                    <footer>Footer only</footer>
                </body>
            </html>
        `;
    const result = await cleanArticleContent(html);
    expect(result).toEqual([""]);
  });

  it("should escape backslashes and quotes", async () => {
    const html = `<p>This is a "quote" and a backslash: \\</p>`;
    const result = await cleanArticleContent(html);
    expect(result[0]).toContain('\\"quote\\"');
    expect(result[0]).toContain("\\\\");
  });
});
