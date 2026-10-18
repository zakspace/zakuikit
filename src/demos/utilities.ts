/**
 * Demos — Utilities (helper-class reference pages).
 *
 * These join the former Foundations token pages to form a single "Utilities"
 * category. Each demo documents one helper-class family with per-variant
 * Preview + Code cards, mirroring the reference utilities sheet. Pure markup:
 * `playground` is disabled and the preview is static HTML.
 */
import { defineDemo, type DemoDef } from './types';
import { radiusScale } from '../data/tokens';

const box = (cls: string, label: string) =>
  `<div class="zak-border zak-rounded-md zak-bg-surface ${cls}" style="padding:var(--zak-space-2) var(--zak-space-3)">${label}</div>`;

export const utilitiesDemos: Record<string, DemoDef> = {
  'font-weight': defineDemo({
    desc: 'Four named weights mapped to the font stack’s variable axes. Use them to build hierarchy without reaching for a new size token.',
    tpl: '<div class="zak-stack zak-stack--xs"><p class="zak-weight-normal">Normal 400 — the quick brown fox</p><p class="zak-weight-medium">Medium 500 — the quick brown fox</p><p class="zak-weight-semibold">Semibold 600 — the quick brown fox</p><p class="zak-weight-bold">Bold 700 — the quick brown fox</p></div>',
    playground: false,
    stage: 'stretch',
    codeTpl: `<!-- Font weight utilities -->
<p class="zak-weight-normal">Normal 400</p>
<p class="zak-weight-medium">Medium 500</p>
<p class="zak-weight-semibold">Semibold 600</p>
<p class="zak-weight-bold">Bold 700</p>`,
    props: [
      ['zak-weight-normal', 'class', '400', 'Body copy default.'],
      ['zak-weight-medium', 'class', '500', 'Emphasised labels and nav items.'],
      ['zak-weight-semibold', 'class', '600', 'Sub-headings and strong inline text.'],
      ['zak-weight-bold', 'class', '700', 'Headings and high-emphasis figures.'],
    ],
    examples: [
      { title: 'Normal — 400', desc: 'The resting weight for paragraphs.', tpl: '<p class="zak-weight-normal">The quick brown fox jumps over the lazy dog.</p>', code: '<p class="zak-weight-normal">The quick brown fox…</p>' },
      { title: 'Medium — 500', desc: 'A gentle step up for labels and links.', tpl: '<p class="zak-weight-medium">The quick brown fox jumps over the lazy dog.</p>', code: '<p class="zak-weight-medium">The quick brown fox…</p>' },
      { title: 'Semibold — 600', desc: 'Sub-headings and emphasised copy.', tpl: '<p class="zak-weight-semibold">The quick brown fox jumps over the lazy dog.</p>', code: '<p class="zak-weight-semibold">The quick brown fox…</p>' },
      { title: 'Bold — 700', desc: 'Maximum emphasis for headings and metrics.', tpl: '<p class="zak-weight-bold">The quick brown fox jumps over the lazy dog.</p>', code: '<p class="zak-weight-bold">The quick brown fox…</p>' },
    ],
  }),

  'text-alignment': defineDemo({
    desc: 'Logical text alignment that follows the document writing direction. The shaded band shows the line box so the alignment is obvious.',
    tpl: '<div class="zak-stack zak-stack--xs"><p class="zak-text-start zak-bg-sunken" style="padding:var(--zak-space-2)">Start</p><p class="zak-text-center zak-bg-sunken" style="padding:var(--zak-space-2)">Center</p><p class="zak-text-end zak-bg-sunken" style="padding:var(--zak-space-2)">End</p></div>',
    playground: false,
    stage: 'stretch',
    codeTpl: `<!-- Logical text alignment -->
<p class="zak-text-start">Start</p>
<p class="zak-text-center">Center</p>
<p class="zak-text-end">End</p>`,
    props: [
      ['zak-text-start', 'class', 'start', 'Aligns to the inline-start edge (left in LTR).'],
      ['zak-text-center', 'class', 'center', 'Centres each line.'],
      ['zak-text-end', 'class', 'end', 'Aligns to the inline-end edge (right in LTR).'],
    ],
    examples: [
      { title: 'Start', desc: 'Inline-start aligned — the reading default.', tpl: `<p class="zak-text-start zak-bg-sunken" style="padding:var(--zak-space-2)">Aligned to the start edge</p>`, code: '<p class="zak-text-start">Aligned to the start edge</p>' },
      { title: 'Center', desc: 'Centre a line or a whole block.', tpl: `<p class="zak-text-center zak-bg-sunken" style="padding:var(--zak-space-2)">Centred paragraph</p>`, code: '<p class="zak-text-center">Centred paragraph</p>' },
      { title: 'End', desc: 'Inline-end alignment for trailing copy.', tpl: `<p class="zak-text-end zak-bg-sunken" style="padding:var(--zak-space-2)">End-aligned text</p>`, code: '<p class="zak-text-end">End-aligned text</p>' },
    ],
  }),

  decoration: defineDemo({
    desc: 'Text decoration and case helpers. Decoration respects `text-underline-offset` so underlines stay legible over descenders.',
    tpl: '<div class="zak-stack zak-stack--xs"><p class="zak-text-underline">Underline</p><p class="zak-text-strike">Strikethrough</p><p class="zak-text-upper">Uppercase</p><p class="zak-text-lower">LOWERCASE</p></div>',
    playground: false,
    stage: 'stretch',
    codeTpl: `<!-- Decoration & case utilities -->
<p class="zak-text-underline">Underline</p>
<p class="zak-text-strike">Strikethrough</p>
<p class="zak-text-upper">Uppercase</p>
<p class="zak-text-lower">lowercase</p>`,
    props: [
      ['zak-text-underline', 'class', '—', 'Underline with a comfortable offset.'],
      ['zak-text-strike', 'class', '—', 'Line-through for removed or compare-at prices.'],
      ['zak-text-upper', 'class', '—', 'Uppercase with tracking for eyebrow labels.'],
      ['zak-text-lower', 'class', '—', 'Force lowercase.'],
    ],
    examples: [
      { title: 'Underline', desc: 'Semantic underline for inline links.', tpl: '<p class="zak-text-underline">Underlined text sample</p>', code: '<p class="zak-text-underline">Underlined text sample</p>' },
      { title: 'Strike', desc: 'Mark a value as removed.', tpl: '<p class="zak-text-strike">$240 <span class="zak-text-danger">$180</span></p>', code: '<p class="zak-text-strike">$240 $180</p>' },
      { title: 'Uppercase', desc: 'Eyebrow labels and section kickers.', tpl: '<p class="zak-text-upper">Account overview</p>', code: '<p class="zak-text-upper">Account overview</p>' },
      { title: 'Lowercase', desc: 'Normalise user-entered handles.', tpl: '<p class="zak-text-lower">HANDLE / @USER</p>', code: '<p class="zak-text-lower">HANDLE / @USER</p>' },
    ],
  }),

  margin: defineDemo({
    desc: 'Margin utilities on the 4px spacing scale (steps 0–6). Directional and axis variants cover the common cases; `mx-auto` centres a fixed-width block.',
    tpl: '<div class="zak-stack zak-stack--xs" style="width:100%">' + [0, 1, 2, 3, 4, 5, 6].map((n) => `<div class="zak-bg-sunken" style="border-radius:var(--zak-radius-sm)"><div class="zak-bg-primary-subtle zak-rounded-sm zak-m-${n}" style="padding:var(--zak-space-1)">zak-m-${n}</div></div>`).join('') + '</div>',
    playground: false,
    stage: 'stretch',
    codeTpl: `<!-- Margin — steps 0–6 on the spacing scale -->
<div class="zak-m-0">zero</div>
<div class="zak-m-3">12px</div>
<div class="zak-m-6">32px</div>
<!-- Directional and axis variants -->
<div class="zak-mt-4">block start</div>
<div class="zak-ms-4">inline start</div>
<div class="zak-mx-auto zak-my-4">centred block</div>`,
    props: [
      ['zak-m-0 … zak-m-6', 'class', '0–32px', 'All four sides.'],
      ['zak-mt- / zak-mb-', 'class', '0–32px', 'Block start / end.'],
      ['zak-ms- / zak-me-', 'class', '0–32px', 'Inline start / end (logical).'],
      ['zak-mx- / zak-my-', 'class', '—', 'Both inline / both block axes.'],
      ['zak-mx-auto', 'class', '—', 'Horizontally centres a sized element.'],
    ],
    examples: [
      {
        title: 'The scale',
        desc: 'Each step maps to a `--zak-space-N` token.',
        tpl: `<div class="zak-stack zak-stack--xs" style="width:100%">${[0, 1, 2, 3, 4, 5, 6]
          .map((n) => `<div class="zak-bg-sunken" style="border-radius:var(--zak-radius-sm)"><div class="zak-bg-primary-subtle zak-rounded-sm zak-m-${n}" style="padding:var(--zak-space-1)">zak-m-${n}</div></div>`)
          .join('\n  ')}</div>`,
        code: `<div class="zak-m-0">…</div>\n<div class="zak-m-3">…</div>\n<div class="zak-m-6">…</div>`,
      },
      {
        title: 'Directional',
        desc: 'Target a single edge.',
        tpl: `<div class="zak-stack zak-stack--xs" style="width:100%">${box('zak-mt-4', 'zak-mt-4 (block start)')}${box('zak-mb-4', 'zak-mb-4 (block end)')}${box('zak-ms-4', 'zak-ms-4 (inline start)')}</div>`,
        code: `<div class="zak-mt-4">…</div>\n<div class="zak-mb-4">…</div>\n<div class="zak-ms-4">…</div>`,
      },
      {
        title: 'Axis & centering',
        desc: 'Both-axis and auto margins.',
        tpl: `<div class="zak-bg-sunken" style="width:100%;padding:var(--zak-space-1)"><div class="zak-bg-primary-subtle zak-rounded-sm zak-my-3 zak-mx-auto" style="width:60%;padding:var(--zak-space-2);text-align:center">zak-my-3 zak-mx-auto</div></div>`,
        code: `<div class="zak-my-3 zak-mx-auto" style="width:60%">Centred block</div>`,
      },
    ],
  }),

  padding: defineDemo({
    desc: 'Padding utilities on the same 4px scale. Directional and axis variants make one-off surface tweaks possible without a new component class.',
    tpl: '<div class="zak-stack zak-stack--xs" style="width:100%">' + [0, 1, 2, 3, 4, 5, 6].map((n) => `<div class="zak-border zak-rounded-sm zak-bg-surface zak-p-${n}"><div class="zak-bg-sunken zak-rounded-sm" style="padding:2px">zak-p-${n}</div></div>`).join('') + '</div>',
    playground: false,
    stage: 'stretch',
    codeTpl: `<!-- Padding — steps 0–6 on the spacing scale -->
<div class="zak-p-0">zero</div>
<div class="zak-p-3">12px</div>
<div class="zak-p-6">32px</div>
<!-- Directional and axis variants -->
<div class="zak-pt-4">block start</div>
<div class="zak-px-4 zak-py-2">list row</div>`,
    props: [
      ['zak-p-0 … zak-p-6', 'class', '0–32px', 'All four sides.'],
      ['zak-pt- / zak-pb-', 'class', '—', 'Block start / end.'],
      ['zak-ps- / zak-pe-', 'class', '—', 'Inline start / end.'],
      ['zak-px- / zak-py-', 'class', '—', 'Both inline / both block axes.'],
    ],
    examples: [
      {
        title: 'The scale',
        desc: 'The tinted area grows with each step.',
        tpl: `<div class="zak-stack zak-stack--xs" style="width:100%">${[0, 1, 2, 3, 4, 5, 6]
          .map((n) => `<div class="zak-border zak-rounded-sm zak-bg-surface zak-p-${n}"><div class="zak-bg-sunken zak-rounded-sm" style="padding:2px">zak-p-${n}</div></div>`)
          .join('\n  ')}</div>`,
        code: `<div class="zak-p-0">…</div>\n<div class="zak-p-3">…</div>\n<div class="zak-p-6">…</div>`,
      },
      {
        title: 'Directional',
        desc: 'Pad a single edge.',
        tpl: `<div class="zak-stack zak-stack--xs" style="width:100%">${box('zak-pt-4', 'zak-pt-4')}${box('zak-pb-4', 'zak-pb-4')}${box('zak-ps-4', 'zak-ps-4')}</div>`,
        code: `<div class="zak-pt-4">…</div>\n<div class="zak-pb-4">…</div>\n<div class="zak-ps-4">…</div>`,
      },
      {
        title: 'Axis',
        desc: 'Both-axis padding for list rows and banners.',
        tpl: `<div class="zak-border zak-rounded-md zak-bg-surface zak-px-4 zak-py-2">zak-px-4 zak-py-2</div>`,
        code: '<div class="zak-px-4 zak-py-2">Row content</div>',
      },
    ],
  }),

  radius: defineDemo({
    desc: 'Corner radius from crisp (sm) to full pill. Radius is a token scale, so a single change retunes every surface.',
    tpl: '<div class="zak-flex zak-flex--wrap zak-gap-4">' + radiusScale.map((r) => { const name = `zak-rounded-${r.token.replace('--zak-radius-', '')}`; return `<div class="zak-bg-surface zak-border ${name}" style="width:88px;height:88px;display:grid;place-items:center;font-size:var(--zak-text-xs)">${name}</div>`; }).join('') + '</div>',
    playground: false,
    stage: 'start',
    showTokens: true,
    codeTpl: `<!-- Corner radius tokens -->
<div class="zak-rounded-sm">sm</div>
<div class="zak-rounded-md">md</div>
<div class="zak-rounded-lg">lg</div>
<div class="zak-rounded-full">Pill</div>`,
    props: radiusScale.map((r) => [`zak-rounded-${r.token.replace('--zak-radius-', '')}`, 'class', r.pixels, 'Corner radius from the token scale.']),
    examples: [
      {
        title: 'The scale',
        desc: 'Every radius step, smallest to pill.',
        tpl: `<div class="zak-flex zak-flex--wrap zak-gap-4">${radiusScale
          .map((r) => {
            const name = `zak-rounded-${r.token.replace('--zak-radius-', '')}`;
            return `<div class="zak-bg-surface zak-border ${name}" style="width:88px;height:88px;display:grid;place-items:center;font-size:var(--zak-text-xs)">${name}</div>`;
          })
          .join('\n  ')}</div>`,
        code: `<div class="zak-rounded-sm">…</div>\n<div class="zak-rounded-md">…</div>\n<!-- … -->\n<div class="zak-rounded-full">Pill</div>`,
      },
      { title: 'Corners on media', desc: 'Clip images and tiles with the same tokens.', tpl: `<img class="zak-rounded-lg" src="https://picsum.photos/seed/zak-radius/240/120" alt="Rounded media" style="width:240px;height:120px;object-fit:cover" />`, code: '<img class="zak-rounded-lg" src="…" alt="Rounded media" />' },
    ],
  }),

  sizing: defineDemo({
    desc: 'Width, height and max-width helpers aligned to the breakpoint scale. Fractions cover the common splits; `max-w-*` caps line length.',
    tpl: '<div class="zak-stack zak-stack--xs" style="width:100%">' + ['zak-w-full', 'zak-w-2-3', 'zak-w-1-2', 'zak-w-1-3'].map((w) => `<div class="zak-bg-sunken zak-border zak-rounded-sm ${w}" style="padding:var(--zak-space-2) var(--zak-space-3)">${w}</div>`).join('') + '</div>',
    playground: false,
    stage: 'stretch',
    codeTpl: `<!-- Width, height and max-width utilities -->
<div class="zak-w-full">full</div>
<div class="zak-w-1-2">half</div>
<div class="zak-max-w-md zak-mx-auto">constrained</div>
<div class="zak-h-full">fills the row height</div>`,
    props: [
      ['zak-w-full / zak-w-auto', 'class', '—', 'Full or intrinsic width.'],
      ['zak-w-1-2 / 1-3 / 2-3', 'class', '—', 'Fractional widths.'],
      ['zak-max-w-sm … xl', 'class', '640–1280px', 'Cap measure to the breakpoint scale.'],
      ['zak-h-full / zak-min-w-0', 'class', '—', 'Height and flex-overflow guards.'],
    ],
    examples: [
      {
        title: 'Fractional widths',
        desc: 'Quick splits without a grid.',
        tpl: `<div class="zak-stack zak-stack--xs" style="width:100%">${['zak-w-full', 'zak-w-2-3', 'zak-w-1-2', 'zak-w-1-3']
          .map((w) => `<div class="zak-bg-sunken zak-border zak-rounded-sm ${w}" style="padding:var(--zak-space-2) var(--zak-space-3)">${w}</div>`)
          .join('\n  ')}</div>`,
        code: `<div class="zak-w-full">…</div>\n<div class="zak-w-1-2">…</div>\n<div class="zak-w-1-3">…</div>`,
      },
      {
        title: 'Max width',
        desc: 'Constrain a block regardless of container.',
        tpl: `<div class="zak-bg-sunken zak-border zak-rounded-md zak-max-w-md zak-mx-auto" style="padding:var(--zak-space-3)">zak-max-w-md · centered</div>`,
        code: '<div class="zak-max-w-md zak-mx-auto">Constrained measure</div>',
      },
      {
        title: 'Height',
        desc: 'Fill the parent height in a fixed row.',
        tpl: `<div style="height:96px;display:flex;gap:var(--zak-space-2)"><div class="zak-bg-primary-subtle zak-rounded-sm zak-h-full" style="width:64px;display:grid;place-items:center">h-full</div><div class="zak-bg-sunken zak-rounded-sm" style="width:64px;display:grid;place-items:center">auto</div></div>`,
        code: '<div class="zak-h-full">Fills the row height</div>',
      },
    ],
  }),

  display: defineDemo({
    desc: 'One-shot display switching plus visibility. `zak-hidden` removes an element everywhere; `zak-visually-hidden` keeps it in the accessibility tree.',
    tpl: '<div class="zak-flex zak-flex--wrap zak-gap-2"><span class="zak-badge">block</span><span class="zak-badge">inline-block</span><span class="zak-badge">flex</span><span class="zak-badge">grid</span></div>',
    playground: false,
    stage: 'stretch',
    codeTpl: `<!-- Display switching -->
<span class="zak-d-block">block</span>
<div class="zak-d-flex zak-gap-2">flex container</div>
<div class="zak-d-grid">grid container</div>
<!-- Visibility -->
<p class="zak-hidden">Removed from layout</p>
<p class="zak-visually-hidden">Screen-reader only</p>
<p class="zak-truncate">Ellipsised long text</p>`,
    props: [
      ['zak-d-none / block / inline', 'class', '—', 'Core display values.'],
      ['zak-d-flex / grid', 'class', '—', 'Turn any box into a flex or grid container.'],
      ['zak-hidden', 'class', '—', 'display:none at every size.'],
      ['zak-visually-hidden', 'class', '—', 'Invisible on screen, announced by AT.'],
      ['zak-truncate', 'class', '—', 'Ellipsis on a single overflowing line.'],
    ],
    examples: [
      { title: 'Display values', desc: 'Switch box vs inline vs flex.', tpl: `<div class="zak-flex zak-flex--wrap zak-gap-2">${['zak-d-block', 'zak-d-inline-block', 'zak-d-flex', 'zak-d-grid'].map((d) => `<span class="zak-badge zak-badge--primary ${d === 'zak-d-flex' ? '' : ''}">${d}</span>`).join('\n  ')}</div>`, code: `<span class="zak-d-block">Block</span>\n<div class="zak-d-flex zak-gap-2">Flex container</div>\n<div class="zak-d-grid">Grid container</div>` },
      { title: 'Visibility', desc: 'Hide completely, or from sight only.', tpl: `<div class="zak-stack zak-stack--xs"><p>Visible paragraph.</p><p class="zak-visually-hidden">This is visually hidden but read by screen readers.</p></div>`, code: `<p class="zak-hidden">Removed from layout</p>\n<p class="zak-visually-hidden">Screen-reader only</p>` },
      { title: 'Truncate', desc: 'Ellipsis long single-line text inside a bounded box.', tpl: `<p class="zak-truncate zak-bg-sunken zak-border zak-rounded-sm" style="max-width:240px;padding:var(--zak-space-2) var(--zak-space-3)">This box truncates long single-line text with an ellipsis when it runs out of room.</p>`, code: '<p class="zak-truncate" style="max-width:240px">Long single-line text…</p>' },
    ],
  }),

  flexbox: defineDemo({
    desc: 'Flex helpers that complement the `.zak-flex` primitive — direction, alignment, justification, growth and shrink on any container.',
    tpl: '<div class="zak-d-flex zak-justify-between zak-items-center zak-gap-2 zak-bg-sunken zak-rounded-md" style="padding:var(--zak-space-3)"><span class="zak-badge">Left</span><span class="zak-badge">Centre</span><span class="zak-badge">Right</span></div>',
    playground: false,
    stage: 'stretch',
    codeTpl: `<!-- Flex helpers on any container -->
<div class="zak-d-flex zak-justify-between zak-items-center zak-gap-2">
  <div class="zak-flex-1">Grows</div>
  <div class="zak-shrink-0">Holds</div>
</div>`,
    props: [
      ['zak-flex-row / zak-flex-col', 'class', '—', 'Main-axis direction.'],
      ['zak-justify-*', 'class', '—', 'start · center · end · between.'],
      ['zak-items-*', 'class', '—', 'Cross-axis alignment.'],
      ['zak-flex-1 / zak-grow / zak-shrink-0', 'class', '—', 'Sizing behaviour of children.'],
    ],
    examples: [
      { title: 'Row + justify', desc: 'Spread children along the main axis.', tpl: `<div class="zak-d-flex zak-justify-between zak-gap-2 zak-bg-sunken zak-rounded-md" style="padding:var(--zak-space-3)"><span class="zak-badge">Left</span><span class="zak-badge">Centre</span><span class="zak-badge">Right</span></div>`, code: '<div class="zak-d-flex zak-justify-between zak-gap-2">…</div>' },
      { title: 'Grow & shrink', desc: 'A flexible child fills space; a fixed one holds.', tpl: `<div class="zak-d-flex zak-gap-2"><div class="zak-bg-primary-subtle zak-rounded-sm zak-flex-1" style="padding:var(--zak-space-3)">zak-flex-1</div><div class="zak-bg-sunken zak-rounded-sm zak-shrink-0" style="padding:var(--zak-space-3)">fixed</div></div>`, code: '<div class="zak-d-flex zak-gap-2">\n  <div class="zak-flex-1">Grows</div>\n  <div class="zak-shrink-0">Holds</div>\n</div>' },
      { title: 'Align items', desc: 'Cross-axis alignment on a tall row.', tpl: `<div class="zak-d-flex zak-items-center zak-gap-3 zak-bg-sunken zak-rounded-md" style="min-height:96px;padding:var(--zak-space-3)"><span class="zak-badge zak-badge--info">centered</span><button class="zak-btn zak-btn--filled zak-btn--sm" type="button">Action</button></div>`, code: '<div class="zak-d-flex zak-items-center zak-gap-3">…</div>' },
    ],
  }),

  position: defineDemo({
    desc: 'Positioning helpers with logical edge offsets. Pair a `relative` parent with an `absolute` child for badges and overlays.',
    tpl: '<div class="zak-position-relative zak-bg-surface zak-border zak-rounded-md" style="width:140px;height:96px;display:grid;place-items:center">Panel<span class="zak-badge zak-badge--danger zak-position-absolute zak-top-0 zak-end-0" style="transform:translate(40%,-40%)">3</span></div>',
    playground: false,
    stage: 'stretch',
    codeTpl: `<!-- Positioning with logical edge offsets -->
<div class="zak-position-relative">
  <span class="zak-position-absolute zak-top-0 zak-end-0">3</span>
</div>
<header class="zak-position-sticky zak-top-0">Sticky header</header>`,
    props: [
      ['zak-position-static / relative', 'class', '—', 'In-flow and offset parent.'],
      ['zak-position-absolute', 'class', '—', 'Removed from flow, anchored to nearest positioned ancestor.'],
      ['zak-position-fixed / sticky', 'class', '—', 'Viewport and scroll-pinned placement.'],
      ['zak-inset-0', 'class', '—', 'All edges at zero.'],
    ],
    examples: [
      { title: 'Relative + absolute', desc: 'A badge pinned to a corner.', tpl: `<div class="zak-position-relative zak-bg-surface zak-border zak-rounded-md" style="width:140px;height:96px;display:grid;place-items:center">Panel<span class="zak-badge zak-badge--danger zak-position-absolute zak-top-0 zak-end-0" style="transform:translate(40%,-40%)">3</span></div>`, code: '<div class="zak-position-relative">\n  <span class="zak-position-absolute zak-top-0 zak-end-0">3</span>\n</div>' },
      { title: 'Sticky', desc: 'Pin a row while its scroller moves.', tpl: `<div class="zak-bg-sunken zak-rounded-md" style="height:120px;overflow:auto"><div class="zak-position-sticky zak-top-0 zak-bg-primary-subtle zak-rounded-sm" style="padding:var(--zak-space-2) var(--zak-space-3);font-weight:600">Sticky header</div>${'<p style="padding:var(--zak-space-3)">Scroll content…</p>'.repeat(4)}</div>`, code: '<div style="overflow:auto">\n  <header class="zak-position-sticky zak-top-0">Sticky</header>\n</div>' },
    ],
  }),

  overflow: defineDemo({
    desc: 'Clip or scroll overflowing content, per axis. `zak-overflow-auto` gives a scroll container that only shows bars when needed.',
    tpl: '<div class="zak-overflow-auto zak-border zak-rounded-md zak-bg-surface" style="max-height:110px;padding:var(--zak-space-3)">' + '<p style="margin:0 0 var(--zak-space-2)">Long line of body copy that overflows the fixed height of this box.</p>'.repeat(6) + '</div>',
    playground: false,
    stage: 'stretch',
    codeTpl: `<!-- Overflow control, whole box or per axis -->
<div class="zak-overflow-auto" style="max-height:120px">Scrolls</div>
<div class="zak-overflow-hidden">Clips</div>
<div class="zak-overflow-x-auto">Wide table</div>`,
    props: [
      ['zak-overflow-auto', 'class', '—', 'Scroll only when content overflows.'],
      ['zak-overflow-hidden', 'class', '—', 'Clip overflow.'],
      ['zak-overflow-scroll', 'class', '—', 'Always show scrollbars.'],
      ['zak-overflow-x- / y-', 'class', '—', 'Control each axis independently.'],
    ],
    examples: [
      { title: 'Scroll (auto)', desc: 'Constrain a tall region with its own scroll.', tpl: `<div class="zak-overflow-auto zak-border zak-rounded-md zak-bg-surface" style="max-height:110px;padding:var(--zak-space-3)">${'<p style="margin:0 0 var(--zak-space-2)">Long line of body copy that overflows the fixed height of this box.</p>'.repeat(6)}</div>`, code: '<div class="zak-overflow-auto" style="max-height:110px">…</div>' },
      { title: 'Clip (hidden)', desc: 'Trim what does not fit.', tpl: `<div class="zak-overflow-hidden zak-border zak-rounded-md" style="width:100%"><div style="width:160%;height:48px;background:var(--zak-primary-subtle)"></div></div>`, code: '<div class="zak-overflow-hidden">…</div>' },
      { title: 'Horizontal (x-auto)', desc: 'Wide tables and code scroll sideways.', tpl: `<div class="zak-overflow-x-auto zak-border zak-rounded-md zak-bg-surface" style="padding:var(--zak-space-2)"><div style="width:520px;height:32px;display:grid;place-items:center;background:var(--zak-bg-sunken);border-radius:var(--zak-radius-sm)">Wide content — scrolls horizontally</div></div>`, code: '<div class="zak-overflow-x-auto">…</div>' },
    ],
  }),

  cursor: defineDemo({
    desc: 'Cursor affordances that reinforce how an element behaves — pointer for actions, grab for draggable surfaces, not-allowed for disabled regions.',
    tpl: '<div class="zak-flex zak-flex--wrap zak-gap-2"><span class="zak-badge zak-cursor-pointer">pointer</span><span class="zak-badge zak-cursor-grab">grab</span><span class="zak-badge zak-cursor-not-allowed">not-allowed</span></div>',
    playground: false,
    stage: 'start',
    codeTpl: `<!-- Cursor affordances -->
<div class="zak-cursor-pointer">Clickable</div>
<span class="zak-cursor-grab">Drag handle</span>
<div class="zak-cursor-not-allowed">Disabled</div>`,
    props: [
      ['zak-cursor-pointer', 'class', '—', 'Links and clickable actions.'],
      ['zak-cursor-grab / grabbing', 'class', '—', 'Draggable handles.'],
      ['zak-cursor-not-allowed', 'class', '—', 'Disabled or blocked interaction.'],
      ['zak-cursor-text / move', 'class', '—', 'Editable and repositionable regions.'],
    ],
    examples: [
      { title: 'Pointer', desc: 'Mark a custom clickable.', tpl: `<div class="zak-cursor-pointer zak-border zak-rounded-md zak-bg-surface" style="padding:var(--zak-space-3)">Hover me — zak-cursor-pointer</div>`, code: '<div class="zak-cursor-pointer">Clickable</div>' },
      { title: 'Grab', desc: 'Drag handles signal grab / grabbing.', tpl: `<div class="zak-d-flex zak-gap-2"><span class="zak-badge zak-cursor-grab zak-rounded-md">grab</span><span class="zak-badge zak-cursor-grabbing zak-rounded-md">grabbing</span></div>`, code: '<span class="zak-cursor-grab">grab</span>\n<span class="zak-cursor-grabbing">grabbing</span>' },
      { title: 'Not allowed', desc: 'Disabled regions refuse the pointer.', tpl: `<div class="zak-cursor-not-allowed zak-border zak-rounded-md zak-bg-sunken" style="padding:var(--zak-space-3)">Disabled — zak-cursor-not-allowed</div>`, code: '<div class="zak-cursor-not-allowed">Disabled</div>' },
    ],
  }),
};
