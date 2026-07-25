#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const contentDir = process.argv[2];

if (!contentDir) {
  console.error("Usage: node scripts/add-legacy-covers.mjs CONTENT_DIR");
  process.exit(1);
}

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(fullPath) : [fullPath];
    }),
  );
  return nested.flat();
}

function localize(url) {
  return url
    .replace(/^https?:\/\/(?:www\.)?andresmarrugo\.net(?=\/)/, "")
    .replace(/^http:\/\//, "https://");
}

function yamlQuote(value) {
  return JSON.stringify(value);
}

let changed = 0;
let coversAdded = 0;

for (const file of await filesUnder(contentDir)) {
  if (!/\.(md|markdown)$/i.test(file)) continue;

  const original = await readFile(file, "utf8");
  const match = original.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) continue;

  let [, frontMatter, body] = match;
  body = body
    .replace(/src=(["'])http:\/\/(?:www\.)?andresmarrugo\.net(?=\/)/gi, "src=$1")
    .replace(/src=(["'])http:\/\/farm(\d+)\.staticflickr\.com/gi, "src=$1https://farm$2.staticflickr.com");

  if (!/^cover:\s*$/m.test(frontMatter)) {
    const socialImages = [...frontMatter.matchAll(/^[ \t]+image:[ \t]*(.*)$/gm)]
      .map((item) => item[1].trim().replace(/^["']|["']$/g, ""))
      .filter((item) => item && !item.includes("example.com"));
    const firstImage = body.match(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i);
    const markdownImage = body.match(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/);
    const image = localize(socialImages[0] || firstImage?.[1] || markdownImage?.[2] || "");

    if (image) {
      const title = frontMatter.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] || "";
      const inlineImage = localize(firstImage?.[1] || markdownImage?.[2] || "");
      const inlineAlt = firstImage
        ? firstImage[0].match(/\balt=["']([^"']*)["']/i)?.[1]
        : markdownImage?.[1];
      const alt = inlineAlt || title;
      const hiddenInSingle = inlineImage === image;
      const cover = [
        "cover:",
        `  image: ${yamlQuote(image)}`,
        `  alt: ${yamlQuote(alt)}`,
        "  relative: false",
        `  hiddenInSingle: ${hiddenInSingle}`,
      ].join("\n");

      frontMatter = `${frontMatter}\n${cover}`;
      coversAdded += 1;
    }
  }

  const updated = `---\n${frontMatter}\n---\n${body}`;
  if (updated !== original) {
    await writeFile(file, updated);
    changed += 1;
  }
}

console.log(`Updated ${changed} posts and added ${coversAdded} PaperMod covers in ${contentDir}.`);
