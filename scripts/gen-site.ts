/**
 * ZAKUIKit — standalone documentation generator.
 *
 * Emits a single, framework-free `index.html` that documents every catalogue
 * component with an interactive playground card. It reuses the exact same data
 * and isomorphic helpers as the Astro site (catalog, demo registry, mustache-lite
 * template renderer, syntax highlighter and icon set) — no Astro, no runtime
 * framework. The output links the library `./zak.css`, inlines the docs-only
 * styles handed over by the build script (scripts/.docs-css.json) and boots
 * the theme inline (zero FOUC). Behaviour comes from `./zak-docs.js` — the
 * docs bundle (component runtimes + documentation chrome), keeping docs styles
 * and chrome out of the distributable zak.js.
 *
 * Run through `scripts/build-standalone.mjs` (which bundles this module with
 * esbuild, then executes it under Node).
 */
import { writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Paths are resolved from the working directory (the repo root when run via
// `npm run standalone`), not from this module's bundled location.
const root = process.cwd();

import { catalog, allComponents, totalComponentCount, type Category, type ComponentEntry } from '../src/data/catalog';
import { guideCategory, guidePages } from '../src/data/getstarted';
import { demos } from '../src/demos/index';
import {
  inferControls,
  defaultVars,
  fallbackProps,
  fallbackA11y,
  type DemoDef,
  type ControlDef,
  type PropRow,
} from '../src/demos/types';
import { renderTemplate } from '../src/lib/template';
import { highlight } from '../src/lib/highlight';
import { escapeHtml, inlineCode } from '../src/lib/strings';
import { svgIcon } from '../src/data/icons';
import {
  paletteScales,
  semanticTokens,
  spacingScale,
  radiusScale,
  shadowScale,
  typeScale,
  breakpoints,
} from '../src/data/tokens';

/* --------------------------------------------------------------------------
   Icon placeholder expansion.
   Demo templates carry readable `{icon('cls','name')}` markers that the Astro
   renderer never resolves (a latent bug). We expand them to inline SVG here so
   the standalone markup is correct without touching the shared demo data.
   -------------------------------------------------------------------------- */
function expandIcons(tpl: string): string {
  return tpl.replace(
    /\{icon\(\s*'([^']*)'\s*(?:,\s*'([^']*)'\s*)?\)\}/g,
    (_m, a: string, b?: string) => {
      // Two-arg form is icon(cls, name); single-arg is icon(name).
      const cls = b === undefined ? '' : a;
      const name = b === undefined ? a : b;
      return svgIcon(name, `zak-icon${cls ? ' ' + cls.trim() : ''}`, 16);
    },
  );
}

/* --------------------------------------------------------------------------
   Snippet compaction.
   The demo `tpl` strings are verbose — they render pixel-accurate previews but
   produce 20-40 line copy blocks. `compact()` turns them into idiomatic,
   component-based snippets: inline SVGs collapse to a single self-closing tag,
   `style="…"` noise is stripped, deep lists are truncated. Crucially, template
   placeholders `{{name}}` / `{{#section}}…{{/section}}` are preserved so the
   playground can re-render the compact snippet live when a control changes.
   -------------------------------------------------------------------------- */
function compact(html: string): string {
  let out = html;
  // Strip inline `style="…"` attributes (visual noise, not part of the API).
  out = out.replace(/\s+style="[^"]*"/g, '');
  // Collapse inline `<svg>…</svg>` blocks to a compact self-describing tag.
  out = out.replace(/<svg[^>]*>[\s\S]*?<\/svg>/g, (m) => {
    const cls = /class="([^"]*)"/.exec(m)?.[1] ?? 'zak-icon';
    const size = /width="([^"]*)"/.exec(m)?.[1];
    return `<svg class="${cls}"${size ? ` width="${size}" height="${size}"` : ''} aria-hidden="true"></svg>`;
  });
  // Drop decorative HTML comments (keep our ellipsis markers).
  out = out.replace(/<!--[\s\S]*?-->/g, (m) => (m.includes('…') ? m : ''));
  // Collapse long lists: 4+ items → first 2 + `<!-- … N more -->`.
  out = out.replace(/<(ul|ol)([^>]*)>([\s\S]*?)<\/\1>/g, (m, tag, attrs, inner) => {
    if (/\{\{/.test(inner)) return m; // never touch dynamic sections
    const items = inner.match(/<li[\s\S]*?<\/li>/g) ?? [];
    if (items.length <= 3) return m;
    return `<${tag}${attrs}>\n  ${items.slice(0, 2).join('\n  ')}\n  <!-- … ${items.length - 2} more -->\n</${tag}>`;
  });
  // Trim per-line trailing whitespace + collapse blank-line runs.
  out = out.split('\n').map((l) => l.replace(/\s+$/, '')).join('\n');
  out = out.replace(/\n{3,}/g, '\n\n');
  return out.trim();
}

/* --------------------------------------------------------------------------
   Shared chrome metadata.
   -------------------------------------------------------------------------- */
const statusClass: Record<string, string> = {
  stable: 'zak-badge--success',
  beta: 'zak-badge--primary',
  experimental: 'zak-badge--warning',
};
const statusLabel: Record<string, string> = { stable: 'Stable', beta: 'Beta', experimental: 'Experimental' };
const badgeClass: Record<string, string> = {
  new: 'zak-badge--success',
  ai: 'zak-badge--primary',
  updated: 'zak-badge--info',
};
const badgeLabel: Record<string, string> = { new: 'New', ai: 'AI', updated: 'Updated' };

const catId = (cat: string) => `cat-${cat}`;
const compId = (cat: string, comp: string) => `${cat}-${comp}`;
const guideId = (slug: string) => `gs-${slug}`;

/* --------------------------------------------------------------------------
   Design-token derivation (mirrors the component page logic).
   -------------------------------------------------------------------------- */
interface TokenMeta {
  light: string;
  dark: string;
  role: string;
}
const tokenMeta = new Map<string, TokenMeta>();
for (const scale of paletteScales) {
  for (const shade of scale.shades) {
    tokenMeta.set(`${scale.tokenPrefix}-${shade.shade}`, { light: shade.value, dark: '—', role: `${scale.name} · shade ${shade.shade}` });
  }
}
for (const t of semanticTokens) tokenMeta.set(t.token, { light: t.light, dark: t.dark, role: t.usage });
for (const t of spacingScale) tokenMeta.set(t.token, { light: t.value, dark: '—', role: 'Spacing step' });
for (const t of radiusScale) tokenMeta.set(t.token, { light: t.value, dark: '—', role: 'Corner radius' });
for (const t of shadowScale) tokenMeta.set(t.token, { light: '—', dark: '—', role: t.usage });
for (const t of typeScale) tokenMeta.set(t.token, { light: t.size, dark: '—', role: `${t.sample} · weight ${t.weight}` });
for (const t of breakpoints) tokenMeta.set(t.token, { light: t.value, dark: '—', role: t.usage });

/** Six tokens this demo/category consumes most often, for the token table. */
function tokenRows(demo: DemoDef, referenced: string): string[] {
  const demoTokens = demo.css ? Array.from(new Set(demo.css.match(/--zak-[a-z0-9-]+/g) ?? [])) : [];
  const counts = new Map<string, number>();
  for (const match of referenced.matchAll(/--zak-[a-z0-9-]+/g)) {
    counts.set(match[0], (counts.get(match[0]) ?? 0) + 1);
  }
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  const out: string[] = [];
  for (const t of [...demoTokens, ...ranked]) {
    if (!out.includes(t)) out.push(t);
    if (out.length >= 6) break;
  }
  return out;
}

/** Category → stylesheet, mirroring the component page's token source map. */
const CATEGORY_CSS_FILE: Record<string, string> = {
  utilities: 'tokens.css',
  layout: 'zak-layout.css',
  buttons: 'zak-buttons.css',
  forms: 'zak-forms.css',
  pickers: 'zak-pickers.css',
  'data-display': 'zak-display.css',
  tables: 'zak-display.css',
  'data-grid': 'zak-grid.css',
  navigation: 'zak-navigation.css',
  feedback: 'zak-feedback.css',
  overlays: 'zak-feedback.css',
  disclosure: 'zak-navigation.css',
  media: 'zak-media.css',
  'data-visualization': 'zak-media.css',
  ai: 'zak-ai.css',
};
const CATEGORY_TOKENS: Record<string, string> = {};
for (const [slug, file] of Object.entries(CATEGORY_CSS_FILE)) {
  try {
    CATEGORY_TOKENS[slug] = readFileSync(join(root, 'src', 'styles', file), 'utf8');
  } catch {
    CATEGORY_TOKENS[slug] = '';
  }
}

/* --------------------------------------------------------------------------
   Table + code renderers (plain HTML, data-code-* hooks for docs.ts).
   -------------------------------------------------------------------------- */

/**
 * Derive a concise "Usage" snippet — the component-based API call.
 * For complex interactive components, shows the minimal declarative HTML
 * that activates the runtime (one element + data-zak-* config attributes).
 * For simple CSS-only components (≤ 4 lines), returns empty — the compact
 * HTML already IS the usage.
 */
const CHROME_ATTRS = new Set([
  'data-zak-cal-prev', 'data-zak-cal-next', 'data-zak-cal-title',
  'data-zak-picker-toggle', 'data-zak-picker-clear', 'data-zak-picker-apply',
  'data-zak-picker-value', 'data-zak-picker-text', 'data-zak-color-trigger',
  'data-zak-color-copy', 'data-zak-swatches', 'data-zak-hue',
  'data-zak-time-part', 'data-zak-time-value',
]);

function deriveUsage(demo: DemoDef, compacted: string): string {
  if (demo.usage) return demo.usage;
  const lines = compacted.split('\n').filter((l) => l.trim()).length;
  if (lines <= 4) return '';

  const rootMatch = /<(\w+)([^>]*)>/.exec(compacted);
  if (!rootMatch) return '';

  // Only collect data-zak-* config attributes from the ROOT element.
  const rootAttrs = rootMatch[2];
  const configAttrs: Array<[string, string]> = [];
  const re = /(data-zak-[\w-]+)(?:="([^"]*)")?/g;
  let m;
  while ((m = re.exec(rootAttrs)) !== null) {
    if (!CHROME_ATTRS.has(m[1]) && !configAttrs.some(([k]) => k === m[1])) {
      configAttrs.push([m[1], m[2] ?? '']);
    }
  }
  if (configAttrs.length === 0) return '';

  const tag = rootMatch[1];
  const cls = /class="([^"]*)"/.exec(rootAttrs)?.[1] ?? '';
  const attrs = configAttrs.map(([k, v]) => v ? `\n  ${k}="${v}"` : `\n  ${k}`).join('');
  return `<!-- Just declare this — the runtime generates the rest -->\n<${tag}${cls ? ` class="${cls}"` : ''}${attrs}\n></${tag}>`;
}
function propTable(rows: PropRow[], head = ['Property', 'Type', 'Default', 'Description']): string {
  const thead = head.map((th) => `<th scope="col">${escapeHtml(th)}</th>`).join('');
  const body = rows
    .map(([name, type, def, desc]) =>
      `<tr><td><code>${escapeHtml(name)}</code></td><td class="col-type">${escapeHtml(type)}</td>` +
      `<td class="col-default">${escapeHtml(def)}</td><td>${inlineCode(desc)}</td></tr>`)
    .join('');
  return `<div class="doc-table-wrap"><table class="doc-table"><thead><tr>${thead}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function keyTable(head: [string, string], rows: Array<[string, string]>): string {
  const thead = `<th scope="col">${escapeHtml(head[0])}</th><th scope="col">${escapeHtml(head[1])}</th>`;
  const body = rows
    .map(([k, v]) => `<tr><td><code>${escapeHtml(k)}</code></td><td>${inlineCode(v)}</td></tr>`)
    .join('');
  return `<div class="doc-table-wrap"><table class="doc-table"><thead><tr>${thead}</tr></thead><tbody>${body}</tbody></table></div>`;
}

interface Tab { label: string; lang: 'html' | 'css' | 'js'; code: string; playgroundHtml?: boolean }

function codeBlock(tabs: Tab[], id: string, label: string): string {
  const copyI = svgIcon('copy', 'zak-icon', 13);
  const tabButtons = tabs
    .map((tab, i) =>
      `<button class="doc-code__tab${i === 0 ? ' is-active' : ''}" type="button" role="tab" ` +
      `id="${id}-tab-${i}" aria-selected="${i === 0}" aria-controls="${id}-panel-${i}" ` +
      `tabindex="${i === 0 ? 0 : -1}" data-code-tab>${escapeHtml(tab.label)}</button>`)
    .join('');
  const panels = tabs
    .map((tab, i) => {
      const hook = tab.playgroundHtml ? ' data-playground-html' : '';
      return `<div class="doc-code__panel${i === 0 ? ' is-active' : ''}" role="tabpanel" id="${id}-panel-${i}" ` +
        `aria-labelledby="${id}-tab-${i}" data-code-panel tabindex="0">` +
        `<pre><code${hook}>${highlight(tab.code, tab.lang)}</code></pre></div>`;
    })
    .join('');
  return `<div class="doc-code" data-code>` +
    `<div class="doc-code__tabs" role="tablist" aria-label="${escapeHtml(label)}">${tabButtons}` +
    `<button class="doc-code__copy" type="button" data-copy aria-label="Copy code to clipboard">${copyI}<span data-copy-label>Copy</span></button></div>` +
    `${panels}</div>`;
}

/* --------------------------------------------------------------------------
   Interactive playground card.
   -------------------------------------------------------------------------- */
function renderControls(controls: ControlDef[]): string {
  if (controls.length === 0) {
    return `<p class="doc-playground__hint">No adjustable props on this pattern — use the theme toggle above to check the preview in both themes.</p>`;
  }
  return controls.map((c) => {
    const label = escapeHtml(c.label ?? c.name);
    const name = escapeHtml(c.name);
    if (c.type === 'select') {
      const opts = (c.options ?? [])
        .map((o) => `<option value="${escapeHtml(o)}"${o === c.default ? ' selected' : ''}>${escapeHtml(o === '' ? 'default' : o)}</option>`)
        .join('');
      return `<div class="doc-control"><span class="doc-control__label"><span>${label}</span><code>${name}</code></span>` +
        `<select class="zak-select" data-control="${name}" aria-label="${label}">${opts}</select></div>`;
    }
    if (c.type === 'toggle') {
      return `<div class="doc-control"><span class="doc-control__label"><span>${label}</span><code>${name}</code></span>` +
        `<label class="zak-switch"><input type="checkbox" role="switch" data-control="${name}"${c.default === true ? ' checked' : ''}/></label></div>`;
    }
    if (c.type === 'text') {
      return `<div class="doc-control"><span class="doc-control__label"><span>${label}</span><code>${name}</code></span>` +
        `<input class="zak-input" type="text" data-control="${name}" value="${escapeHtml(String(c.default))}"/></div>`;
    }
    if (c.type === 'range') {
      const min = c.min ?? 0;
      const max = c.max ?? 100;
      const value = typeof c.default === 'number' ? c.default : min;
      const pct = Math.round(((value - min) / (max - min || 1)) * 100);
      return `<div class="doc-control"><span class="doc-control__label"><span>${label}</span><output class="doc-control__value" data-control-out="${name}">${escapeHtml(String(c.default))}</output></span>` +
        `<input class="zak-range" type="range" data-control="${name}" min="${min}" max="${max}" step="${c.step ?? 1}" value="${escapeHtml(String(c.default))}" style="--zak-range-fill:${pct}%"/></div>`;
    }
    // color
    return `<div class="doc-control"><span class="doc-control__label"><span>${label}</span><code>${name}</code></span>` +
      `<div class="doc-control__row"><input type="color" data-control="${name}" value="${escapeHtml(String(c.default))}"/>` +
      `<output class="doc-control__value" data-control-out="${name}">${escapeHtml(String(c.default))}</output></div></div>`;
  }).join('');
}

function playgroundCard(demo: DemoDef, slug: string): string {
  const tpl = expandIcons(demo.tpl);
  // Curated codeTpl ships verbatim; only a fallback to `tpl` is compacted.
  const codeTpl = demo.codeTpl ? expandIcons(demo.codeTpl) : compact(expandIcons(demo.tpl));
  const controls = inferControls(tpl, demo.controls);
  const vars = defaultVars(controls);
  const preview = renderTemplate(tpl, vars);
  const code = renderTemplate(codeTpl, vars);
  const configJson = JSON.stringify({ tpl, codeTpl, defaults: vars }).replace(/</g, '\\u003c');

  const sparkI = svgIcon('sparkles', 'zak-icon', 14);
  const sunI = svgIcon('sun', 'zak-icon', 14);
  const resetI = svgIcon('refresh', 'zak-icon', 13);

  const tabs: Tab[] = [];
  const usage = deriveUsage(demo, code);
  if (usage) tabs.push({ label: 'Usage', lang: 'html', code: usage });
  tabs.push({ label: 'HTML', lang: 'html', code, playgroundHtml: true });
  if (demo.css) tabs.push({ label: 'CSS', lang: 'css', code: demo.css });
  if (demo.js) tabs.push({ label: 'JS', lang: 'js', code: demo.js });

  return `<div class="doc-playground" data-playground>` +
    `<script type="application/json" data-playground-config>${configJson}</` + `script>` +
    `<div class="doc-playground__bar"><span class="doc-playground__title">${sparkI} Playground</span>` +
    `<div class="doc-playground__bar-actions">` +
    `<button class="zak-btn zak-btn--ghost zak-btn--sm" type="button" data-playground-theme aria-pressed="false" aria-label="Preview the opposite theme">${sunI} Theme</button>` +
    `<button class="zak-btn zak-btn--ghost zak-btn--sm" type="button" data-playground-reset>${resetI} Reset</button>` +
    `</div></div>` +
    `<div class="doc-playground__grid"><div class="doc-playground__controls">${renderControls(controls)}</div>` +
    `<div class="doc-playground__stage"><div class="demo-root doc-playground__preview-scope" data-playground-preview>${preview}</div></div></div>` +
    codeBlock(tabs, `pg-${slug}`, 'Code examples').replace('class="doc-code"', 'class="doc-code doc-playground__code"') +
    `</div>`;
}

/** Static demo card for components that opt out of the playground. */
function staticCard(demo: DemoDef, slug: string): string {
  const tpl = expandIcons(demo.tpl);
  const vars = defaultVars(inferControls(tpl, demo.controls));
  const preview = renderTemplate(tpl, vars);
  const rawCode = renderTemplate(expandIcons(demo.codeTpl ?? demo.tpl), vars);
  const code = demo.codeTpl ? rawCode : compact(rawCode);
  const stageClass = demo.stage === 'start' ? ' doc-demo__stage--start'
    : demo.stage === 'stretch' ? ' doc-demo__stage--stretch'
    : demo.stage === 'grid' ? ' doc-demo__stage--grid' : '';
  const stageStyle = demo.stage === 'grid' && demo.stageMin ? ` style="--demo-min:${demo.stageMin}px"` : '';
  const tabs: Tab[] = [];
  const usage = deriveUsage(demo, code);
  if (usage) tabs.push({ label: 'Usage', lang: 'html', code: usage });
  tabs.push({ label: 'HTML', lang: 'html', code });
  if (demo.css) tabs.push({ label: 'CSS', lang: 'css', code: demo.css });
  if (demo.js) tabs.push({ label: 'JS', lang: 'js', code: demo.js });
  return `<div class="doc-demo"><div class="doc-demo__stage${stageClass}"${stageStyle}><div class="demo-root">${preview}</div></div>` +
    codeBlock(tabs, `code-${slug}`, 'Code examples') + `</div>`;
}

/** Per-variant example cards — mirrors ExampleBlock.astro from the Astro site. */
function examplesBlock(demo: DemoDef, slug: string): string {
  if (!demo.examples?.length) return '';
  const cards = demo.examples
    .map((ex, i) => {
      const tabs: Tab[] = [{ label: 'HTML', lang: 'html', code: ex.code ?? ex.tpl }];
      if (ex.js) tabs.push({ label: 'JS', lang: 'js', code: ex.js });
      const stageClass = ex.stage === 'stretch' ? ' doc-demo__stage--stretch' : ex.stage === 'center' ? '' : ' doc-demo__stage--start';
      return `<div class="doc-example"><h3 class="doc-example__title">${escapeHtml(ex.title)}</h3>` +
        (ex.desc ? `<p class="doc-example__desc">${inlineCode(ex.desc)}</p>` : '') +
        `<div class="doc-demo doc-demo--example"><div class="doc-demo__stage${stageClass}"><div class="demo-root">${expandIcons(ex.tpl)}</div></div>` +
        codeBlock(tabs, `code-${slug}-example-${i}`, `${ex.title} code`) + `</div></div>`;
    })
    .join('');
  return `<section class="doc-section"><h3 class="doc-section__title">Examples</h3>` +
    `<p class="doc-section__lead">One variant per card — the markup in each code tab is exactly what renders above it.</p>${cards}</section>`;
}

/* ---------------------------------------------------------------------------
   One component section (Overview / Demo / Examples / Usage / Props / A11y).
   --------------------------------------------------------------------------- */
function componentSection(cat: Category, comp: ComponentEntry): string {
  const demo = demos[comp.slug];
  if (!demo) return '';
  const id = compId(cat.slug, comp.slug);
  const headerDesc = demo.desc ?? comp.desc;
  const demoLead = demo.desc
    ? comp.desc
    : 'Live preview rendered from the exact markup shown in the code tabs — every prop is demonstrated with copy-ready HTML.';
  const card = demo.playground === true ? playgroundCard(demo, comp.slug) : staticCard(demo, comp.slug);
  const props = demo.props ?? fallbackProps(cat.slug);
  const fb = fallbackA11y(cat.slug);
  const tokens = tokenRows(demo, CATEGORY_TOKENS[cat.slug] ?? '');
  const tokenRowsMapped: PropRow[] = tokens.map((t) => {
    const m = tokenMeta.get(t);
    return [t, m?.light ?? '—', m?.dark ?? '—', m?.role ?? 'Referenced by this category’s styles'];
  });
  const notes = (demo.notes ?? [])
    .map((n) => `<div class="doc-callout">${svgIcon('info', 'zak-icon', 15)}<span>${inlineCode(n)}</span></div>`)
    .join('');
  const badge = comp.badge ? `<span class="zak-badge ${badgeClass[comp.badge]}">${badgeLabel[comp.badge]}</span>` : '';

  return `<section class="doc-component" id="${id}" data-docs-spy>` +
    `<header class="doc-header">` +
      `<div class="doc-header__meta">` +
        `<a class="zak-badge zak-badge--primary" href="#${catId(cat.slug)}">${svgIcon(cat.icon, 'zak-icon', 13)} ${escapeHtml(cat.name)}</a>` +
        `<span class="zak-badge ${statusClass[comp.status]}">${statusLabel[comp.status]}</span>${badge}` +
        `<span class="zak-badge zak-badge--info">v${comp.since}</span>` +
      `</div>` +
      `<h2 class="doc-header__title doc-header__title--h2">${escapeHtml(comp.name)}</h2>` +
      `<p class="doc-header__desc">${escapeHtml(headerDesc)}</p>` +
    `</header>` +
    `<section class="doc-section"><h3 class="doc-section__title">Demo</h3><p class="doc-section__lead">${escapeHtml(demoLead)}</p>${card}</section>` +
    examplesBlock(demo, comp.slug) +
    (notes ? `<section class="doc-section"><h3 class="doc-section__title">Usage</h3>${notes}</section>` : '') +
    `<section class="doc-section"><h3 class="doc-section__title">Props API</h3>${propTable(props)}` +
      (demo.showTokens && tokenRowsMapped.length
        ? `<h4 class="doc-section__subtitle">Design tokens</h4><p class="doc-p">The tokens this pattern consumes most, resolved for both themes.</p>${propTable(tokenRowsMapped, ['Token', 'Light', 'Dark', 'Role'])}`
        : '') +
    `</section>` +
    `<section class="doc-section"><h3 class="doc-section__title">Accessibility</h3>` +
      `<h4 class="doc-section__subtitle">Keyboard interactions</h4>${keyTable(['Keys', 'Interaction'], fb.keys ?? demo.a11y?.keys ?? [])}` +
      `<h4 class="doc-section__subtitle">ARIA &amp; semantics</h4>${keyTable(['Attribute', 'Purpose'], demo.a11y?.aria ?? fb.aria ?? [])}` +
    `</section>` +
  `</section>`;
}

function categorySection(cat: Category): string {
  return `<section class="doc-category" id="${catId(cat.slug)}" data-docs-spy>` +
    `<div class="doc-category__head">` +
      `<span class="doc-category__icon">${svgIcon(cat.icon, 'zak-icon', 22)}</span>` +
      `<div><h2 class="doc-category__title">${escapeHtml(cat.name)}</h2>` +
      `<p class="doc-category__blurb">${escapeHtml(cat.blurb)}</p>` +
      `<span class="zak-badge zak-badge--info">${cat.components.length} components</span></div>` +
    `</div>` +
    cat.components.map((comp) => componentSection(cat, comp)).join('') +
  `</section>`;
}

/* --------------------------------------------------------------------------
   Get Started guide sections (dual distribution + theming documentation).
   -------------------------------------------------------------------------- */
const GUIDE_INTRO = `<section class="doc-component" id="${guideId('introduction')}" data-docs-spy>` +
  `<header class="doc-header"><div class="doc-header__meta">` +
  `<span class="zak-badge zak-badge--primary">${svgIcon('rocket', 'zak-icon', 13)} ${guideCategory.name}</span>` +
  `<span class="zak-badge">Zero dependencies</span></div>` +
  `<h2 class="doc-header__title doc-header__title--h2">Introduction</h2>` +
  `<p class="doc-header__desc">ZAKUIKit is an enterprise design system written in pure CSS and vanilla ES6 modules — ${totalComponentCount} components across ${catalog.length} categories, native light/dark theming, and a single stylesheet + script that drop into any page.</p></header>` +
  `<section class="doc-section"><h3 class="doc-section__title">Architecture</h3>` +
  `<p class="doc-p">Everything lives in a cascade layer order — <code>@layer zak.tokens, zak.base, zak.components</code> — so your own unlayered CSS always wins without <code>!important</code>. Colour, spacing, radius and elevation come from the token layer, which re-maps for <code>[data-theme="dark"]</code>, so every component inherits the active theme automatically.</p>` +
  `<div class="doc-callout">${svgIcon('info', 'zak-icon', 15)}<span>There is no runtime framework, no hydration and no build requirement on the consuming side — this entire documentation page is one static HTML file driven by \`zak.js\`.</span></div>` +
  `</section></section>`;

const GUIDE_INSTALL = `<section class="doc-component" id="${guideId('installation')}" data-docs-spy>` +
  `<header class="doc-header"><div class="doc-header__meta">` +
  `<span class="zak-badge zak-badge--info">jsDelivr</span><span class="zak-badge zak-badge--info">npm</span></div>` +
  `<h2 class="doc-header__title doc-header__title--h2">Installation</h2>` +
  `<p class="doc-header__desc">One build feeds every channel — drop-in CDN tags, two local files, or modular npm imports. All consume the same \`zak.css\` + \`zak.js\`.</p></header>` +
  `<section class="doc-section"><h3 class="doc-section__title">Option 1 — CDN <span class="zak-badge zak-badge--success">Recommended</span></h3>` +
  `<p class="doc-p">Two tags plus the inline theme boot in <code>&lt;head&gt;</code> — jsDelivr serves the package straight to the browser:</p>` +
  codeBlock([{ label: 'CDN', lang: 'html', code: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/zakuikit@latest/dist/zak.min.css">\n<script src="https://cdn.jsdelivr.net/npm/zakuikit@latest/dist/zak.min.js" defer><\/script>` }], 'gs-cdn', 'jsDelivr CDN') +
  `<div class="doc-callout">${svgIcon('info', 'zak-icon', 15)}<span>Production pages should pin a version (<code>zakuikit@2.2.0</code>) and add an <code>integrity</code> hash. Always keep the inline theme-boot script in <code>&lt;head&gt;</code> so the first paint is flash-free.</span></div>` +
  `</section>` +
  `<section class="doc-section"><h3 class="doc-section__title">Option 2 — Local files</h3>` +
  `<p class="doc-p">Copy <code>zak.css</code> and <code>zak.js</code> from <code>package/dist/</code> beside your assets and serve them from your origin — no CDN, no build step:</p>` +
  codeBlock([{ label: 'HTML', lang: 'html', code: `<link rel="stylesheet" href="/assets/zak.css">\n<script src="/assets/zak.js" defer><\/script>` }], 'gs-local', 'Local files') +
  `</section>` +
  `<section class="doc-section"><h3 class="doc-section__title">Option 3 — npm</h3>` +
  `<p class="doc-p">Run <code>npm install zakuikit</code>, then import the stylesheet and the named controller exports:</p>` +
  codeBlock([{ label: 'ES module', lang: 'js', code: `// Terminal\nnpm install zakuikit\n\n// Entry file — styles first, then behaviour.\nimport 'zakuikit/css';\n\n// Or take the named controller exports:\nimport { ZakModal, ZakTabs, toast } from 'zakuikit';\ntoast('Saved', 'success', { desc: '3 records updated.' });` }], 'gs-npm', 'npm install') +
  `</section></section>`;

const GUIDE_THEME = `<section class="doc-component" id="${guideId('theming')}" data-docs-spy>` +
  `<header class="doc-header"><div class="doc-header__meta"><span class="zak-badge zak-badge--primary">${svgIcon('sun', 'zak-icon', 13)} Theming</span></div>` +
  `<h2 class="doc-header__title doc-header__title--h2">Theming</h2>` +
  `<p class="doc-header__desc">Light and dark are driven by CSS custom properties behind <code>[data-theme]</code>, with a zero-FOUC inline boot.</p></header>` +
  `<section class="doc-section"><h3 class="doc-section__title">Theme boot</h3>` +
  `<p class="doc-p">Drop this in <code>&lt;head&gt;</code> — it reads <code>localStorage</code>, falls back to the system <code>prefers-color-scheme</code>, and sets <code>data-theme</code> before the first paint:</p>` +
  codeBlock([{ label: 'HTML', lang: 'html', code: `<script>\n(function () {\n  var t = localStorage.getItem('zak-theme');\n  if (t !== 'light' && t !== 'dark')\n    t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';\n  document.documentElement.setAttribute('data-theme', t);\n})();\n<\/script>\n\n<!-- The toggle just flips the attribute; zak.js persists it. -->\n<button data-theme-toggle aria-pressed="false" aria-label="Toggle theme">Light / Dark</button>` }], 'gs-theme', 'Theme boot') +
  `</section></section>`;

const guideSections = GUIDE_INTRO + GUIDE_INSTALL + GUIDE_THEME;

/* --------------------------------------------------------------------------
   Utilities section — the one-shot `zak-*` helper class reference (mirrors the
   standalone /utilities/ page of the Astro site).
   -------------------------------------------------------------------------- */
const UTIL_ROWS = {
  sizes: typeScale.slice().reverse().map((t) => [t.token.replace('--zak-', 'zak-'), `${t.size} · weight ${t.weight}`] as [string, string]),
  display: [
    ['zak-hidden', 'display:none at every size.'],
    ['zak-visually-hidden', 'Invisible on screen, kept in the accessibility tree.'],
    ['zak-hidden-up-sm…2xl', 'Hidden from the breakpoint upward (min-width).'],
    ['zak-hidden-down-sm…2xl', 'Hidden below the breakpoint (max-width).'],
  ] as Array<[string, string]>,
  shadows: shadowScale.map((s) => [s.token.replace('--zak-shadow-', 'zak-shadow-'), s.usage] as [string, string]),
  radius: radiusScale.map((r) => [r.token.replace('--zak-radius-', 'zak-rounded-'), r.pixels] as [string, string]),
};

function utilitiesSection(): string {
  const sizeDemo = typeScale
    .slice()
    .reverse()
    .map((t) => `<p class="${t.token.replace('--zak-', 'zak-')}">The quick brown fox — ${t.sample.toLowerCase()}</p>`)
    .join('');
  const displayDemo = `<div class="zak-flex zak-flex--wrap zak-gap-2">` +
    `<span class="zak-badge zak-badge--danger zak-hidden-up-md">Hidden ≥ md (768px)</span>` +
    `<span class="zak-badge zak-badge--success zak-hidden-down-md">Only ≥ md (768px)</span>` +
    `<span class="zak-badge zak-badge--info zak-hidden-up-lg">Hidden ≥ lg (1024px)</span>` +
    `<span class="zak-badge">Always visible</span></div>`;
  const shadowDemo = shadowScale
    .map((s) => `<div class="zak-bg-surface zak-rounded-lg zak-shadow-${s.token.replace('--zak-shadow-', '')}" style="padding:var(--zak-space-5)">zak-shadow-${s.token.replace('--zak-shadow-', '')}</div>`)
    .join('');
  return `<section class="doc-component" id="utilities" data-docs-spy>` +
    `<header class="doc-header"><div class="doc-header__meta"><span class="zak-badge zak-badge--primary">${svgIcon('zap', 'zak-icon', 13)} Utilities</span></div>` +
    `<h2 class="doc-header__title doc-header__title--h2">Utilities</h2>` +
    `<p class="doc-header__desc">One-shot helper classes built on the same tokens as every component — text, display, flex, gap, borders, radius, shadows, spacing and width.</p></header>` +
    `<section class="doc-section"><h3 class="doc-section__title">Text</h3>` +
    `<p class="doc-section__lead">Every scale step is a utility: zak-text-2xs · xs · sm · md · lg · xl · 2xl · 3xl · 4xl · 5xl, plus fluid zak-fluid-* sizes built on clamp().</p>` +
    `<div class="doc-demo"><div class="doc-demo__stage doc-demo__stage--stretch"><div class="demo-root"><div class="zak-stack zak-stack--xs">${sizeDemo}<p class="zak-fluid-xl">Fluid text — scales between breakpoints.</p></div></div>` +
    codeBlock([{ label: 'HTML', lang: 'html', code: `<p class="zak-text-sm">Small copy</p>\n<p class="zak-text-2xl">Card heading</p>\n<p class="zak-fluid-xl">Fluid heading</p>\n<p class="zak-weight-semibold zak-text-center zak-truncate">Styled text</p>` }], 'zak-text', 'Text utilities') + `</div>` +
    keyTable(['Utility', 'Resolves to'], UTIL_ROWS.sizes) + `</section>` +
    `<section class="doc-section"><h3 class="doc-section__title">Display &amp; Visibility</h3>` +
    `<p class="doc-section__lead">Breakpoints: sm 480 · md 768 · lg 1024 · xl 1280 · 2xl 1536. Resize the window to watch the chips swap.</p>` +
    `<div class="doc-demo"><div class="doc-demo__stage doc-demo__stage--stretch"><div class="demo-root">${displayDemo}</div>` +
    codeBlock([{ label: 'HTML', lang: 'html', code: `<span class="zak-hidden-up-md">Hidden on tablets and up</span>\n<span class="zak-hidden-down-md">Visible only from md up</span>\n<span class="zak-visually-hidden">Screen-reader only</span>` }], 'zak-display', 'Display utilities') + `</div>` +
    keyTable(['Utility', 'Behavior'], UTIL_ROWS.display) + `</section>` +
    `<section class="doc-section"><h3 class="doc-section__title">Shadows, Radius &amp; Surfaces</h3>` +
    `<p class="doc-section__lead">zak-shadow-sm … zak-shadow-xxl, zak-rounded-sm … zak-rounded-full, zak-border, zak-bg-surface / sunken / elevated / primary-subtle.</p>` +
    `<div class="doc-demo"><div class="doc-demo__stage doc-demo__stage--stretch"><div class="demo-root"><div class="zak-flex zak-flex--wrap zak-gap-4">${shadowDemo}</div></div>` +
    codeBlock([{ label: 'HTML', lang: 'html', code: `<div class="zak-shadow-xl zak-rounded-lg zak-bg-surface">Floating panel</div>\n<div class="zak-border-strong zak-rounded-md">Outlined chip</div>` }], 'zak-elevation', 'Elevation utilities') + `</div>` +
    keyTable(['Utility', 'Usage'], UTIL_ROWS.shadows) + keyTable(['Utility', 'Radius'], UTIL_ROWS.radius) + `</section>` +
    `<section class="doc-section"><h3 class="doc-section__title">Flex, Gap &amp; Width</h3>` +
    `<p class="doc-section__lead">zak-items-*, zak-justify-*, zak-gap-0…8, zak-w-full, zak-max-w-sm…xl, zak-mx-auto — the glue for one-off rows and clusters.</p>` +
    codeBlock([{ label: 'HTML', lang: 'html', code: `<div class="zak-flex zak-items-center zak-justify-between zak-gap-2">…</div>\n<div class="zak-mx-auto zak-max-w-lg">Constrained block</div>` }], 'zak-flex', 'Layout utilities') + `</section>` +
  `</section>`;
}

/* --------------------------------------------------------------------------
   Landing (reference-idiomatic): stats, 3-step setup, gallery cards,
   semantic colors, template cards. Follows zaknextjs.vercel.app layout.
   -------------------------------------------------------------------------- */
interface TemplateCard { name: string; desc: string; icon: string; target: string }
const TEMPLATES: TemplateCard[] = [
  { name: 'Dashboard', desc: 'KPI cards, charts, tables and activity feeds.', icon: 'bar-chart', target: catId('data-visualization') },
  { name: 'Analytics', desc: 'Traffic, funnel and performance panels.', icon: 'line-chart', target: catId('data-visualization') },
  { name: 'CRM', desc: 'Pipeline, deals, contacts and tasks.', icon: 'users', target: catId('tables') },
  { name: 'AI Chat', desc: 'Streaming chat, citations and tool calls.', icon: 'sparkles', target: catId('ai') },
  { name: 'Settings', desc: 'Profile, team, billing and security forms.', icon: 'settings', target: catId('forms') },
  { name: 'Authentication', desc: 'Login, register, OTP and 2FA flows.', icon: 'lock', target: catId('forms') },
];

function landing(): string {
  const galleryCards = catalog.map((cat) =>
    `<a class="cat-card cat-card--gallery" href="#${catId(cat.slug)}">` +
    `<span class="cat-card__icon">${svgIcon(cat.icon, 'zak-icon', 22)}</span>` +
    `<span class="cat-card__name">${escapeHtml(cat.name)}</span>` +
    `<span class="cat-card__desc">${escapeHtml(cat.blurb)}</span>` +
    `<span class="cat-card__meta"><span class="zak-badge zak-badge--info">${cat.components.length} components</span><span>Browse →</span></span>` +
    `</a>`,
  ).join('');
  const templateCards = TEMPLATES.map((t) =>
    `<a class="cat-card cat-card--gallery" href="#${t.target}">` +
    `<span class="cat-card__icon">${svgIcon(t.icon, 'zak-icon', 22)}</span>` +
    `<span class="cat-card__name">${escapeHtml(t.name)}</span>` +
    `<span class="cat-card__desc">${escapeHtml(t.desc)}</span>` +
    `<span class="cat-card__meta"><span>Open gallery →</span></span>` +
    `</a>`,
  ).join('');
  const tones = ['primary', 'accent', 'success', 'warning', 'danger', 'info']
    .map((t) => `<div class="color-chip" data-tone="${t}"><span class="color-chip__swatch"></span><strong>${t[0].toUpperCase() + t.slice(1)}</strong><code>--zak-${t === 'accent' ? 'secondary' : t}</code></div>`)
    .join('');

  return `<section class="doc-hero">
  <div class="doc-hero__stats">
    <div class="doc-hero__stat"><strong>${catalog.length}</strong><span>component galleries</span></div>
    <div class="doc-hero__stat"><strong>${totalComponentCount}+</strong><span>components &amp; variants</span></div>
    <div class="doc-hero__stat"><strong>2</strong><span>themes · light &amp; dark</span></div>
    <div class="doc-hero__stat"><strong>AA</strong><span>WCAG 2.1 contrast</span></div>
    <div class="doc-hero__stat"><strong>0</strong><span>third-party dependencies</span></div>
  </div>
  <h1 class="doc-hero__title">A production-ready UI kit.<br/><em>Pure CSS + vanilla JS.</em></h1>
  <p class="doc-hero__desc">Every component is hand-crafted on the ZAK design tokens — light and dark themes, WCAG-AA contrast, five sizes and enterprise-ready states. Browse the galleries, preview every prop and copy the markup.</p>
  <div class="doc-hero__cta">
    <a class="zak-btn zak-btn--filled" href="#galleries">Explore components</a>
    <a class="zak-btn zak-btn--outlined" href="#${guideId('installation')}">Install with npm</a>
  </div>
</section>

<section class="doc-block" id="setup">
  <h2 class="doc-block__title">Basic setup</h2>
  <p class="doc-block__lead">Three steps to start building with ZAK — components ship as pure CSS hooks with an optional vanilla-JS runtime. No Tailwind, no framework, no global reset.</p>
  <ol class="setup-steps">
    <li><span class="setup-steps__n">1</span><div><strong>Install the package</strong><code>npm install zakuikit</code></div></li>
    <li><span class="setup-steps__n">2</span><div><strong>Import the stylesheet</strong><code>import 'zakuikit/css';</code></div></li>
    <li><span class="setup-steps__n">3</span><div><strong>Use a component</strong><code>&lt;button class="zak-btn zak-btn--filled"&gt;Save&lt;/button&gt;</code></div></li>
  </ol>
  <div class="doc-callout">${svgIcon('info', 'zak-icon', 15)}<span>Prefer a CDN? Two tags from jsDelivr work identically — see the <a href="#${guideId('installation')}">Installation guide</a>.</span></div>
</section>

<section class="doc-block" id="galleries">
  <h2 class="doc-block__title">Component galleries</h2>
  <p class="doc-block__lead">Every category ships with documentation, concise component-based snippets and a live showcase.</p>
  <div class="cat-grid cat-grid--gallery">${galleryCards}</div>
</section>

<section class="doc-block" id="colors">
  <h2 class="doc-block__title">Semantic colors</h2>
  <p class="doc-block__lead">The entire scale is driven by design tokens and adapts to both themes.</p>
  <div class="color-strip">${tones}</div>
</section>

<section class="doc-block" id="templates">
  <h2 class="doc-block__title">Templates</h2>
  <p class="doc-block__lead">Full-page patterns composed from the same components. Open a gallery to play with each piece.</p>
  <div class="cat-grid cat-grid--gallery">${templateCards}</div>
</section>`;
}

/* --------------------------------------------------------------------------
   Shell: header, sidebar, search dialog, footer.
   -------------------------------------------------------------------------- */
const LOGO_SVG =
  `<svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true"><defs>` +
  `<linearGradient id="zak-logo-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">` +
  `<stop offset="0" stop-color="#4f46e5"></stop><stop offset="0.55" stop-color="#6366f1"></stop>` +
  `<stop offset="1" stop-color="#06b6d4"></stop></linearGradient></defs>` +
  `<rect width="32" height="32" rx="9" fill="url(#zak-logo-grad)"></rect>` +
  `<path d="M10.5 10.5H21.5L10.5 21.5H21.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

function header(): string {
  return `<header class="docs-header">` +
    `<button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm docs-header__menu-btn" type="button" data-docs-menu aria-label="Open navigation" aria-expanded="false">${svgIcon('menu', 'zak-icon', 18)}</button>` +
    `<a class="docs-header__brand" href="#top"><span class="docs-header__logo">${LOGO_SVG}</span> ZAKUIKit <small>ENTERPRISE</small></a>` +
    `<button class="docs-header__search" type="button" data-docs-search-open aria-label="Search components">${svgIcon('search', 'zak-icon', 15)}<span>Search components…</span><kbd class="zak-kbd">Ctrl</kbd><kbd class="zak-kbd">K</kbd></button>` +
    `<div class="docs-header__actions"><span class="zak-badge zak-badge--primary">v2.2</span>` +
    `<a class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" href="https://github.com/zakui/zakuikit" target="_blank" rel="noopener" aria-label="GitHub repository">${svgIcon('github', 'zak-icon', 16)}</a>` +
    `<button class="docs-theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="Toggle theme">${svgIcon('sun', 'zak-icon icon-sun', 16)}${svgIcon('moon', 'zak-icon icon-moon', 16)}</button>` +
    `</div></header>`;
}

function sidebar(): string {
  const guideLinks = guidePages
    .map((p) => `<a class="sbx-link" href="#${guideId(p.slug)}" data-toc-link="${guideId(p.slug)}" data-search="${escapeHtml(`${p.name} ${p.keywords}`.toLowerCase())}"><span>${escapeHtml(p.name)}</span></a>`)
    .join('');
  const sections = catalog
    .map((cat) => {
      const links = cat.components
        .map((comp) => {
          const badge = comp.badge ? `<span class="zak-badge ${badgeClass[comp.badge]}">${badgeLabel[comp.badge]}</span>` : '';
          return `<a class="sbx-link" href="#${compId(cat.slug, comp.slug)}" data-toc-link="${compId(cat.slug, comp.slug)}" data-search="${escapeHtml(`${comp.name} ${comp.keywords}`.toLowerCase())}"><span>${escapeHtml(comp.name)}</span>${badge}</a>`;
        })
        .join('');
      return `<div class="sbx-section" data-docs-section="${cat.slug}">` +
        `<button class="sbx-toggle" type="button" data-docs-section-toggle aria-expanded="true">${svgIcon(cat.icon, 'zak-icon', 15)} ${escapeHtml(cat.name)} <span class="sbx-count">${cat.components.length}</span>${svgIcon('chevron-down', 'zak-icon sbx-caret', 14)}</button>` +
        `<div class="sbx-links">${links}</div></div>`;
    })
    .join('');

  return `<aside class="docs-sidebar" data-docs-sidebar aria-label="Documentation navigation">` +
    `<div class="docs-nav-search"><input class="sbx-filter" type="search" placeholder="Filter ${catalog.length} categories…" aria-label="Filter components" data-docs-filter autocomplete="off"/></div>` +
    `<nav aria-label="Documentation">` +
      `<div class="sbx-section" data-docs-section="${guideCategory.slug}">` +
      `<button class="sbx-toggle" type="button" data-docs-section-toggle aria-expanded="true">${svgIcon(guideCategory.icon, 'zak-icon', 15)} ${escapeHtml(guideCategory.name)} <span class="sbx-count">${guidePages.length}</span>${svgIcon('chevron-down', 'zak-icon sbx-caret', 14)}</button>` +
      `<div class="sbx-links">${guideLinks}</div></div>` +
      sections +
      `<p class="sbx-empty zak-hidden" data-docs-empty>No components match your filter.</p>` +
    `</nav></aside>`;
}

function searchDialog(): string {
  const index = [
    ...guidePages.map((p) => ({ n: p.name, s: p.slug, c: guideCategory.slug, cn: guideCategory.name, d: p.desc, k: p.keywords, u: `#${guideId(p.slug)}` })),
    ...allComponents.map((e) => ({ n: e.name, s: e.slug, c: e.category, cn: e.categoryName, d: e.desc, k: e.keywords, u: `#${compId(e.category, e.slug)}` })),
  ];
  const indexJson = JSON.stringify(index).replace(/</g, '\\u003c');
  return `<dialog class="docs-search-dialog" data-docs-search aria-label="Search components">` +
    `<div class="docs-search__input-row">${svgIcon('search', 'zak-icon', 17)}` +
    `<input class="docs-search__input" type="text" placeholder="Search components, tokens, guides…" aria-label="Search" aria-controls="docs-search-results" autocomplete="off" spellcheck="false" data-docs-search-input/>` +
    `<kbd class="zak-kbd">Esc</kbd></div>` +
    `<div class="docs-search__results" id="docs-search-results" data-docs-search-results></div>` +
    `<div class="docs-search__foot"><span><kbd class="zak-kbd">↑</kbd> <kbd class="zak-kbd">↓</kbd> navigate</span><span><kbd class="zak-kbd">↵</kbd> open</span><span><kbd class="zak-kbd">Esc</kbd> close</span><span style="margin-inline-start:auto">${index.length} pages indexed</span></div>` +
    `<script type="application/json" data-docs-search-index>${indexJson}</` + `script></dialog>`;
}

function footer(): string {
  return `<footer class="docs-footer"><span>© 2026 ZAKUIKit · pure CSS + native ES modules · zero third-party dependencies</span>` +
    `<span class="docs-footer__spacer"></span><a href="#${catId('layout')}">Components</a><a href="#${catId('utilities')}">Design tokens</a>` +
    `<a href="https://github.com/zakui/zakuikit" target="_blank" rel="noopener">GitHub</a></footer>`;
}

/* --------------------------------------------------------------------------
   Assemble the document.
   -------------------------------------------------------------------------- */
const THEME_BOOT = `(function(){try{var s=localStorage.getItem('zak-theme');if(s!=='light'&&s!=='dark'){s=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',s);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

/**
 * Docs-only styles inlined into index.html. The build script writes the
 * current docs.css plus the standalone layout shim to a temp manifest; when
 * gen-site runs standalone (without the manifest) we read docs.css from src.
 */
function docsStyle(): string {
  try {
    const raw = readFileSync(join(root, 'scripts', '.docs-css.json'), 'utf8');
    const { docs, shim } = JSON.parse(raw) as { docs: string; shim: string };
    return `${docs}\n${shim}`.replace(/<\/style>/gi, '<\\/style>');
  } catch {
    try {
      return readFileSync(join(root, 'src', 'styles', 'docs.css'), 'utf8').replace(/<\/style>/gi, '<\\/style>');
    } catch {
      return '';
    }
  }
}

function document_(): string {
  const body = catalog.map((cat) => categorySection(cat)).join('');
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ZAKUIKit — Enterprise Design System</title>
    <meta name="description" content="ZAKUIKit — a pure CSS + vanilla JS design system: ${totalComponentCount} components across ${catalog.length} categories, native light/dark theming, each documented with a live preview and copy-ready code." />
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" content="#f6f7fb" data-theme-color />
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='9' fill='%234f46e5'/%3E%3Cpath d='M10.5 10.5H21.5L10.5 21.5H21.5' stroke='white' stroke-width='2.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E" />
    <link rel="stylesheet" href="./zak.css" />
    <style data-docs-css>${docsStyle()}</style>
    <script>${THEME_BOOT}</script>
  </head>
  <body id="top">
    <a class="skip-link" href="#main">Skip to content</a>
    ${header()}
    <div class="docs-scrim" data-docs-scrim></div>
    <div class="docs-shell">
      ${sidebar()}
      <main class="docs-main" id="main">
        <div class="docs-content">
          ${landing()}
          ${guideSections}
          ${body}
        </div>
      </main>
    </div>
    ${footer()}
    ${searchDialog()}
    <script src="./zak-docs.js" defer></\script>
  </body>
</html>
`;
}

/* --------------------------------------------------------------------------
   Entry.
   -------------------------------------------------------------------------- */
export async function generate(): Promise<void> {
  await writeFile(join(root, 'index.html'), document_(), 'utf8');
  const sectionCount = catalog.reduce((n, c) => n + c.components.length, 0);
  console.log(`index.html — ${catalog.length} categories, ${sectionCount} component sections + ${guidePages.length - 2} guides`);
}

// Allow running directly under Node (via the esbuild bundle).
await generate();
