/**
 * Demos — Layout (container, row, columns, grid, flex, stack, box, section, aspect).
 *
 * Every demo renders as a static preview card (`playground` defaults to the
 * preview + code card) and ships a curated `codeTpl` that demonstrates each
 * entry in its props API.
 */
import { defineDemo, type DemoDef } from './types';

const track = (label: string, extra = '') =>
  `<div ${extra || 'class="zak-box zak-box--muted zak-box--sm"'} style="text-align:center;font-size:var(--zak-text-xs)">${label}</div>`;

export const layoutDemos: Record<string, DemoDef> = {
  container: defineDemo({
    desc: 'Centers content and constrains measure. Sizes mirror the breakpoint scale, from `sm` (640px) to `xl` (1280px), plus a fluid escape hatch.',
    tpl: `<div style="width:100%;background:var(--zak-bg-muted);border-radius:var(--zak-radius-lg);padding:var(--zak-space-2)">
    <div class="zak-container--lg" style="background:var(--zak-primary-subtle);border:1px dashed var(--zak-primary-subtle-border);border-radius:var(--zak-radius-md);padding:var(--zak-space-4);text-align:center;font-size:var(--zak-text-sm);color:var(--zak-primary-text)">
      .zak-container--lg
    </div>
  </div>`,
    codeTpl: `<!-- Size modifiers: --sm · --md · --lg · --xl -->
<div class="zak-container zak-container--lg">
  <div class="zak-box">Centered, max-width 1024px</div>
</div>

<!-- Fluid: removes the max-width cap, keeps inline padding -->
<div class="zak-container zak-container--fluid">
  <div class="zak-box">Full-bleed content</div>
</div>

<!-- padding-inline is token-driven -->
<div class="zak-container" style="padding-inline: var(--zak-space-5)">…</div>`,
    props: [
      ['--sm … --xl', 'modifier', '—', 'Caps content width at 640 / 768 / 1024 / 1280px.'],
      ['--fluid', 'modifier', 'false', 'Removes the max-width cap; keeps inline padding.'],
      ['padding-inline', 'token', 'var(--zak-space-5)', 'Horizontal breathing room on small viewports.'],
    ],
    stage: 'stretch',
  }),
  row: defineDemo({
    desc: 'A 12-column CSS grid row. Pass `--zak-row-gap` to control gutter spacing per instance without touching column classes.',
    tpl: `<div class="zak-row" style="--zak-row-gap: var(--zak-space-4); width:100%">
    <div class="zak-col-4">${track('4')}</div>
    <div class="zak-col-4">${track('4')}</div>
    <div class="zak-col-4">${track('4')}</div>
    <div class="zak-col-6">${track('6')}</div>
    <div class="zak-col-6">${track('6')}</div>
    <div class="zak-col-12">${track('12')}</div>
  </div>`,
    codeTpl: `<!-- --zak-row-gap sets the gutter with any spacing token -->
<div class="zak-row" style="--zak-row-gap: var(--zak-space-4)">
  <div class="zak-col-4">4</div>
  <div class="zak-col-4">4</div>
  <div class="zak-col-4">4</div>
</div>

<!-- gap fallback applies when the custom property is absent -->
<div class="zak-row" style="gap: 16px">…</div>`,
    props: [
      ['--zak-row-gap', 'token', 'var(--zak-space-4)', 'Gutter between tracks, any spacing token.'],
      ['gap (fallback)', 'length', '16px', 'Used when the custom property is absent.'],
    ],
    stage: 'stretch',
  }),
  columns: defineDemo({
    desc: 'Column spans from 1 to 12, with responsive overrides that collapse gracefully on smaller grids.',
    tpl: `<div class="zak-row" style="width:100%;--zak-row-gap: var(--zak-space-3)">
    <div class="zak-col-3">${track('3')}</div>
    <div class="zak-col-9">${track('9')}</div>
    <div class="zak-col-8">${track('8')}</div>
    <div class="zak-col-4">${track('4')}</div>
    <div class="zak-col-4 zak-col-sm-12">${track('4 → 12 mobile')}</div>
    <div class="zak-col-4 zak-col-sm-12">${track('4 → 12 mobile')}</div>
    <div class="zak-col-4 zak-col-sm-12">${track('4 → 12 mobile')}</div>
  </div>`,
    codeTpl: `<!-- Base spans: .zak-col-1 … .zak-col-12 -->
<div class="zak-row">
  <div class="zak-col-3">Sidebar</div>
  <div class="zak-col-9">Content</div>
</div>

<!-- Collapse a span to 12 below 768px -->
<div class="zak-col-4 zak-col-sm-12">Card</div>

<!-- Half-width stacking below 768px -->
<div class="zak-col-12 zak-col-md-6">Half</div>`,
    props: [
      ['.zak-col-1 … 12', 'class', '—', 'Grid-column span within the 12-track row.'],
      ['.zak-col-sm-12', 'class', '—', 'Forces span 12 below 768px.'],
      ['.zak-col-md-6', 'class', '—', 'Sets span 6 below 768px for half-width stacking.'],
    ],
    stage: 'stretch',
  }),
  grid: defineDemo({
    desc: 'An auto-fit grid driven by a minimum track size. The min is a custom property, so one class serves every density requirement in a product.',
    tpl: `<div class="zak-lgrid" style="--zak-lgrid-min: 180px; width:100%">
    ${track('Track')}
    ${track('Track')}
    ${track('Track')}
    ${track('Track')}
    ${track('Track')}
    ${track('Track')}
  </div>`,
    codeTpl: `<!-- --zak-lgrid-min is the minimum track width before wrapping -->
<div class="zak-lgrid" style="--zak-lgrid-min: 180px">
  <article class="card">…</article>
  <article class="card">…</article>
  <article class="card">…</article>
</div>

<!-- --grid-gap controls the gap between tracks and rows -->
<div class="zak-lgrid" style="--zak-lgrid-min: 220px; --grid-gap: var(--zak-space-4)">…</div>

<!-- --fill keeps empty tracks (auto-fill instead of auto-fit) -->
<div class="zak-lgrid zak-lgrid--fill" style="--zak-lgrid-min: 140px">…</div>`,
    props: [
      ['--zak-lgrid-min', 'length', '220px', 'Minimum track width before wrapping to a new row.'],
      ['--grid-gap', 'token', 'var(--zak-space-4)', 'Gap between tracks and rows.'],
      ['--fill', 'modifier', 'false', 'Uses auto-fill (keeps empty tracks) instead of auto-fit.'],
    ],
    stage: 'stretch',
  }),
  flex: defineDemo({
    desc: 'One-dimensional alignment utilities for toolbars, media rows and inline clusters.',
    tpl: `<div style="width:100%">
    <div class="zak-flex--center" style="background:var(--zak-bg-muted);border-radius:var(--zak-radius-md);padding:var(--zak-space-4);min-height:7rem">
      <div class="zak-box zak-box--sm">Alpha</div>
      <div class="zak-box zak-box--sm">Bravo</div>
      <div class="zak-box zak-box--sm">Charlie</div>
    </div>
  </div>`,
    codeTpl: `<!-- Direction: default row · --col · --row-reverse -->
<div class="zak-flex zak-flex--col">
  <div class="zak-box">Alpha</div>
  <div class="zak-box">Bravo</div>
</div>

<!-- Center on both axes -->
<div class="zak-flex zak-flex--center">…</div>

<!-- Push extremes apart (toolbars) -->
<div class="zak-flex zak-flex--between">…</div>

<!-- Cross-axis wrapping -->
<div class="zak-flex zak-flex--wrap">…</div>

<!-- gap is token-driven -->
<div class="zak-flex" style="gap: var(--zak-space-3)">…</div>`,
    props: [
      ['--col / --row-reverse', 'modifier', 'row', 'Main-axis direction.'],
      ['--center', 'modifier', '—', 'Centers on both axes.'],
      ['--between', 'modifier', '—', 'Pushes extremes apart (toolbars).'],
      ['--wrap / --nowrap', 'modifier', 'nowrap', 'Cross-axis wrapping behaviour.'],
      ['gap', 'token', 'var(--zak-space-3)', 'Space between children.'],
    ],
    stage: 'stretch',
  }),
  stack: defineDemo({
    desc: 'Rhythm primitive for grouping — vertical by default, horizontal with `--row`. Preferred over manual margins for forms, cards and inline clusters.',
    tpl: `<div class="zak-stack zak-stack--lg" style="width:100%;max-width:30rem">
    <div class="zak-stack zak-stack--md" style="background:var(--zak-bg-muted);padding:var(--zak-space-3);border-radius:var(--zak-radius-md)">
      <div class="zak-box">Item one</div>
      <div class="zak-box">Item two</div>
      <div class="zak-box">Item three</div>
    </div>
    <div class="zak-stack zak-stack--row zak-stack--md" style="background:var(--zak-bg-muted);padding:var(--zak-space-3);border-radius:var(--zak-radius-md)">
      <div class="zak-box">Alpha</div>
      <div class="zak-box">Bravo</div>
      <div class="zak-box">Charlie</div>
    </div>
  </div>`,
    codeTpl: `<!-- Vertical rhythm (default): size modifiers --xs · --sm · --md · --lg · --xl -->
<div class="zak-stack zak-stack--md">
  <div class="zak-box">Item one</div>
  <div class="zak-box">Item two</div>
  <div class="zak-box">Item three</div>
</div>

<!-- Horizontal stack: --row -->
<div class="zak-stack zak-stack--row zak-stack--sm">
  <div class="zak-box">Alpha</div>
  <div class="zak-box">Bravo</div>
</div>

<!-- --col forces the vertical axis explicitly; --wrap lets a row wrap -->
<div class="zak-stack zak-stack--row zak-stack--wrap">…</div>

<!-- --gap overrides the child gap directly -->
<div class="zak-stack" style="--gap: var(--zak-space-6)">…</div>`,
    props: [
      ['--xs … --xl', 'modifier', 'md', 'Sets --gap from 4px to 48px via spacing tokens.'],
      ['--row / --col', 'modifier', '--col', 'Child axis: horizontal (--row) or vertical (--col, default).'],
      ['--wrap', 'modifier', 'false', 'Lets a horizontal stack wrap onto new lines.'],
      ['--gap', 'token', 'var(--zak-space-4)', 'Directly override the child gap.'],
    ],
    stage: 'start',
  }),
  box: defineDemo({
    desc: 'The surface primitive. Boxes carry background, border, radius and padding; variants express resting, sunken, outlined, brand and glass treatments.',
    tpl: `<div class="zak-lgrid" style="--zak-lgrid-min: 200px; width:100%">
    <div class="zak-box zak-box--md">Default box</div>
    <div class="zak-box zak-box--sunken">Sunken — recessed wells</div>
    <div class="zak-box zak-box--outline">Outline — empty states</div>
    <div class="zak-box zak-box--primary">Brand — highlights</div>
    <div class="zak-box zak-box--glass" style="background-image:radial-gradient(circle at 20% 20%, var(--zak-primary-subtle), transparent 60%), radial-gradient(circle at 80% 80%, rgba(6,182,212,.25), transparent 60%)">Glass — glassmorphic</div>
    <div class="zak-box zak-box--flat zak-box--muted">Flat + muted</div>
  </div>`,
    codeTpl: `<!-- Padding density: --sm (12px) · default md (20px) · --lg (32px) -->
<div class="zak-box zak-box--lg">Padded box</div>

<!-- Recessed well for grouping -->
<div class="zak-box zak-box--sunken">Sunken</div>

<!-- Brand-tinted highlight -->
<div class="zak-box zak-box--primary">Brand</div>

<!-- Glass surface: translucent bg + blur + light border -->
<div class="zak-box zak-box--glass">Glass</div>

<!-- Borderless, for seamless embedding -->
<div class="zak-box zak-box--flat">Flat</div>`,
    props: [
      ['--sm / --lg', 'modifier', 'md', 'Padding density: 12px / 20px / 32px.'],
      ['--sunken', 'modifier', '—', 'Uses --zak-bg-sunken for recessed regions.'],
      ['--primary', 'modifier', '—', 'Brand-tinted background + border.'],
      ['--glass', 'modifier', '—', 'Applies the glass recipe (translucency + blur).'],
      ['--flat', 'modifier', '—', 'Removes the border for seamless embedding.'],
    ],
    stage: 'stretch',
  }),
  'aspect-ratio': defineDemo({
    desc: 'Media wrappers locked to a ratio via the native `aspect-ratio` property. Children fill the frame with `object-fit: cover`.',
    tpl: `<div class="zak-flex zak-flex--wrap" style="width:100%;align-items:flex-start">
    <div style="flex:1 1 200px;min-width:180px">
      <div class="zak-aspect zak-aspect--16x9"><div class="zak-img-ph">16x9</div></div>
      <p class="zak-hint" style="margin-block-start:var(--zak-space-2)">Video, hero media</p>
    </div>
    <div style="flex:1 1 160px;min-width:150px">
      <div class="zak-aspect zak-aspect--4x3"><div class="zak-img-ph zak-img-ph--cool">4 / 3</div></div>
      <p class="zak-hint" style="margin-block-start:var(--zak-space-2)">Cards, thumbnails</p>
    </div>
    <div style="flex:0 1 150px">
      <div class="zak-aspect zak-aspect--1x1"><div class="zak-img-ph zak-img-ph--green">1 / 1</div></div>
      <p class="zak-hint" style="margin-block-start:var(--zak-space-2)">Avatars, tiles</p>
    </div>
    <div style="flex:0 1 110px">
      <div class="zak-aspect zak-aspect--9x16"><div class="zak-img-ph zak-img-ph--alt">9 / 16</div></div>
      <p class="zak-hint" style="margin-block-start:var(--zak-space-2)">Stories</p>
    </div>
  </div>`,
    codeTpl: `<!-- Square frame -->
<div class="zak-aspect zak-aspect--1x1"><img src="…" alt="…"/></div>

<!-- Classic photo ratio -->
<div class="zak-aspect zak-aspect--4x3"><img src="…" alt="…"/></div>

<!-- Default video ratio -->
<div class="zak-aspect zak-aspect--16x9"><video src="…"></video></div>

<!-- Cinematic banner ratio -->
<div class="zak-aspect zak-aspect--21x9"><img src="…" alt="…"/></div>

<!-- Arbitrary ratio via custom property -->
<div class="zak-aspect" style="--ratio: 5 / 2">…</div>`,
    props: [
      ['--1x1', 'modifier', '—', 'Square frame.'],
      ['--4x3', 'modifier', '—', 'Classic photo ratio.'],
      ['--16x9', 'modifier', '16/9', 'Default when no modifier is present.'],
      ['--21x9', 'modifier', '—', 'Cinematic banner ratio.'],
      ['--ratio', 'custom', '16 / 9', 'Accepts any CSS ratio value.'],
    ],
    stage: 'stretch',
  }),
};
