// Fetches the titles of the problems shown in the app from Project Euler, into
// src/lib/titles.json. Runs before dev and build; when Project Euler can't be
// reached, the committed file is kept as is.
// Usage: pnpm titles
import { readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PROBLEMS_DIR = resolve(ROOT, 'src/problems');
const OUTPUT = resolve(ROOT, 'src/lib/titles.json');
const SOURCE = 'https://projecteuler.net/minimal=problems';

/** The app shows every solved problem and the one after the last solved. */
function shownIds() {
  const solved = readdirSync(PROBLEMS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((dir) => readdirSync(resolve(PROBLEMS_DIR, dir.name)))
    .map((file) => /^euler(\d{3})\.ts$/.exec(file)?.[1])
    .filter(Boolean)
    .map(Number);
  return new Set([...solved, Math.max(0, ...solved) + 1]);
}

/** Titles may hold a little HTML (`<sup>`, `&amp;`) and MathJax `$` delimiters. */
function toPlainText(title) {
  return title
    .replace(/<[^>]+>/g, '')
    .replaceAll('$', '')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .trim();
}

async function main() {
  let text;
  try {
    const response = await fetch(SOURCE, {
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    text = await response.text();
  } catch (error) {
    console.warn(
      `Problem titles not refreshed (${error.message}), keeping the current ones.`,
    );
    return;
  }

  const ids = shownIds();
  const titles = {};
  // First line is the header: ID##Title##Published##Solved By
  for (const line of text.trim().split('\n').slice(1)) {
    const [id, title] = line.split('##');
    if (ids.has(Number(id)) && title) {
      titles[id] = toPlainText(title);
    }
  }
  writeFileSync(OUTPUT, `${JSON.stringify(titles, null, 2)}\n`);
  console.log(`Fetched ${Object.keys(titles).length} problem titles.`);
}

await main();
