// Generates the favicon and PWA icons from one SVG design: a copper "E" on slate,
// the same mark as the header logo (src/components/Logo.tsx).
// Usage: pnpm icons
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';

const PUBLIC_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../public',
);

const BACKGROUND = '#152330';
const GRID = '#1f3242';
const COPPER = '#d9995a';

/**
 * @param {{ maskable?: boolean }} options Maskable icons are full-bleed, with the
 * letter kept inside the 80% safe zone so any platform mask shape fits.
 */
function iconSvg({ maskable = false } = {}) {
  // The logo is drawn on a 32 unit grid, scaled to 512.
  const scale = maskable ? 12 : 16;
  const offset = (512 - 32 * scale) / 2;
  const bar = (x, y, width, height) =>
    `<rect x="${offset + x * scale}" y="${offset + y * scale}" width="${width * scale}" height="${height * scale}" rx="${scale}"/>`;
  const gridLines = Array.from({ length: 15 }, (_, i) => (i + 1) * 32)
    .map(
      (p) =>
        `<path d="M${p} 0V512M0 ${p}H512" stroke="${GRID}" stroke-width="2"/>`,
    )
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <clipPath id="tile"><rect width="512" height="512" rx="${maskable ? 0 : 112}"/></clipPath>
  <g clip-path="url(#tile)">
    <rect width="512" height="512" fill="${BACKGROUND}"/>
    ${gridLines}
  </g>
  <g fill="${COPPER}">
    ${bar(9, 7, 4, 18)}${bar(9, 7, 14, 4)}${bar(9, 14, 10, 4)}${bar(9, 21, 14, 4)}
  </g>
</svg>
`;
}

const outputs = [
  { file: 'favicon.svg', svg: iconSvg() },
  { file: 'favicon.64.png', svg: iconSvg(), size: 64 },
  { file: 'favicon.512.png', svg: iconSvg(), size: 512 },
  { file: 'apple-touch-icon.png', svg: iconSvg({ maskable: true }), size: 180 },
  {
    file: 'icons/maskable-512x512.png',
    svg: iconSvg({ maskable: true }),
    size: 512,
  },
  ...[72, 96, 128, 144, 152, 192, 384, 512].map((size) => ({
    file: `icons/icon-${size}x${size}.png`,
    svg: iconSvg(),
    size,
  })),
];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const { file, svg, size } of outputs) {
  const target = resolve(PUBLIC_DIR, file);
  mkdirSync(dirname(target), { recursive: true });
  if (!size) {
    writeFileSync(target, svg);
  } else {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<html><body style="margin:0;background:transparent">
        <img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" width="${size}" height="${size}" style="display:block">
      </body></html>`,
    );
    await page.screenshot({ path: target, omitBackground: true });
  }
  console.log(`wrote public/${file}`);
}

await browser.close();
