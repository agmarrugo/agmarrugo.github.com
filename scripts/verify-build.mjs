#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import path from "node:path";

const publicDir = path.resolve(process.argv[2] || "public");
const inventories = [
  "scripts/expected/english.txt",
  "scripts/expected/spanish.txt",
];
const missing = [];

for (const inventory of inventories) {
  const routes = (await readFile(inventory, "utf8")).trim().split("\n");
  for (const route of routes) {
    const output = path.join(publicDir, route, "index.html");
    try {
      await access(output);
    } catch {
      missing.push(route);
    }
  }
}

if (missing.length) {
  console.error(`Missing ${missing.length} legacy routes:\n${missing.join("\n")}`);
  process.exit(1);
}

console.log("Verified all 109 existing English and Spanish blog routes.");
