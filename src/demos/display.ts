/**
 * Demos — Data Display: card, badge, chip, avatar, list, timeline, tree,
 * description list, stat, rating, activity feed.
 */
import { defineDemo, type DemoDef } from './types';
import { svgIcon } from '../data/icons';

const starI = svgIcon('star', 'zak-icon', 16);
const folderI = svgIcon('folder', 'zak-icon', 15);
const fileI = svgIcon('file', 'zak-icon', 15);
const chevDown = svgIcon('chevron-down', 'zak-icon', 13);
const upI = svgIcon('arrow-up', 'zak-icon', 12);
const downI = svgIcon('arrow-down', 'zak-icon', 12);
const cpuI = svgIcon('cpu', 'zak-icon', 14);

const stars = (n: number, total = 5) =>
  Array.from({ length: total }, (_, i) => `<span class="zak-rating__star${i < n ? ' is-on' : ''}">${starI}</span>`).join('');

export const displayDemos: Record<string, DemoDef> = {
  card: defineDemo({
    desc: 'The workhorse container: media, header, body and footer slots. Three surfaces are shown — a standard card, a glass card over a gradient, and a media card with hover lift.',
    stage: 'stretch',
    tpl: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr));gap:var(--zak-space-4);width:100%;max-width:52rem">
    <div class="zak-card">
      <div class="zak-card__header">
        <div>
          <div class="zak-card__title">Deployment #4821</div>
          <div class="zak-card__subtitle">Production · eu-central-1</div>
        </div>
        <span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Healthy</span>
      </div>
      <div class="zak-card__body">
        Rolled out to 12 of 12 nodes. Zero failed health checks and p95 latency improved by 8%.
      </div>
      <div class="zak-card__footer">
        <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Logs</button>
        <button class="zak-btn zak-btn--outline zak-btn--sm" type="button">Rollback</button>
        <span style="margin-inline-start:auto;font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">4m ago</span>
      </div>
    </div>
    <div class="zak-card zak-card--hover">
      <div class="zak-card__media" style="height:8rem;position:relative">
        <div class="zak-img-ph" style="position:absolute;inset:0">
          ${svgIcon('image', 'zak-icon', 28)}
        </div>
      </div>
      <div class="zak-card__body">
        <div class="zak-card__title">Introducing streaming grids</div>
        <div class="zak-card__subtitle" style="margin-block-start:var(--zak-space-1)">Product update · 6 min read</div>
      </div>
    </div>
  </div>
  <div style="margin-block-start:var(--zak-space-5);padding:var(--zak-space-5);border-radius:var(--zak-radius-lg);background:linear-gradient(120deg,var(--zak-primary-600),#7c3aed 60%,var(--zak-secondary-600));max-width:24rem">
    <div class="zak-card zak-card--glass">
      <div class="zak-card__body">
        <div class="zak-card__title">Glassmorphic surface</div>
        <div class="zak-card__subtitle" style="margin-block-start:var(--zak-space-1)">Backdrop-blurred and border-lit for hero contexts.</div>
      </div>
    </div>
  </div>`,
    codeTpl: `<!-- Media: .zak-card__media -->
<div class="zak-card">
  <div class="zak-card__media">…</div>
  <div class="zak-card__body">Deployment #4821</div>
</div>

<!-- Hover lift: .zak-card--hover -->
<div class="zak-card zak-card--hover">…</div>

<!-- Glass surface: .zak-card--glass -->
<div class="zak-card zak-card--glass">…</div>

<!-- Brand tint: .zak-card--primary -->
<div class="zak-card zak-card--primary">…</div>

<!-- Action row: .zak-card__footer -->
<div class="zak-card__footer">
  <button class="zak-btn zak-btn--outline zak-btn--sm" type="button">Rollback</button>
</div>`,
    props: [
      ['.zak-card__media', 'element', '—', 'Bleed-to-edge media slot; images clip to the card radius.'],
      ['.zak-card--hover', 'modifier', '—', 'Lifts on hover with a stronger shadow.'],
      ['.zak-card--glass', 'modifier', '—', 'Translucent surface using the glass tokens.'],
      ['.zak-card--primary', 'modifier', '—', 'Brand-tinted surface for featured content.'],
      ['.zak-card__footer', 'element', '—', 'Action row separated by a hairline.'],
    ],
    notes: ['Cards are intentionally slot-free: compose header/body/footer, or use only the ones you need.'],
  }),
  badge: defineDemo({
    desc: 'Compact status labels in four tones plus solid and counter variants. The leading dot adds a redundant shape cue so status is not color-only.',
    tpl: `<div class="zak-flex zak-flex--wrap" style="gap:var(--zak-space-3);justify-content:center">
    <span class="zak-badge">Draft</span>
    <span class="zak-badge zak-badge--primary">Beta</span>
    <span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Active</span>
    <span class="zak-badge zak-badge--warning"><span class="zak-badge__dot"></span>Degraded</span>
    <span class="zak-badge zak-badge--danger"><span class="zak-badge__dot"></span>Down</span>
    <span class="zak-badge zak-badge--info"><span class="zak-badge__dot"></span>Syncing</span>
  </div>
  <div class="zak-flex zak-flex--wrap" style="gap:var(--zak-space-3);justify-content:center;margin-block-start:var(--zak-space-4)">
    <span class="zak-badge zak-badge--solid">Solid</span>
    <span class="zak-badge zak-badge--counter">12</span>
    <span class="zak-badge zak-badge--success zak-badge--counter">3</span>
    <span class="zak-badge zak-badge--danger zak-badge--counter">99+</span>
  </div>`,
    codeTpl: `<!-- Base: neutral outline badge -->
<span class="zak-badge">Draft</span>

<!-- Tones: --primary / --success / --warning / --danger / --info -->
<span class="zak-badge zak-badge--primary">Beta</span>
<span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Active</span>
<span class="zak-badge zak-badge--warning"><span class="zak-badge__dot"></span>Degraded</span>
<span class="zak-badge zak-badge--danger"><span class="zak-badge__dot"></span>Down</span>
<span class="zak-badge zak-badge--info"><span class="zak-badge__dot"></span>Syncing</span>

<!-- High-contrast solid: --solid -->
<span class="zak-badge zak-badge--solid">Solid</span>

<!-- Count token: --counter -->
<span class="zak-badge zak-badge--counter">12</span>
<span class="zak-badge zak-badge--danger zak-badge--counter">99+</span>`,
    examples: [
      {
        title: 'Neutral',
        desc: 'Outline-only badge for metadata that should not carry status semantics.',
        tpl: `<span class="zak-badge">Draft</span>`,
        code: `<span class="zak-badge">Draft</span>`,
      },
      {
        title: 'Brand',
        desc: 'Product-flow states — beta, new, current — take the brand ramp.',
        tpl: `<span class="zak-badge zak-badge--primary">Beta</span>`,
        code: `<span class="zak-badge zak-badge--primary">Beta</span>`,
      },
      {
        title: 'Success',
        desc: 'The leading dot is a redundant shape cue so status survives grayscale.',
        tpl: `<span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Active</span>`,
        code: `<span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Active</span>`,
      },
      {
        title: 'Warning',
        desc: 'Attention without failure — degraded, expiring, pending review.',
        tpl: `<span class="zak-badge zak-badge--warning"><span class="zak-badge__dot"></span>Degraded</span>`,
        code: `<span class="zak-badge zak-badge--warning"><span class="zak-badge__dot"></span>Degraded</span>`,
      },
      {
        title: 'Danger',
        desc: 'Failed, down or over quota.',
        tpl: `<span class="zak-badge zak-badge--danger"><span class="zak-badge__dot"></span>Down</span>`,
        code: `<span class="zak-badge zak-badge--danger"><span class="zak-badge__dot"></span>Down</span>`,
      },
      {
        title: 'Info',
        desc: 'Transient or informational state that is neither good nor bad.',
        tpl: `<span class="zak-badge zak-badge--info"><span class="zak-badge__dot"></span>Syncing</span>`,
        code: `<span class="zak-badge zak-badge--info"><span class="zak-badge__dot"></span>Syncing</span>`,
      },
      {
        title: 'Solid',
        desc: 'High-contrast fill for badges that must read against a busy surface.',
        tpl: `<span class="zak-badge zak-badge--solid">Solid</span>`,
        code: `<span class="zak-badge zak-badge--solid">Solid</span>`,
      },
      {
        title: 'Counter',
        desc: 'Circular count with tabular numerals; tone modifiers compose.',
        tpl: `<div class="zak-flex zak-flex--wrap" style="gap:var(--zak-space-3)">
  <span class="zak-badge zak-badge--counter">12</span>
  <span class="zak-badge zak-badge--success zak-badge--counter">3</span>
  <span class="zak-badge zak-badge--danger zak-badge--counter">99+</span>
</div>`,
        code: `<span class="zak-badge zak-badge--counter">12</span>
<span class="zak-badge zak-badge--success zak-badge--counter">3</span>
<span class="zak-badge zak-badge--danger zak-badge--counter">99+</span>`,
      },
    ],
    props: [
      ['(base)', 'class', '—', 'Neutral outline badge for the lowest emphasis.'],
      ['--primary / --success / --warning / --danger / --info', 'modifier', '—', 'Semantic tone; pairs with a matching dot.'],
      ['--solid', 'modifier', '—', 'High-contrast solid fill.'],
      ['--counter', 'modifier', '—', 'Compact circular count with tabular numerals.'],
    ],
    notes: ['Never rely on color alone — keep the dot or add an icon so status survives grayscale and color-blind rendering.'],
  }),
  chip: defineDemo({
    desc: 'Compact tokens for filters, tags and selections. Chips come in static, interactive (selectable) and removable flavors — removal is delegated so the chip itself stays a simple token.',
    tpl: `<div class="zak-stack zak-stack--md" style="align-items:center">
    <div class="zak-flex zak-flex--wrap" style="gap:var(--zak-space-2);justify-content:center">
      <span class="zak-chip">Production</span>
      <span class="zak-chip">eu-central-1</span>
      <span class="zak-chip">v2.4.1</span>
    </div>
    <div class="zak-flex zak-flex--wrap" style="gap:var(--zak-space-2);justify-content:center">
      <span class="zak-chip zak-chip--primary">${svgIcon('sparkles', 'zak-icon', 12)} Brand</span>
      <span class="zak-chip zak-chip--success">${svgIcon('check', 'zak-icon', 12)} Success</span>
      <span class="zak-chip zak-chip--warning">${svgIcon('alert-triangle', 'zak-icon', 12)} Warning</span>
      <span class="zak-chip zak-chip--danger">${svgIcon('alert-circle', 'zak-icon', 12)} Danger</span>
      <span class="zak-chip zak-chip--info">${svgIcon('info', 'zak-icon', 12)} Info</span>
      <span class="zak-chip zak-chip--neutral">Neutral</span>
    </div>
    <div class="zak-flex zak-flex--wrap" style="gap:var(--zak-space-2);justify-content:center">
      <span class="zak-chip zak-chip--primary zak-chip--outline">Brand</span>
      <span class="zak-chip zak-chip--success zak-chip--outline">Success</span>
      <span class="zak-chip zak-chip--warning zak-chip--outline">Warning</span>
      <span class="zak-chip zak-chip--danger zak-chip--outline">Danger</span>
      <span class="zak-chip zak-chip--info zak-chip--outline">Info</span>
    </div>
    <div class="zak-flex zak-flex--wrap" style="gap:var(--zak-space-2);justify-content:center">
      <button class="zak-chip zak-chip--interactive is-active" type="button" aria-pressed="true">Errors</button>
      <button class="zak-chip zak-chip--interactive" type="button" aria-pressed="false">Warnings</button>
      <button class="zak-chip zak-chip--interactive" type="button" aria-pressed="false">Info</button>
    </div>
    <div class="zak-flex zak-flex--wrap" style="gap:var(--zak-space-2);justify-content:center">
      <span class="zak-chip" data-zak-chip>design-system <button class="zak-chip__x" type="button" aria-label="Remove design-system">${svgIcon('x', 'zak-icon', 11)}</button></span>
      <span class="zak-chip" data-zak-chip>a11y <button class="zak-chip__x" type="button" aria-label="Remove a11y">${svgIcon('x', 'zak-icon', 11)}</button></span>
      <span class="zak-chip" data-zak-chip>release-2.4 <button class="zak-chip__x" type="button" aria-label="Remove release-2.4">${svgIcon('x', 'zak-icon', 11)}</button></span>
    </div>
  </div>`,
    codeTpl: `<!-- Tones: one modifier per semantic colour, theme-aware through the tokens -->
<span class="zak-chip zak-chip--primary">Brand</span>
<span class="zak-chip zak-chip--success">Success</span>
<span class="zak-chip zak-chip--warning">Warning</span>
<span class="zak-chip zak-chip--danger">Danger</span>
<span class="zak-chip zak-chip--info">Info</span>
<span class="zak-chip zak-chip--neutral">Neutral</span>

<!-- Outline shape: transparent surface, tone kept in text and border -->
<span class="zak-chip zak-chip--danger zak-chip--outline">Danger</span>

<!-- Interactive chip: .zak-chip--interactive -->
<button class="zak-chip zak-chip--interactive" type="button" aria-pressed="false">Warnings</button>

<!-- Selected: is-active -->
<button class="zak-chip zak-chip--interactive is-active" type="button" aria-pressed="true">Errors</button>

<!-- Removable: .zak-chip__x must name its chip -->
<span class="zak-chip zak-chip--info">design-system
  <button class="zak-chip__x" type="button" aria-label="Remove design-system">✕</button>
</span>`,
    examples: [
      {
        title: 'Static',
        desc: 'Non-interactive token for read-only metadata.',
        tpl: `<div class="zak-flex zak-flex--wrap" style="gap:var(--zak-space-2)">
  <span class="zak-chip">Production</span>
  <span class="zak-chip">eu-central-1</span>
  <span class="zak-chip">v2.4.1</span>
</div>`,
        code: `<span class="zak-chip">Production</span>
<span class="zak-chip">eu-central-1</span>
<span class="zak-chip">v2.4.1</span>`,
      },
      {
        title: 'Brand',
        desc: 'Brand-subtle surface with brand text and border tokens.',
        tpl: `<span class="zak-chip zak-chip--primary">${svgIcon('sparkles', 'zak-icon', 12)} Brand</span>`,
        code: `<span class="zak-chip zak-chip--primary">Brand</span>`,
      },
      {
        title: 'Success',
        desc: 'Healthy or accepted values.',
        tpl: `<span class="zak-chip zak-chip--success">${svgIcon('check', 'zak-icon', 12)} Passing</span>`,
        code: `<span class="zak-chip zak-chip--success">Passing</span>`,
      },
      {
        title: 'Warning',
        desc: 'Attention without failure.',
        tpl: `<span class="zak-chip zak-chip--warning">${svgIcon('alert-triangle', 'zak-icon', 12)} Flaky</span>`,
        code: `<span class="zak-chip zak-chip--warning">Flaky</span>`,
      },
      {
        title: 'Danger',
        desc: 'Errors and destructive context.',
        tpl: `<span class="zak-chip zak-chip--danger">${svgIcon('alert-circle', 'zak-icon', 12)} Failed</span>`,
        code: `<span class="zak-chip zak-chip--danger">Failed</span>`,
      },
      {
        title: 'Info',
        desc: 'Neutral metadata on the blue tone.',
        tpl: `<span class="zak-chip zak-chip--info">Queued</span>`,
        code: `<span class="zak-chip zak-chip--info">Queued</span>`,
      },
      {
        title: 'Neutral',
        desc: 'Muted tone — the default when a token must not imply status.',
        tpl: `<span class="zak-chip zak-chip--neutral">Unassigned</span>`,
        code: `<span class="zak-chip zak-chip--neutral">Unassigned</span>`,
      },
      {
        title: 'Outline',
        desc: 'Shape modifier: transparent fill, the tone stays in text and border.',
        tpl: `<div class="zak-flex zak-flex--wrap" style="gap:var(--zak-space-2)">
  <span class="zak-chip zak-chip--primary zak-chip--outline">Brand</span>
  <span class="zak-chip zak-chip--success zak-chip--outline">Success</span>
  <span class="zak-chip zak-chip--warning zak-chip--outline">Warning</span>
  <span class="zak-chip zak-chip--danger zak-chip--outline">Danger</span>
  <span class="zak-chip zak-chip--info zak-chip--outline">Info</span>
</div>`,
        code: `<span class="zak-chip zak-chip--primary zak-chip--outline">Brand</span>
<span class="zak-chip zak-chip--success zak-chip--outline">Success</span>
<span class="zak-chip zak-chip--warning zak-chip--outline">Warning</span>
<span class="zak-chip zak-chip--danger zak-chip--outline">Danger</span>
<span class="zak-chip zak-chip--info zak-chip--outline">Info</span>`,
      },
      {
        title: 'Selectable',
        desc: '`<button>` chips toggle `aria-pressed`; `is-active` mirrors it visually.',
        tpl: `<div class="zak-flex zak-flex--wrap" style="gap:var(--zak-space-2)">
  <button class="zak-chip zak-chip--interactive is-active" type="button" aria-pressed="true">Errors</button>
  <button class="zak-chip zak-chip--interactive" type="button" aria-pressed="false">Warnings</button>
  <button class="zak-chip zak-chip--interactive" type="button" aria-pressed="false">Info</button>
</div>`,
        code: `<!-- Off -->
<button class="zak-chip zak-chip--interactive" type="button" aria-pressed="false">Warnings</button>

<!-- Selected -->
<button class="zak-chip zak-chip--interactive is-active" type="button" aria-pressed="true">Errors</button>`,
      },
      {
        title: 'Removable',
        desc: '`data-zak-chip` marks the removable token; the ✕ button names what it removes.',
        tpl: `<div class="zak-flex zak-flex--wrap" style="gap:var(--zak-space-2)">
  <span class="zak-chip" data-zak-chip>design-system <button class="zak-chip__x" type="button" aria-label="Remove design-system">${svgIcon('x', 'zak-icon', 11)}</button></span>
  <span class="zak-chip" data-zak-chip>a11y <button class="zak-chip__x" type="button" aria-label="Remove a11y">${svgIcon('x', 'zak-icon', 11)}</button></span>
</div>`,
        code: `<span class="zak-chip" data-zak-chip>design-system
  <button class="zak-chip__x" type="button" aria-label="Remove design-system">✕</button>
</span>`,
      },
    ],
    js: `// Removal is delegated from the list container
list.addEventListener('click', (event) => {
  const x = event.target.closest('.zak-chip__x');
  if (!x) return;
  const chip = x.closest('[data-zak-chip]');
  chip.remove();
  announce(\`Removed \${chip.textContent.trim()}\`);
});`,
    props: [
      ['.zak-chip--primary', 'modifier', '—', 'Brand-subtle surface with brand text and border tokens.'],
      ['.zak-chip--success', 'modifier', '—', 'Green tone for healthy or accepted values.'],
      ['.zak-chip--warning', 'modifier', '—', 'Amber tone for attention without failure.'],
      ['.zak-chip--danger', 'modifier', '—', 'Red tone for errors and destructive context.'],
      ['.zak-chip--info', 'modifier', '—', 'Blue tone for neutral metadata.'],
      ['.zak-chip--neutral', 'modifier', '—', 'Muted tone; borderless active surface.'],
      ['.zak-chip--outline', 'modifier', '—', 'Shape modifier: transparent fill, tone kept in text + border.'],
      ['.zak-chip--interactive', 'class', '—', 'Button chip; reflects selection via aria-pressed.'],
      ['.zak-chip__x', 'element', '—', 'Removal affordance; keep a descriptive aria-label.'],
      ['is-active', 'class', '—', 'Brand-subtle selected state on interactive chips.'],
    ],
    a11y: {
      keys: [
        ['Enter / Space', 'Toggles an interactive chip or activates its remove button.'],
        ['Backspace', 'Conventional removal key when a chip list has focus.'],
      ],
      aria: [
        ['aria-pressed', 'Marks the on/off state of interactive chips.'],
        ['aria-label', 'The remove button must name its chip.'],
      ],
    },
  }),
  avatar: defineDemo({
    desc: 'Identity at a glance: gradient initials, five sizes, square variant and an availability ring. Images render edge-to-edge with object-fit cover.',
    tpl: `<div class="zak-flex zak-flex--wrap" style="gap:var(--zak-space-5);align-items:flex-end;justify-content:center">
    <div class="zak-stack zak-stack--sm" style="align-items:center"><span class="zak-avatar zak-avatar--xs">AP</span><span class="zak-hint">xs</span></div>
    <div class="zak-stack zak-stack--sm" style="align-items:center"><span class="zak-avatar zak-avatar--sm">MW</span><span class="zak-hint">sm</span></div>
    <div class="zak-stack zak-stack--sm" style="align-items:center"><span class="zak-avatar">PR</span><span class="zak-hint">md</span></div>
    <div class="zak-stack zak-stack--sm" style="align-items:center"><span class="zak-avatar zak-avatar--lg">TO</span><span class="zak-hint">lg</span></div>
    <div class="zak-stack zak-stack--sm" style="align-items:center"><span class="zak-avatar zak-avatar--xl">SM</span><span class="zak-hint">xl</span></div>
    <div class="zak-stack zak-stack--sm" style="align-items:center"><span class="zak-avatar zak-avatar--square">MC</span><span class="zak-hint">square</span></div>
    <div class="zak-stack zak-stack--sm" style="align-items:center"><span class="zak-avatar zak-avatar--status">JL</span><span class="zak-hint">status</span></div>
  </div>`,
    codeTpl: `<!-- Sizes: --xs / --sm / --lg / --xl (md is the default) -->
<span class="zak-avatar zak-avatar--xs">AP</span>
<span class="zak-avatar">PR</span>
<span class="zak-avatar zak-avatar--lg">TO</span>
<span class="zak-avatar zak-avatar--xl">SM</span>

<!-- Square: --square -->
<span class="zak-avatar zak-avatar--square">MC</span>

<!-- Availability ring: --status -->
<span class="zak-avatar zak-avatar--status">JL</span>

<!-- Image child; use alt="" when the name is adjacent -->
<span class="zak-avatar"><img src="alina.jpg" alt=""/></span>`,
    props: [
      ['--xs / --sm / --lg / --xl', 'modifier', '2.5rem', 'Preset sizes from 1.5rem to 4.5rem.'],
      ['--square', 'modifier', '—', 'Rounded-square for logos and services.'],
      ['--status', 'modifier', '—', 'Availability ring pinned to the lower-right.'],
      ['<img>', 'element', '—', 'Child image fills the avatar; use alt="" when the name is adjacent.'],
    ],
    notes: ['Initials fallbacks should be exactly two glyphs and uppercase — the gradient guarantees contrast in both themes.'],
  }),
  'avatar-group': defineDemo({
    desc: 'Overlapping stacks that summarize participation. Hover raises a face; the overflow token counts the remainder.',
    tpl: `<div class="zak-stack zak-stack--md" style="align-items:center">
    <div class="zak-avatar-group">
      <span class="zak-avatar zak-avatar--sm">AP</span>
      <span class="zak-avatar zak-avatar--sm">MW</span>
      <span class="zak-avatar zak-avatar--sm">PR</span>
      <span class="zak-avatar zak-avatar--sm">TO</span>
      <span class="zak-avatar zak-avatar--sm zak-avatar-group__more">+7</span>
    </div>
    <div class="zak-avatar-group">
      <span class="zak-avatar">SM</span>
      <span class="zak-avatar">JL</span>
      <span class="zak-avatar zak-avatar-group__more">+18</span>
    </div>
  </div>`,
    codeTpl: `<!-- Overlap wrapper: .zak-avatar-group -->
<div class="zak-avatar-group">
  <span class="zak-avatar zak-avatar--sm">AP</span>
  <span class="zak-avatar zak-avatar--sm">MW</span>

  <!-- Overflow counter: .zak-avatar-group__more -->
  <span class="zak-avatar zak-avatar--sm zak-avatar-group__more">+7</span>
</div>

<!-- Hover: a raised z-index pops the focused avatar above the stack -->`,
    props: [
      ['.zak-avatar-group', 'class', '—', 'Overlap wrapper; −0.65rem inline offset per child.'],
      ['.zak-avatar-group__more', 'element', '—', 'Neutral overflow counter with inset shadow.'],
      ['z-index on hover', 'css', '2', 'Hovered avatar pops above the stack.'],
    ],
  }),
  list: defineDemo({
    desc: 'Bare vertical lists for lightweight content: an icon or avatar anchors each row, and a right-aligned meta slot carries timestamps or counts.',
    tpl: `<ul class="zak-list" style="width:100%;max-width:26rem">
    <li class="zak-list__item">${cpuI}<span>api-gateway</span><small>3 replicas</small></li>
    <li class="zak-list__item">${cpuI}<span>worker-pool</span><small>12 replicas</small></li>
    <li class="zak-list__item">${cpuI}<span>scheduler</span><small>1 replica</small></li>
    <li class="zak-list__item">${svgIcon('database', 'zak-icon', 14)}<span>postgres-primary</span><small>1 primary</small></li>
  </ul>`,
    codeTpl: `<!-- List: .zak-list -->
<ul class="zak-list">
  <li class="zak-list__item">
    <svg class="zak-icon" aria-hidden="true"></svg>
    <span>api-gateway</span>

    <!-- Trailing meta: .zak-list__item small -->
    <small>3 replicas</small>
  </li>
  <li class="zak-list__item">
    <svg class="zak-icon" aria-hidden="true"></svg>
    <span>worker-pool</span>
    <small>12 replicas</small>
  </li>
</ul>`,
    props: [
      ['.zak-list', 'class', '—', 'Flex column of items with 4px rhythm.'],
      ['.zak-list__item small', 'element', '—', 'Auto-pushed to the trailing edge in tertiary text.'],
    ],
  }),
  'list-group': defineDemo({
    desc: 'Bordered list with section headers and full-row hover — the workhorse for settings menus, inboxes and pickers.',
    tpl: `<ul class="zak-list-group" style="width:100%;max-width:26rem">
    <li class="zak-list-group__header">Today</li>
    <li>
      <span class="zak-avatar zak-avatar--sm">AP</span>
      <span style="flex:1">Alina Popescu</span>
      <span class="zak-badge zak-badge--counter">2</span>
    </li>
    <li>
      <span class="zak-avatar zak-avatar--sm">MW</span>
      <span style="flex:1">Marcus Webb</span>
      <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">09:14</span>
    </li>
    <li class="zak-list-group__header">Yesterday</li>
    <li>
      <span class="zak-avatar zak-avatar--sm">PR</span>
      <span style="flex:1">Priya Raman</span>
      <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">17:42</span>
    </li>
  </ul>`,
    codeTpl: `<!-- List group: .zak-list-group -->
<ul class="zak-list-group">
  <!-- Section label: .zak-list-group__header -->
  <li class="zak-list-group__header">Today</li>

  <!-- Direct children become full-width rows -->
  <li>
    <span class="zak-avatar zak-avatar--sm">AP</span>
    <span style="flex:1">Alina Popescu</span>
    <span class="zak-badge zak-badge--counter">2</span>
  </li>
  <li>
    <span class="zak-avatar zak-avatar--sm">MW</span>
    <span style="flex:1">Marcus Webb</span>
    <span style="font-size:var(--zak-text-xs)">09:14</span>
  </li>
</ul>`,
    props: [
      ['.zak-list-group__header', 'element', '—', 'Uppercase section label on a muted strip.'],
      ['li', 'element', '—', 'Direct children become full-width rows; last row drops its hairline.'],
    ],
  }),
  timeline: defineDemo({
    desc: 'Chronological state tracking for releases, incidents and onboarding. Done steps fill success green, the active step pulses brand, future steps stay hollow.',
    tpl: `<ul class="zak-timeline" style="width:100%;max-width:26rem">
    <li class="zak-timeline__item zak-timeline__item--done">
      <span class="zak-timeline__dot" aria-hidden="true"></span>
      <div>
        <div class="zak-timeline__title">Build passed</div>
        <div class="zak-timeline__meta">09:41 · 412 tests · 3m 12s</div>
      </div>
    </li>
    <li class="zak-timeline__item zak-timeline__item--done">
      <span class="zak-timeline__dot" aria-hidden="true"></span>
      <div>
        <div class="zak-timeline__title">Staged to canary</div>
        <div class="zak-timeline__meta">09:58 · 2 of 12 nodes</div>
      </div>
    </li>
    <li class="zak-timeline__item zak-timeline__item--active">
      <span class="zak-timeline__dot" aria-hidden="true"></span>
      <div>
        <div class="zak-timeline__title">Rollout in progress</div>
        <div class="zak-timeline__meta">10:02 · 8 of 12 nodes upgraded</div>
        <div class="zak-timeline__body"><span class="zak-progress zak-progress--sm" style="max-width:14rem"><span class="zak-progress__bar" style="--value:67%"></span></span></div>
      </div>
    </li>
    <li class="zak-timeline__item">
      <span class="zak-timeline__dot" aria-hidden="true"></span>
      <div>
        <div class="zak-timeline__title">Post-deploy checks</div>
        <div class="zak-timeline__meta">Pending</div>
      </div>
    </li>
  </ul>`,
    codeTpl: `<!-- Completed step: --done -->
<li class="zak-timeline__item zak-timeline__item--done">
  <!-- Dot on the rail: .zak-timeline__dot -->
  <span class="zak-timeline__dot" aria-hidden="true"></span>
  <div>
    <div class="zak-timeline__title">Build passed</div>

    <!-- Tertiary timestamp: .zak-timeline__meta -->
    <div class="zak-timeline__meta">09:41 · 412 tests</div>
  </div>
</li>

<!-- Current step: --active -->
<li class="zak-timeline__item zak-timeline__item--active">
  <span class="zak-timeline__dot" aria-hidden="true"></span>
  <div class="zak-timeline__title">Rollout in progress</div>
</li>`,
    props: [
      ['--done', 'modifier', '—', 'Success-filled dot and connector.'],
      ['--active', 'modifier', '—', 'Brand dot with a 4px halo ring.'],
      ['.zak-timeline__dot', 'element', '—', '15px dot absolutely positioned on the rail.'],
      ['.zak-timeline__meta', 'element', '—', 'Tertiary timestamp line under the title.'],
    ],
    notes: ['The connector line is drawn per item via `::before`, so reordering items needs no rebuild of the rail.'],
  }),
  tree: defineDemo({
    desc: 'Hierarchical navigation rendered as nested lists. The caret rotates on expand; labels highlight when they are the current location.',
    tpl: `<ul class="zak-tree" style="width:100%;max-width:24rem" data-zak-tree role="tree" aria-label="Project files">
    <li role="treeitem" aria-expanded="true">
      <span class="zak-tree__label"><span class="zak-tree__caret" aria-hidden="true">${chevDown}</span>${folderI} src</span>
      <ul role="group">
        <li role="treeitem" aria-expanded="true">
          <span class="zak-tree__label"><span class="zak-tree__caret" aria-hidden="true">${chevDown}</span>${folderI} components</span>
          <ul role="group">
            <li role="treeitem"><span class="zak-tree__label is-active">${fileI} button.css</span></li>
            <li role="treeitem"><span class="zak-tree__label">${fileI} datagrid.css</span></li>
            <li role="treeitem"><span class="zak-tree__label">${fileI} tokens.css</span></li>
          </ul>
        </li>
        <li role="treeitem"><span class="zak-tree__label">${fileI} index.ts</span></li>
      </ul>
    </li>
    <li role="treeitem"><span class="zak-tree__label">${fileI} README.md</span></li>
    <li role="treeitem"><span class="zak-tree__label">${fileI} package.json</span></li>
  </ul>`,
    codeTpl: `<!-- Semantics: role="tree" / treeitem / group -->
<ul class="zak-tree" role="tree" aria-label="Project files">
  <li role="treeitem" aria-expanded="true">
    <span class="zak-tree__label">
      <!-- Caret: .zak-tree__caret rotates on aria-expanded -->
      <span class="zak-tree__caret" aria-hidden="true">▾</span> src
    </span>
    <ul role="group">
      <!-- Active file: .zak-tree__label.is-active -->
      <li role="treeitem"><span class="zak-tree__label is-active">button.css</span></li>
      <li role="treeitem"><span class="zak-tree__label">index.ts</span></li>
    </ul>
  </li>
</ul>`,
    props: [
      ['.zak-tree__caret', 'element', '—', 'Chevron rotates 90° when the parent has `aria-expanded="true"`.'],
      ['.zak-tree__label.is-active', 'element', '—', 'Brand-subtle current file.'],
      ['role="tree" / treeitem / group', 'attr', '—', 'Full ARIA tree semantics with aria-expanded on parents.'],
    ],
    a11y: {
      keys: [
        ['↑ / ↓', 'Moves between visible tree items.'],
        ['→', 'Expands the focused parent, or moves to its first child.'],
        ['←', 'Collapses the focused parent, or jumps to its parent.'],
        ['Enter', 'Activates the focused item.'],
      ],
      aria: [
        ['aria-expanded', 'Reflects open state of parent nodes.'],
        ['aria-label', 'Names the tree region.'],
      ],
    },
  }),
  'description-list': defineDemo({
    desc: 'Key–value pairs in a two-column grid, plus a cards variant for metadata panels where each pair deserves its own surface.',
    tpl: `<div class="zak-stack zak-stack--xl" style="width:100%;max-width:38rem">
    <dl class="zak-dl">
      <dt>Status</dt><dd><span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Active</span></dd>
      <dt>Plan</dt><dd>Enterprise · annual</dd>
      <dt>Seats used</dt><dd>84 of 120</dd>
      <dt>Region</dt><dd>eu-central-1 (Frankfurt)</dd>
    </dl>
    <dl class="zak-dl zak-dl--cards">
      <div><dt>Build</dt><dd><span style="display:block;font-weight:var(--zak-weight-semibold)">#4821</span><span class="zak-hint">2m 48s</span></dd></div>
      <div><dt>Coverage</dt><dd><span style="display:block;font-weight:var(--zak-weight-semibold)">94.2%</span><span class="zak-hint">+1.8% w/w</span></dd></div>
      <div><dt>Bundle</dt><dd><span style="display:block;font-weight:var(--zak-weight-semibold)">128 kB</span><span class="zak-hint">gz · tree-shaken</span></dd></div>
    </dl>
  </div>`,
    codeTpl: `<!-- Definition grid: .zak-dl -->
<dl class="zak-dl">
  <!-- Term / description pair: dt / dd -->
  <dt>Status</dt>
  <dd><span class="zak-badge zak-badge--success">Active</span></dd>
  <dt>Region</dt>
  <dd>eu-central-1 (Frankfurt)</dd>
</dl>

<!-- Auto-fit cards: .zak-dl--cards -->
<dl class="zak-dl zak-dl--cards">
  <div><dt>Build</dt><dd>#4821</dd></div>
  <div><dt>Coverage</dt><dd>94.2%</dd></div>
</dl>`,
    props: [
      ['.zak-dl', 'class', '—', 'Label column (min 120px) + value column grid.'],
      ['.zak-dl--cards', 'modifier', '—', 'Auto-fit cards, 180px minimum track.'],
      ['dt / dd', 'element', '—', 'Native semantics preserve the term→description association.'],
    ],
  }),
  stat: defineDemo({
    desc: 'Headline metrics with label, tabular value and a signed delta. The delta color encodes direction; the arrow icon repeats it for non-color users.',
    tpl: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:var(--zak-space-6);width:100%;max-width:44rem">
    <div class="zak-stat">
      <span class="zak-stat__label">Monthly revenue</span>
      <span class="zak-stat__value">$84.2k</span>
      <span class="zak-stat__delta zak-stat__delta--up">${upI} 12.4% vs last month</span>
    </div>
    <div class="zak-stat">
      <span class="zak-stat__label">Active users</span>
      <span class="zak-stat__value">12,480</span>
      <span class="zak-stat__delta zak-stat__delta--up">${upI} 3.1% vs last month</span>
    </div>
    <div class="zak-stat">
      <span class="zak-stat__label">Churn</span>
      <span class="zak-stat__value">1.8%</span>
      <span class="zak-stat__delta zak-stat__delta--down">${downI} 0.4 pp vs last month</span>
    </div>
  </div>`,
    codeTpl: `<div class="zak-stat">
  <span class="zak-stat__label">Monthly revenue</span>

  <!-- Headline value: .zak-stat__value -->
  <span class="zak-stat__value">$84.2k</span>

  <!-- Positive delta: .zak-stat__delta--up -->
  <span class="zak-stat__delta zak-stat__delta--up">▲ 12.4% vs last month</span>
</div>

<div class="zak-stat">
  <span class="zak-stat__label">Churn</span>
  <span class="zak-stat__value">1.8%</span>

  <!-- Negative delta: .zak-stat__delta--down -->
  <span class="zak-stat__delta zak-stat__delta--down">▼ 0.4 pp vs last month</span>
</div>`,
    props: [
      ['.zak-stat__value', 'element', '—', '3xl bold with tabular numerals — digits never jitter.'],
      ['.zak-stat__delta--up / --down', 'modifier', '—', 'Success / danger text color with arrow accompaniment.'],
    ],
  }),
  rating: defineDemo({
    desc: 'Star rating for input and read-only display in three sizes. Interactive instances toggle `is-on` per star; the numeric value stays in sync via `aria-label`.',
    tpl: `<div class="zak-stack zak-stack--lg" style="align-items:center">
    <div class="zak-rating zak-rating--sm" role="img" aria-label="Rated 3 out of 5">${stars(3)}<span class="zak-rating__value">3.0</span></div>
    <div class="zak-rating" data-zak-rating role="radiogroup" aria-label="Rate this release">${stars(4)}<span class="zak-rating__value" data-rating-value>4.0</span></div>
    <div class="zak-rating zak-rating--lg" role="img" aria-label="Rated 4.5 out of 5">${stars(4)}${svgIcon('star', 'zak-icon', 17)}<span class="zak-rating__value">4.5 · 128 reviews</span></div>
  </div>`,
    codeTpl: `<!-- Sizes: --sm / --lg (md is the default) -->
<div class="zak-rating zak-rating--sm" role="img" aria-label="Rated 3 out of 5">
  <!-- Awarded star: .zak-rating__star.is-on -->
  <span class="zak-rating__star is-on">★</span>
  <span class="zak-rating__star is-on">★</span>
  <span class="zak-rating__star is-on">★</span>
  <span class="zak-rating__star">★</span>
</div>

<!-- Numeric companion: .zak-rating__value -->
<span class="zak-rating__value">4.0</span>`,
    js: `rating.addEventListener('click', (event) => {
  const star = event.target.closest('.zak-rating__star');
  if (!star) return;
  const index = [...rating.children].indexOf(star);
  [...rating.querySelectorAll('.zak-rating__star')].forEach((s, i) =>
    s.classList.toggle('is-on', i <= index)
  );
  rating.setAttribute('aria-label', \`Rated \${index + 1} out of 5\`);
});`,
    props: [
      ['.zak-rating__star.is-on', 'class', '—', 'Amber 500 fill for awarded stars.'],
      ['--sm / --lg', 'modifier', 'md', 'Icon sizes 0.95rem / 1.15rem / 1.7rem.'],
      ['.zak-rating__value', 'element', '—', 'Numeric companion — never rely on stars alone.'],
    ],
    a11y: {
      keys: [
        ['← / →', 'Moves between stars in an interactive rating.'],
        ['Enter / Space', 'Commits the focused star value.'],
      ],
      aria: [
        ['role="radiogroup"', 'Input mode: each star is a radio.'],
        ['role="img" + aria-label', 'Display mode: "Rated 4.5 out of 5".'],
      ],
    },
  }),
  'activity-feed': defineDemo({
    desc: 'A stream of recent events with actor, action and relative time. Rows separate with hairlines; actors use the standard avatar so feeds read consistently.',
    tpl: `<ul class="zak-feed" style="width:100%;max-width:30rem">
    <li class="zak-feed__item">
      <span class="zak-avatar zak-avatar--sm">MW</span>
      <span class="zak-feed__body"><strong>Marcus Webb</strong> approved deployment <strong>#4821</strong> to production.</span>
      <span class="zak-feed__time">4m ago</span>
    </li>
    <li class="zak-feed__item">
      <span class="zak-avatar zak-avatar--sm">PR</span>
      <span class="zak-feed__body"><strong>Priya Raman</strong> published <em>“Streaming grids”</em> in the Design channel.</span>
      <span class="zak-feed__time">22m ago</span>
    </li>
    <li class="zak-feed__item">
      <span class="zak-avatar zak-avatar--sm">JL</span>
      <span class="zak-feed__body"><strong>Jonas Lindqvist</strong> scaled <strong>worker-pool</strong> from 6 to 12 replicas.</span>
      <span class="zak-feed__time">1h ago</span>
    </li>
    <li class="zak-feed__item">
      <span class="zak-avatar zak-avatar--sm">TO</span>
      <span class="zak-feed__body"><strong>Tom Okafor</strong> backfilled <strong>events_daily</strong> for June.</span>
      <span class="zak-feed__time">3h ago</span>
    </li>
  </ul>`,
    codeTpl: `<!-- Feed list: .zak-feed -->
<ul class="zak-feed">
  <li class="zak-feed__item">
    <span class="zak-avatar zak-avatar--sm">MW</span>

    <!-- Body column: .zak-feed__body — <strong> marks actor and object -->
    <span class="zak-feed__body"><strong>Marcus Webb</strong> approved deployment <strong>#4821</strong>.</span>

    <!-- Timestamp: .zak-feed__time -->
    <span class="zak-feed__time">4m ago</span>
  </li>
</ul>`,
    props: [
      ['.zak-feed__body', 'element', '—', 'Growing middle column; wraps under fixed avatar.'],
      ['.zak-feed__time', 'element', '—', 'Non-wrapping tertiary timestamp.'],
      ['<strong> in body', 'element', '—', 'Actors and objects; keeps rows scannable.'],
    ],
  }),
};
