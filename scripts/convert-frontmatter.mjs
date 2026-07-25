#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const [contentDir, publishedRoot, publishedSiteRoot] = process.argv.slice(2);

if (!contentDir || !publishedRoot || !publishedSiteRoot) {
  throw new Error(
    "Usage: convert-frontmatter.mjs CONTENT_DIR PUBLISHED_BLOG_ROOT PUBLISHED_SITE_ROOT",
  );
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const item = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(item) : [item];
  });
}

const publishedUrls = walk(publishedRoot)
  .filter((file) => path.basename(file) === "index.html")
  .map((file) => {
    const relative = path.relative(publishedSiteRoot, file).split(path.sep).join("/");
    return `/${relative.replace(/index\.html$/, "")}`;
  })
  .filter(
    (url) =>
      !url.includes("/categories/") &&
      !url.includes("/page/") &&
      !url.endsWith("/archives/"),
  );

const posts = walk(contentDir).filter((file) => /\.(md|markdown)$/i.test(file));

for (const file of posts) {
  const filename = path.basename(file).replace(/\.(md|markdown)$/i, "");
  const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, "");
  const matches = publishedUrls.filter((url) => url.endsWith(`/${slug}/`));

  if (matches.length !== 1) {
    throw new Error(`${file}: expected one published URL, found ${matches.length}`);
  }

  let source = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`${file}: missing YAML front matter`);
  }

  let frontMatter = match[1]
    .split("\n")
    .filter((line) => !/^layout:/.test(line))
    .filter((line) => !/^published:/.test(line))
    .filter((line) => !/^permalink:/.test(line));

  const dateIndex = frontMatter.findIndex((line) => /^date:/.test(line));
  const urlLine = `url: ${matches[0]}`;
  if (dateIndex >= 0) {
    frontMatter.splice(dateIndex + 1, 0, urlLine);
  } else {
    frontMatter.push(urlLine);
  }

  if (!frontMatter.some((line) => /^draft:/.test(line))) {
    frontMatter.push("draft: false");
  }

  const body = match[2]
    .replaceAll("{% raw %}", "")
    .replaceAll("{% endraw %}", "");

  fs.writeFileSync(
    file,
    `---\n${frontMatter.join("\n")}\n---\n\n${body.replace(/^\n+/, "")}`,
  );
}

console.log(`Converted ${posts.length} posts in ${contentDir}`);
