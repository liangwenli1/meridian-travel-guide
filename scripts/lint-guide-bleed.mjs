#!/usr/bin/env node
/**
 * Fail if *published* non–New York guide files still contain New York bleed tokens.
 * Coming-soon cities (London / Rome / Seoul today) are skipped until rewritten.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GUIDES = join(ROOT, "src/data/guides");
const CITIES = join(ROOT, "src/data/cities.ts");

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

function comingSoonSlugs() {
  const source = readFileSync(CITIES, "utf8");
  const unpublished = new Set();
  const chunks = source.split("id:");
  for (const chunk of chunks) {
    const id = chunk.match(/^\s*"([^"]+)"/)?.[1];
    if (!id) continue;
    const window = chunk.slice(0, 1800);
    if (window.includes('contentStatus: "coming-soon"')) unpublished.add(id);
  }
  return unpublished;
}

const all = process.argv.includes("--all");
const unpublished = comingSoonSlugs();
const files = (
  all
    ? readdirSync(GUIDES).filter(
        (name) => name.endsWith(".ts") && name !== "new-york.ts" && name !== "index.ts" && name !== "gallery.ts",
      )
    : ["london.ts", "rome.ts", "seoul.ts"]
).filter((file) => !unpublished.has(file.replace(/\.ts$/, "")));

const hits = [];
for (const file of files) {
  const source = readFileSync(join(GUIDES, file), "utf8");
  for (const token of TOKENS) {
    if (source.includes(token)) hits.push(`${file}: contains "${token}"`);
  }
}

if (hits.length) {
  console.error("NY bleed detected in published city guides:\n" + hits.map((h) => `  - ${h}`).join("\n"));
  process.exit(1);
}

console.log(`lint-guide-bleed: ok (${files.length} published file(s); unpublished skipped)`);
