#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [contentDir, languagePrefix = ""] = process.argv.slice(2);

if (!contentDir) {
  console.error("Usage: node scripts/normalize-content.mjs CONTENT_DIR [URL_PREFIX]");
  process.exit(1);
}

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(fullPath) : [fullPath];
    }),
  );
  return files.flat();
}

let changed = 0;

for (const file of await filesUnder(contentDir)) {
  if (!/\.(md|markdown)$/i.test(file)) continue;

  const original = await readFile(file, "utf8");
  let content = original.replace(
    /^date:\s*(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(?::\d{2})?\s*$/m,
    "date: $1T$2:00-05:00",
  );

  if (languagePrefix) {
    content = content.replace(/^url:\s*(\/.*)$/m, (_match, url) => {
      if (url === languagePrefix || url.startsWith(`${languagePrefix}/`)) return `url: ${url}`;
      return `url: ${languagePrefix}${url}`;
    });
  }

  if (content !== original) {
    await writeFile(file, content);
    changed += 1;
  }
}

console.log(`Normalized ${changed} files in ${contentDir}`);
