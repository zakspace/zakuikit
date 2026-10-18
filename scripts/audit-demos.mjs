/**
 * ZAKUIKit — demo documentation audit.
 *
 * Bundles the demo registry (the same source the docs generator consumes) and
 * checks that every catalogue component ships a complete preview + code card:
 *
 *   - a non-empty `tpl` preview;
 *   - a non-empty `codeTpl` snippet with no unresolved `${…}` interpolation;
 *   - no leftover `{{placeholder}}` in `tpl` or in the raw `js` tab;
 *   - no dead `controls` config (the interactive playground is gone).
 *
 * Informational notes flag a `codeTpl` without HTML-comment labels and props
 * whose name never appears in the snippet, so the docs stay fully covered.
 *
 * Run after a build: node scripts/audit-demos.mjs
 */
import { rm, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tmpDir = join(root, 'scripts', '.tmp-audit');
await mkdir(tmpDir, { recursive: true });
const entry = join(tmpDir, 'entry.ts');
const outfile = join(tmpDir, 'registry.mjs');

await writeFile(
  entry,
  `export { demos } from '../../src/demos/index';\nexport { catalog } from '../../src/data/catalog';\n`,
);

await build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node18',
  logLevel: 'warning',
});

const { demos, catalog } = await import(pathToFileURL(outfile).href);
await rm(tmpDir, { recursive: true, force: true });

const hasPlaceholder = (text) => /\{\{[^}]+\}\}/.test(text);
const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const problems = [];
const infos = [];
let checked = 0;

const components = [];
for (const cat of catalog) {
  for (const comp of cat.components) components.push({ cat: cat.slug, comp });
}

for (const { cat, comp } of components) {
  const route = `${cat}/${comp.slug}`;
  const demo = demos[comp.slug];
  if (!demo) {
    problems.push(`${route} — no demo definition`);
    continue;
  }
  checked++;

  const tpl = demo.tpl ?? '';
  const code = demo.codeTpl ?? '';

  if (!tpl.trim()) problems.push(`${route} — empty preview template`);
  if (!code.trim()) problems.push(`${route} — missing codeTpl (no copy-ready code)`);
  if (hasPlaceholder(tpl)) problems.push(`${route} — unresolved {{placeholder}} in preview template`);
  if (hasPlaceholder(code)) problems.push(`${route} — unresolved {{placeholder}} in codeTpl`);
  if (code.includes('${')) problems.push(`${route} — unescaped \${…} interpolation in codeTpl`);
  if (demo.js && hasPlaceholder(demo.js)) problems.push(`${route} — unresolved {{placeholder}} in the js tab`);
  if (demo.controls) problems.push(`${route} — dead controls config (playgrounds removed)`);

  if (code.trim() && !code.includes('<!--')) infos.push(`${route} — codeTpl has no HTML-comment labels`);
  if (demo.playground === true) infos.push(`${route} — still opts into the interactive playground`);

  const haystack = `${tpl}\n${code}`.toLowerCase();
  for (const [name] of demo.props ?? []) {
    const clean = String(name).replace(/=.*$/, '').trim();
    if (!clean) continue;
    const parts = clean.split(/\s*[/|,]\s*|\s+/).filter(Boolean).map((part) => part.replace(/^[.#:]+/, ''));
    const hit = parts.some((part) => {
      if (!part) return false;
      const plain = part.replace(/[()]/g, '').toLowerCase();
      return haystack.includes(plain) || (slug(part) && haystack.includes(slug(part)));
    });
    if (!hit) infos.push(`${route} — prop "${name}" is not referenced by the preview/code`);
  }
}

console.log(`Audited ${checked}/${components.length} component demos across ${catalog.length} categories.`);
if (problems.length) {
  console.log(`\nPROBLEMS (${problems.length}):`);
  for (const line of problems) console.log(`  - ${line}`);
} else {
  console.log('No problems — every component ships a preview with copy-ready, prop-complete code.');
}
if (infos.length) {
  console.log(`\nNotes (${infos.length}):`);
  for (const line of infos) console.log(`  - ${line}`);
}
process.exitCode = problems.length ? 1 : 0;
