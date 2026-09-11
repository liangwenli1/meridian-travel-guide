#!/usr/bin/env node
/**
 * Fail if non–New York guide files still contain New York bleed tokens.
 *
 * Default scope: london, rome, seoul (the usual copy-paste casualties).
 * Pass --all to scan every guide under src/data/guides/ except new-york.ts.
 *
 * Tokens (substring match, case-sensitive enough for these proper nouns):
 *   MetroCard, Times Square, bodega, Ellis Island, OMNY, Harlem, Astoria, Williamsburg
 *
 * Usage:
 *   node scripts/lint-guide-bleed.mjs
 *   node scripts/lint-guide-bleed.mjs --all
 *   npm run lint:guide-bleed
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GUIDES = join(ROOT, "src/data/guides");

const TOKENS = [
  "MetroCard",
  "Times Square",
  "bodega",
  "Ellis Island",
  "OMNY",
  "Harlem",
  "Astoria",
  "Williamsburg",
];

const DEFAULT_FILES = ["london.ts", "rome.ts", "seoul.ts"];

function listTargets(all) {
  if (!all) return DEFAULT_FILES;
  return readdirSync(GUIDES).filter(
    (name) => name.endsWith(".ts") && name !== "new-york.ts" && name !== "index.ts" && name !== "gallery.ts",
  );
}

const all = process.argv.includes("--all");
const files = listTargets(all);
const hits = [];

for (const file of files) {
  const path = join(GUIDES, file);
  let source;
  try {
    source = readFileSync(path, "utf8");
  } catch {
    continue;
  }
  for (const token of TOKENS) {
    if (source.includes(token)) {
      hits.push(`${file}: contains "${token}"`);
    }
  }
}

if (hits.length) {
  console.error("NY bleed detected in city guides:\n" + hits.map((h) => `  - ${h}`).join("\n"));
  process.exit(1);
}

console.log(`lint-guide-bleed: ok (${files.length} file(s))`);
