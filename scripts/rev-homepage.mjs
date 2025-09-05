#!/usr/bin/env node
/**
 * Generate content hash query params for homepage static assets (CSS & JS)
 * and update index.html references automatically.
 *
 * Usage: pnpm run homepage:rev
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd(), 'homepage');
const indexFile = resolve(root, 'index.html');

if (!existsSync(indexFile)) {
  console.error('[rev] Cannot find homepage/index.html');
  process.exit(1);
}

function fileHash(path) {
  const buf = readFileSync(path);
  return createHash('sha1').update(buf).digest('hex').slice(0, 10); // short hash
}

// Targets we want to revise
const assets = [
  { rel: /<link[^>]+href="assets\/css\/style.css\?v=[^"]*"/i, path: resolve(root, 'assets/css/style.css'), tag: 'css' },
  { rel: /<script[^>]+src="assets\/js\/main.js\?v=[^"]*"/i, path: resolve(root, 'assets/js/main.js'), tag: 'js' }
];

let html = readFileSync(indexFile, 'utf8');
let changed = false;

for (const a of assets) {
  if (!existsSync(a.path)) {
    console.warn(`[rev] Skip missing ${a.tag} asset: ${a.path}`);
    continue;
  }
  const h = fileHash(a.path);
  // Replace existing v query or append if missing
  if (a.rel.test(html)) {
    html = html.replace(a.rel, (m) => m.replace(/\?v=[^"]*/i, `?v=${h}`));
  } else {
    // attempt to find plain reference without version
    const plainRegex = new RegExp(`(href|src)="assets\\/${a.tag === 'css' ? 'css/style.css' : 'js/main.js'}"`);
    if (plainRegex.test(html)) {
      html = html.replace(plainRegex, (m) => m.replace(/"$/, `?v=${h}"`));
    } else {
      console.warn(`[rev] Could not locate tag for ${a.tag} to update.`);
      continue;
    }
  }
  changed = true;
  console.log(`[rev] Updated ${a.tag} version -> ${h}`);
}

if (changed) {
  writeFileSync(indexFile, html, 'utf8');
  console.log('[rev] index.html updated successfully.');
} else {
  console.log('[rev] No changes applied.');
}
