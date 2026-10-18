/**
 * Demos — Foundations (colors, type, icons, space, borders, shadows, responsive).
 *
 * Every demo renders as a static preview card (`playground` defaults to the
 * preview + code card) and ships a curated `codeTpl` that demonstrates each
 * entry in its props API.
 */
import { defineDemo, type DemoDef } from './types';
import { paletteScales, semanticTokens, spacingScale, radiusScale, shadowScale, typeScale, breakpoints } from '../data/tokens';
import { iconPaths, svgIcon } from '../data/icons';

/* --- Colors ------------------------------------------------------------------ */
const paletteMarkup = paletteScales
  .map(
    (scale) => `<div class="zak-stack zak-stack--sm" style="width:100%">
    <strong style="font-size: var(--zak-text-sm)">${scale.name}</strong>
    <div class="doc-swatches">
      ${scale.shades
        .map(
          (shade) => `<div class="doc-swatch"><div class="doc-swatch__chip" style="background:${shade.value}"></div>
        <div class="doc-swatch__meta"><span class="doc-swatch__name">${shade.shade}</span><span class="doc-swatch__val">${shade.value}</span></div></div>`,
        )
        .join('\n      ')}
    </div>
  </div>`,
  )
  .join('\n  ');

const semanticMarkup = `<div class="doc-table-wrap" style="width:100%"><table class="doc-table">
  <thead><tr><th>Token</th><th>Light</th><th>Dark</th><th>Usage</th></tr></thead>
  <tbody>${semanticTokens
    .map(
      (token) => `<tr><td><code>${token.token}</code></td><td><span style="display:inline-flex;gap:.4rem;align-items:center"><i style="width:.8rem;height:.8rem;border-radius:3px;border:1px solid var(--zak-border-subtle);background:${token.light}"></i><span class="col-default">${token.light}</span></span></td><td><span style="display:inline-flex;gap:.4rem;align-items:center"><i style="width:.8rem;height:.8rem;border-radius:3px;border:1px solid var(--zak-border-subtle);background:${token.dark}"></i><span class="col-default">${token.dark}</span></span></td><td>${token.usage}</td></tr>`,
    )
    .join('')}</tbody></table></div>`;

/* --- Typography ----------------------------------------------------------------- */
const typeMarkup = typeScale
  .map(
    (row) => `<div class="doc-type-row">
    <span class="doc-type-sample" style="font-size:${row.size.split(' ')[0]}; font-weight:${row.weight}; line-height:1.1">${row.sample}</span>
    <small><code style="background:none;border:0;padding:0">${row.token}</code><br/>${row.size} · ${row.weight}</small>
  </div>`,
  )
  .join('\n  ');

/* --- Icons ------------------------------------------------------------------------ */
const iconMarkup = `<div class="doc-icons">${Object.keys(iconPaths)
  .map((name) => `<div class="doc-icon-cell">${svgIcon(name, 'zak-icon', 22)}<span>${name}</span></div>`)
  .join('')}</div>`;

/* --- Spacing ------------------------------------------------------------------------ */
const spacingMarkup = spacingScale
  .map(
    (row) => `<div class="doc-space-row"><code>${row.token}</code><div class="doc-space-bar" style="width:var(--${row.token.slice(2)})"></div><span>${row.value} · ${row.pixels}</span></div>`,
  )
  .join('\n  ');

/* --- Borders ------------------------------------------------------------------------ */
const radiusMarkup = radiusScale
  .map(
    (row) => `<div class="doc-radius-cell"><div class="doc-radius-box" style="border-radius:var(--${row.token.slice(2)})"></div><span>${row.token}<br/>${row.pixels}</span></div>`,
  )
  .join('\n    ');

/* --- Shadows ------------------------------------------------------------------------- */
const shadowMarkup = shadowScale
  .map(
    (row) => `<div class="doc-shadow-cell"><div class="doc-shadow-box" style="box-shadow:var(${row.token})">Aa</div><span>${row.token}</span></div>`,
  )
  .join('\n    ');

/* --- Responsive ------------------------------------------------------------------------ */
const breakpointTable = `<div class="doc-table-wrap" style="width:100%"><table class="doc-table">
  <thead><tr><th>Token</th><th>Min width</th><th>Typical usage</th></tr></thead>
  <tbody>${breakpoints.map((bp) => `<tr><td><code>${bp.token}</code></td><td class="col-default">${bp.value}</td><td>${bp.usage}</td></tr>`).join('')}</tbody>
</table></div>`;

const responsiveDemo = `<div class="zak-stack zak-stack--md" style="width:100%">
  ${breakpointTable}
  <div class="zak-lgrid" style="--zak-lgrid-min: 160px; width:100%">
    <div class="zak-box zak-box--muted">Track 1</div>
    <div class="zak-box zak-box--muted">Track 2</div>
    <div class="zak-box zak-box--muted">Track 3</div>
    <div class="zak-box zak-box--muted">Track 4</div>
  </div>
  <div class="zak-cq-zone" style="width:100%">
    <div class="zak-cq-card">
      <div class="zak-img-ph" style="aspect-ratio:1;border-radius:var(--zak-radius-md)"></div>
      <div>
        <strong>Container queries</strong>
        <p class="zak-muted" style="font-size: var(--zak-text-sm)">This card switches from stacked to horizontal layout once its <em>container</em> — not the viewport — passes 480px. Resize the window to feel it.</p>
      </div>
    </div>
  </div>
</div>`;

export const foundationsDemos: Record<string, DemoDef> = {
  colors: defineDemo({
    showTokens: true,
    desc: 'Two layers of color: raw palettes for authoring and semantic tokens that resolve per theme. Components must only consume semantic tokens so light/dark parity is automatic.',
    tpl: `${paletteMarkup}\n  ${semanticMarkup}`,
    codeTpl: `<!-- Surface token — resolves per theme -->
<div class="zak-box" style="background: var(--zak-bg-surface)">Card surface</div>

<!-- Primary text token — AA contrast on surfaces -->
<p style="color: var(--zak-text-primary)">Body copy</p>

<!-- Hairline border token -->
<div class="zak-box" style="border: 1px solid var(--zak-border-color)">Bordered</div>

<!-- Scope any subtree to a theme -->
<section data-theme="dark">…</section>`,
    css: `:root,
[data-theme="light"] {
  --zak-bg-surface: #ffffff;
  --zak-text-primary: #0f172a;
}
[data-theme="dark"] {
  --zak-bg-surface: #101827;
  --zak-text-primary: #f1f5fb;
}`,
    props: [
      ['--zak-bg-surface', 'token', '#ffffff', 'Page and card surfaces; flips per theme.'],
      ['--zak-text-primary', 'token', '#0f172a', 'Default body text; AA contrast on surfaces.'],
      ['--zak-border-color', 'token', '—', 'Resting hairlines for containers and dividers.'],
      ['data-theme', '"light" | "dark"', 'inherited', 'Forces a theme scope for the subtree.'],
    ],
    stage: 'stretch',
    playground: false,
    notes: [
      'Contrast: primary text pairs are tuned to pass WCAG AA (4.5:1) in both themes.',
      'Status colors ship as triples — `--zak-{tone}`, `--zak-{tone}-text`, `--zak-{tone}-subtle` — for accent, text and surface use.',
      'Chart colors `--zak-chart-1…7` are theme-aware and ordered for maximum adjacent contrast.',
    ],
  }),
  typography: defineDemo({
    showTokens: true,
    desc: 'A tight type scale built for dense enterprise interfaces. Tokens are named by role step, not pixel size, so the scale can retune without breaking layouts.',
    tpl: typeMarkup,
    codeTpl: `<!-- UI body size -->
<p style="font-size: var(--zak-text-md)">Default interface copy.</p>

<!-- Lead paragraph -->
<p style="font-size: var(--zak-text-lg)">Lead paragraph for section intros.</p>

<!-- Sans stack for the whole product -->
<h2 style="font-family: var(--zak-font-sans)">Heading</h2>

<!-- Mono stack for code -->
<code style="font-family: var(--zak-font-mono)">npm i zakuikit</code>

<!-- Tabular numerals keep metrics from jittering -->
<span class="zak-stat__value" style="font-variant-numeric: tabular-nums">1,248</span>`,
    css: `/* Type tokens */
--zak-font-sans: "Segoe UI Variable Text", "Segoe UI", "Inter", sans-serif;
--zak-font-mono: "Cascadia Code", "JetBrains Mono", Consolas, monospace;

--zak-text-md: 0.875rem;   /* UI default */
--zak-text-lg: 1.0625rem;  /* Lead paragraphs */

/* Line-heights: tight 1.25 · snug 1.4 · normal 1.6 · relaxed 1.75 */`,
    props: [
      ['--zak-text-md', 'token', '0.875rem', 'UI default body size.'],
      ['--zak-text-lg', 'token', '1.0625rem', 'Lead paragraphs and section intros.'],
      ['--zak-font-sans', 'token', '"Segoe UI Variable Text", …', 'Primary UI type stack.'],
      ['--zak-font-mono', 'token', '"Cascadia Code", …', 'Code and tabular data.'],
      ['font-variant-numeric', 'css', 'normal', 'Set tabular-nums so metrics align.'],
    ],
    stage: 'stretch',
    playground: false,
    notes: ['Numerals in metrics use `font-variant-numeric: tabular-nums` so values do not jitter while updating.'],
    examples: [
      { title: 'Text sm — 13px', desc: 'Captions and labels. Every scale step ships as a `zak-text-*` utility.', tpl: '<p class="zak-text-sm">Small text — captions, labels and supporting copy at 13px.</p>', code: '<p class="zak-text-sm">Small text — captions, labels and supporting copy at 13px.</p>' },
      { title: 'Text md — 14px', desc: 'The UI default size for dense enterprise copy.', tpl: '<p class="zak-text-md">Medium text — the interface default at 14px.</p>', code: '<p class="zak-text-md">Medium text — the interface default at 14px.</p>' },
      { title: 'Text lg — 17px', desc: 'Lead paragraphs for section intros.', tpl: '<p class="zak-text-lg">Large text — lead paragraphs and section intros at 17px.</p>', code: '<p class="zak-text-lg">Large text — lead paragraphs and section intros at 17px.</p>' },
      { title: 'Text xl — 20px', desc: 'Modal titles and prominent inline headings.', tpl: '<p class="zak-text-xl">Extra large text — modal titles at 20px.</p>', code: '<p class="zak-text-xl">Extra large text — modal titles at 20px.</p>' },
      { title: 'Text 2xl — 24px', desc: 'Card headings; the top of the utility text scale.', tpl: '<p class="zak-text-2xl">2XL text — card headings at 24px.</p>', code: '<p class="zak-text-2xl">2XL text — card headings at 24px.</p>' },
      { title: 'Full scale 2xs → 5xl', desc: 'All eleven steps, smallest to largest, in one stack.', tpl: `<div class="zak-stack zak-stack--xs">${typeScale
        .slice()
        .reverse()
        .map((row) => `<p class="zak-text-${row.token.replace('--zak-text-', '')} zak-weight-semibold">${row.sample} · ${row.token.replace('--zak-text-', '')}</p>`)
        .join('\n  ')}</div>`, code: `<div class="zak-stack">
  <p class="zak-text-2xs">…</p>
  <!-- one utility per scale step, through -->
  <p class="zak-text-5xl">…</p>
</div>` },
      { title: 'Fluid text', desc: '`zak-fluid-*` interpolates between breakpoints with clamp() — no media queries needed.', tpl: '<p class="zak-fluid-xl">This paragraph grows smoothly from 1.25rem to 1.75rem as the viewport widens.</p>', code: '<p class="zak-fluid-xl">Fluid heading — scales between breakpoints.</p>', js: `/* The recipe behind every zak-fluid-* class */
.zak-fluid-xl { font-size: clamp(1.25rem, 1.1rem + 0.7vw, 1.75rem); }` },
    ],
  }),
  icons: defineDemo({
    desc: `${Object.keys(iconPaths).length} stroke icons on a 24×24 grid, drawn with a consistent 1.8px stroke. Icons inherit `+'`currentColor`'+` and scale with the `+'`.zak-icon`'+` class.`,
    tpl: iconMarkup,
    codeTpl: `<!-- Default markup — decorative and inherits currentColor -->
<svg class="zak-icon" width="16" height="16" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="1.8"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">…</svg>

<!-- Scale by setting width and height together -->
<svg class="zak-icon" width="24" height="24" viewBox="0 0 24 24">…</svg>

<!-- Stroke weight is consistent across the whole set -->
<svg class="zak-icon" stroke-width="1.8">…</svg>

<!-- Meaningful icon — expose an accessible name -->
<svg class="zak-icon" role="img" aria-label="Search">…</svg>`,
    props: [
      ['.zak-icon', 'class', '—', 'Inherits currentColor and the surrounding font size.'],
      ['width / height', 'attr', '24', 'Set both to scale; 16–22px is the common range.'],
      ['stroke-width', 'attr', '1.8', 'Optical stroke weight shared across the set.'],
      ['aria-hidden', 'boolean', 'true', 'Decorative icons; add role="img" + <title> when meaningful.'],
    ],
    stage: 'stretch',
    playground: false,
  }),
  spacing: defineDemo({
    showTokens: true,
    desc: 'Every gap, pad and margin references a 4px-based step. Twelve steps cover compact controls through editorial whitespace.',
    tpl: spacingMarkup,
    codeTpl: `<!-- Stack rhythm uses a spacing step -->
<div class="zak-stack zak-stack--lg">
  <div class="zak-box">Item one</div>
  <div class="zak-box">Item two</div>
</div>

<!-- Override directly with the --gap custom property -->
<div class="zak-flex" style="gap: var(--zak-space-3)">…</div>`,
    props: [
      ['--zak-space-1 … 12', 'token', '4px → 96px', '4px-based steps drive gap, pad and margin.'],
      ['--gap', 'token', 'var(--zak-space-4)', 'Child spacing for stack and flex primitives.'],
    ],
    stage: 'stretch',
    playground: false,
  }),
  borders: defineDemo({
    showTokens: true,
    desc: 'Hairline borders keep dense UIs calm; stronger borders signal interactive affordances. Radius tokens move from crisp (sm) to pill (full).',
    tpl: `<div class="zak-stack zak-stack--lg" style="width:100%">
    <div class="zak-flex zak-flex--wrap">
      ${radiusMarkup}
    </div>
    <div class="zak-stack zak-stack--sm" style="width:100%">
      <div style="border:1px solid var(--zak-border-color); padding: var(--zak-space-3); border-radius: var(--zak-radius-md)">1px default border — resting surfaces</div>
      <div style="border:1px solid var(--zak-border-strong); padding: var(--zak-space-3); border-radius: var(--zak-radius-md)">1px strong border — interactive affordance</div>
      <div style="border:1.5px dashed var(--zak-border-strong); padding: var(--zak-space-3); border-radius: var(--zak-radius-md)">1.5px dashed — drop targets, empty wells</div>
    </div>
  </div>`,
    codeTpl: `<!-- Subtle hairline for dividers inside cards -->
<hr style="border-color: var(--zak-border-subtle)"/>

<!-- Resting container outline -->
<div style="border: 1px solid var(--zak-border-color)">Card</div>

<!-- Strong border signals an interactive affordance -->
<div style="border: 1px solid var(--zak-border-strong)">Input</div>

<!-- 8px radius for controls -->
<button class="zak-btn" style="border-radius: var(--zak-radius-md)">Button</button>

<!-- 12px radius for cards -->
<div class="zak-box" style="border-radius: var(--zak-radius-lg)">Card</div>

<!-- Pill radius -->
<span class="zak-badge" style="border-radius: var(--zak-radius-full)">Pill</span>`,
    props: [
      ['--zak-border-subtle', 'token', '—', 'Dividers inside cards.'],
      ['--zak-border-color', 'token', '—', 'Resting container outlines.'],
      ['--zak-border-strong', 'token', '—', 'Interactive affordances.'],
      ['--zak-radius-md', 'token', '8px', 'Controls and inputs.'],
      ['--zak-radius-lg', 'token', '12px', 'Cards and panels.'],
      ['--zak-radius-full', 'token', '9999px', 'Pills and avatars.'],
    ],
    stage: 'start',
    playground: false,
    notes: ['Divider lines inside cards use `--zak-border-subtle`; container outlines use `--zak-border-color`.'],
  }),
  shadows: defineDemo({
    showTokens: true,
    desc: 'Five elevation steps. Shadows intensify with surface elevation and soften automatically in dark mode where contrast is carried by surface lightness instead.',
    tpl: `<div class="zak-flex zak-flex--wrap" style="justify-content:center">
    ${shadowMarkup}
  </div>`,
    codeTpl: `<!-- Resting elevation -->
<div class="card" style="box-shadow: var(--zak-shadow-sm)">Card</div>

<!-- Hover lift -->
<div class="card" style="box-shadow: var(--zak-shadow-md)">Card</div>

<!-- Popover layer -->
<div class="popover" style="box-shadow: var(--zak-shadow-lg)">Popover</div>

<!-- Modal layer -->
<div class="modal" style="box-shadow: var(--zak-shadow-xl)">Modal</div>

<!-- Top elevation for the primary action -->
<button class="zak-fab" style="box-shadow: var(--zak-shadow-xxl)">+</button>`,
    props: [
      ['--zak-shadow-sm', 'token', '—', 'Resting cards.'],
      ['--zak-shadow-md', 'token', '—', 'Hover lift.'],
      ['--zak-shadow-lg', 'token', '—', 'Popovers and menus.'],
      ['--zak-shadow-xl', 'token', '—', 'Modals and toasts.'],
      ['--zak-shadow-xxl', 'token', '—', 'Top step — primary floating action.'],
    ],
    playground: false,
    examples: [
      { title: 'Elevation utilities', desc: 'Every shadow step is exposed as a `zak-shadow-*` utility, xxl included.', tpl: `<div class="zak-flex zak-flex--wrap zak-gap-4">${shadowScale
        .map((row) => `<div class="zak-bg-surface zak-rounded-lg" style="padding:var(--zak-space-5);box-shadow:var(${row.token})">${row.token.replace('--zak-shadow-', '')}</div>`)
        .join('\n    ')}</div>`, code: `<!-- zak-shadow-sm · md · lg · xl · xxl -->
<div class="zak-shadow-xxl zak-rounded-lg zak-bg-surface">Top elevation</div>` },
    ],
  }),
  responsive: defineDemo({
    showTokens: true,
    desc: 'Five breakpoints, a fluid layout grid and container-query recipes. Layout primitives respond to their own container when components must be reusable across contexts.',
    tpl: responsiveDemo,
    codeTpl: `<!-- Fluid grid: tracks wrap below the minimum width -->
<div class="zak-lgrid" style="--zak-lgrid-min: 160px">
  <div class="zak-box">Track 1</div>
  <div class="zak-box">Track 2</div>
  <div class="zak-box">Track 3</div>
</div>

<!-- Opt a zone into container queries -->
<div class="zone" style="container-type: inline-size">…</div>

<!-- Respond to the component's own width, not the viewport -->
<style>@container (min-width: 480px) { .zone .card { grid-template-columns: 96px 1fr; } }</style>`,
    css: `@media (max-width: 768px)  { /* tablet: collapse to 1 column */ }
@media (min-width: 1024px) { /* desktop: full chrome */ }
@media (min-width: 1280px) { /* wide: 3–4 column dashboards */ }`,
    props: [
      ['--zak-lgrid-min', 'length', '220px', 'Fluid grid track minimum before wrapping.'],
      ['@container', 'at-rule', '—', 'Styles a component by its own container width — see Browser Support.'],
    ],
    stage: 'stretch',
    playground: false,
    examples: [
      { title: 'Breakpoints', desc: 'Five named steps; every media query in the toolkit targets one of them.', tpl: breakpointTable, code: `/* sm 480 · md 768 · lg 1024 · xl 1280 · 2xl 1536 */
@media (min-width: 480px)  { /* sm and up */ }
@media (min-width: 768px)  { /* md and up */ }
@media (min-width: 1024px) { /* lg and up */ }
@media (min-width: 1280px) { /* xl and up */ }
@media (min-width: 1536px) { /* 2xl and up */ }` },
      { title: 'Media query', desc: 'Hand-written queries plus the fluid grid that needs none of them.', tpl: `<div class="zak-lgrid" style="--zak-lgrid-min: 200px"><div class="zak-box zak-box--primary">Track A</div><div class="zak-box zak-box--primary">Track B</div><div class="zak-box zak-box--primary">Track C</div></div>`, code: `/* Explicit query */
@media (min-width: 1024px) {
  .sidebar { display: block; }
}

/* Or let the fluid grid answer for you — tracks wrap below the minimum */
<div class="zak-lgrid" style="--zak-lgrid-min: 200px">…</div>` },
      { title: 'Responsive display', desc: '`zak-hidden-up-*` hides from a breakpoint and wider; `zak-hidden-down-*` hides below it. Resize the window to watch the chips swap.', tpl: `<div class="zak-flex zak-flex--wrap zak-gap-2">
    <span class="zak-badge zak-badge--danger zak-hidden-up-md">Hidden ≥ 768px (md)</span>
    <span class="zak-badge zak-badge--success zak-hidden-down-md">Only ≥ 768px (md)</span>
    <span class="zak-badge zak-badge--info zak-hidden-up-lg">Hidden ≥ 1024px (lg)</span>
    <span class="zak-badge" style="background:var(--zak-bg-sunken)">Always visible</span>
  </div>`, code: `<span class="zak-hidden-up-md">Hidden on tablets and up</span>
<span class="zak-hidden-down-md">Visible only from md up</span>
<span class="zak-hidden-up-lg">Hidden on laptops and up</span>` },
      { title: 'Browser support', desc: 'The modern features the toolkit relies on and their minimum evergreen versions.', tpl: `<div class="doc-table-wrap" style="width:100%"><table class="doc-table">
      <thead><tr><th>Feature</th><th>Chrome</th><th>Edge</th><th>Firefox</th><th>Safari</th></tr></thead>
      <tbody>
        <tr><td><code>CSS custom properties</code></td><td>49</td><td>15</td><td>31</td><td>9.1</td></tr>
        <tr><td><code>@layer cascade layers</code></td><td>99</td><td>99</td><td>97</td><td>15.4</td></tr>
        <tr><td><code>clamp() fluid type</code></td><td>79</td><td>79</td><td>75</td><td>13.1</td></tr>
        <tr><td><code>Container queries</code></td><td>105</td><td>105</td><td>110</td><td>16</td></tr>
        <tr><td><code>Popover API</code></td><td>114</td><td>114</td><td>125</td><td>17</td></tr>
        <tr><td><code>color-mix()</code></td><td>111</td><td>111</td><td>113</td><td>16.2</td></tr>
        <tr><td><code>:has() selector</code></td><td>105</td><td>105</td><td>121</td><td>15.4</td></tr>
      </tbody>
    </table></div>`, code: `/* Progressive enhancement: every feature degrades gracefully —
   unlayered CSS still cascades, clamped sizes fall back to the first argument. */
@supports (container-type: inline-size) {
  .zone { container-type: inline-size; }
}` },
    ],
  }),
};
