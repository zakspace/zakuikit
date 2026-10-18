/**
 * Demos — Buttons (button, icon button, group, toolbar, loading, FAB).
 */
import { defineDemo, type DemoDef } from './types';
import { svgIcon } from '../data/icons';

export const buttonDemos: Record<string, DemoDef> = {
  button: defineDemo({
    desc: 'The core action element. Five variants — filled, outlined, text, soft and link — express hierarchy, five sizes fit every density, and loading/disabled states are first-class.',
    tpl: `<div class="zak-stack  zak-stack--row zak-stack--lg" style="flex-wrap:wrap;gap:var(--zak-space-3);align-items:center">
  <button class="zak-btn zak-btn--filled" type="button">Filled</button>
  <button class="zak-btn zak-btn--outlined" type="button">Outlined</button>
  <button class="zak-btn zak-btn--text" type="button">Text</button>
  <button class="zak-btn zak-btn--soft" type="button">Soft</button>
  <button class="zak-btn zak-btn--link" type="button">Link</button>
</div>`,
    codeTpl: `<!-- Variants -->
<button class="zak-btn zak-btn--filled" type="button">Filled</button>
<button class="zak-btn zak-btn--outlined" type="button">Outlined</button>
<button class="zak-btn zak-btn--text" type="button">Text</button>
<button class="zak-btn zak-btn--soft" type="button">Soft</button>
<button class="zak-btn zak-btn--link" type="button">Link</button>

<!-- Sizes -->
<button class="zak-btn zak-btn--filled zak-btn--xs" type="button">XS</button>
<button class="zak-btn zak-btn--filled zak-btn--sm" type="button">SM</button>
<button class="zak-btn zak-btn--filled zak-btn--md" type="button">MD</button>
<button class="zak-btn zak-btn--filled zak-btn--lg" type="button">LG</button>
<button class="zak-btn zak-btn--filled zak-btn--xl" type="button">XL</button>

<!-- With icon -->
<button class="zak-btn zak-btn--filled" type="button">
  <svg class="zak-icon" aria-hidden="true">…</svg>
  <span>Create deployment</span>
</button>

<!-- Full width -->
<button class="zak-btn zak-btn--filled zak-btn--block" type="button">Full width</button>

<!-- Disabled -->
<button class="zak-btn zak-btn--filled" type="button" disabled>Disabled</button>

<!-- Loading state -->
<button class="zak-btn zak-btn--filled is-loading" type="button" aria-busy="true">
  <span class="zak-btn__spinner" aria-hidden="true"></span>
  <span>Saving…</span>
</button>`,
    examples: [
      {
        title: 'Filled',
        desc: 'The primary action. One per view region, on the brand ramp.',
        tpl: `<button class="zak-btn zak-btn--filled" type="button">Deploy</button>`,
      },
      {
        title: 'Outlined',
        desc: 'Secondary actions that sit next to a filled button without competing with it.',
        tpl: `<button class="zak-btn zak-btn--outlined" type="button">Save draft</button>`,
      },
      {
        title: 'Text',
        desc: 'Low-emphasis actions in toolbars, table rows and dialogs.',
        tpl: `<button class="zak-btn zak-btn--text" type="button">Cancel</button>`,
      },
      {
        title: 'Soft',
        desc: 'Tinted surface for contextual actions such as filters and bulk operations.',
        tpl: `<button class="zak-btn zak-btn--soft" type="button">${svgIcon('filter', 'zak-icon', 15)} <span>Region: EU</span></button>`,
        code: `<!-- Leading icon inside a soft button -->
<button class="zak-btn zak-btn--soft" type="button">
  <svg class="zak-icon" aria-hidden="true">…</svg>
  <span>Region: EU</span>
</button>`,
      },
      {
        title: 'Link',
        desc: 'Navigational actions inside copy — collapses to inline text.',
        tpl: `<p style="margin:0">No project yet. <button class="zak-btn zak-btn--link" type="button">Create one</button> to get started.</p>`,
        code: `<p>No project yet. <button class="zak-btn zak-btn--link" type="button">Create one</button> to get started.</p>`,
      },
      {
        title: 'Sizes',
        desc: 'Five heights from 28 to 52 px; density is a class, never an inline style.',
        tpl: `<div style="display:flex;flex-wrap:wrap;align-items:center;gap:var(--zak-space-3)">
  <button class="zak-btn zak-btn--filled zak-btn--xs" type="button">XS</button>
  <button class="zak-btn zak-btn--filled zak-btn--sm" type="button">SM</button>
  <button class="zak-btn zak-btn--filled" type="button">MD</button>
  <button class="zak-btn zak-btn--filled zak-btn--lg" type="button">LG</button>
  <button class="zak-btn zak-btn--filled zak-btn--xl" type="button">XL</button>
</div>`,
        code: `<!-- zak-btn--xs | sm | (default md) | lg | xl -->
<button class="zak-btn zak-btn--filled zak-btn--xs" type="button">XS</button>
<button class="zak-btn zak-btn--filled zak-btn--sm" type="button">SM</button>
<button class="zak-btn zak-btn--filled" type="button">MD</button>
<button class="zak-btn zak-btn--filled zak-btn--lg" type="button">LG</button>
<button class="zak-btn zak-btn--filled zak-btn--xl" type="button">XL</button>`,
      },
      {
        title: 'With icons',
        desc: 'Icons are decorative by default; the label carries the accessible name.',
        tpl: `<div style="display:flex;flex-wrap:wrap;align-items:center;gap:var(--zak-space-3)">
  <button class="zak-btn zak-btn--filled" type="button">${svgIcon('plus', 'zak-icon', 15)} <span>New release</span></button>
  <button class="zak-btn zak-btn--outlined" type="button"><span>Export</span> ${svgIcon('download', 'zak-icon', 15)}</button>
</div>`,
        code: `<button class="zak-btn zak-btn--filled" type="button">
  <svg class="zak-icon" aria-hidden="true">…</svg>
  <span>New release</span>
</button>

<button class="zak-btn zak-btn--outlined" type="button">
  <span>Export</span>
  <svg class="zak-icon" aria-hidden="true">…</svg>
</button>`,
      },
      {
        title: 'Full width',
        desc: 'Block buttons stretch to their container — form panels and mobile sheets.',
        tpl: `<div style="width:min(20rem,100%)"><button class="zak-btn zak-btn--filled zak-btn--block" type="button">Continue</button></div>`,
        code: `<button class="zak-btn zak-btn--filled zak-btn--block" type="button">Continue</button>`,
      },
      {
        title: 'Disabled',
        desc: 'Blocks pointer events and dims the control; keep it focusable with aria-disabled instead.',
        tpl: `<div style="display:flex;flex-wrap:wrap;align-items:center;gap:var(--zak-space-3)">
  <button class="zak-btn zak-btn--filled" type="button" disabled>Disabled</button>
  <button class="zak-btn zak-btn--outlined" type="button" aria-disabled="true">Not yet</button>
</div>`,
        code: `<!-- Hard disable -->
<button class="zak-btn zak-btn--filled" type="button" disabled>Disabled</button>

<!-- Stays in the tab order; guard the click handler yourself -->
<button class="zak-btn zak-btn--outlined" type="button" aria-disabled="true">Not yet</button>`,
      },
      {
        title: 'Loading',
        desc: 'Spinner swaps in without changing the button width, so the layout never jumps.',
        tpl: `<button class="zak-btn zak-btn--filled is-loading" type="button" aria-busy="true"><span class="zak-btn__spinner" aria-hidden="true"></span> <span>Saving…</span></button>`,
        code: `<button class="zak-btn zak-btn--filled is-loading" type="button" aria-busy="true">
  <span class="zak-btn__spinner" aria-hidden="true"></span>
  <span>Saving…</span>
</button>`,
      },
    ],
    props: [
      ['variant', 'enum', 'filled', 'filled · outlined · text · soft · link'],
      ['size', 'enum', 'md', 'xs · sm · md · lg · xl (height 28→52px)'],
      ['block', 'boolean', 'false', 'Stretches the button to its container width.'],
      ['disabled', 'boolean', 'false', 'Blocks interaction; opacity 0.48, pointer-events none.'],
      ['loading', 'boolean', 'false', 'Shows an inline spinner and sets aria-busy.'],
      ['type', 'enum', 'button', 'Native button type: button · submit · reset.'],
    ],
    notes: [
      'Hierarchy rule of thumb: one filled per view region, outlined for adjacent actions, text for low-emphasis toolbar actions.',
      'The `link` variant collapses to inline text and is intended for navigational actions inside copy.',
    ],
    js: `// Toggle loading state without layout shift
const btn = document.querySelector('.zak-btn');
btn.classList.add('is-loading');
btn.setAttribute('aria-busy', 'true');
btn.addEventListener('animationend', () => {
  btn.classList.remove('is-loading');
  btn.removeAttribute('aria-busy');
}, { once: true });

// Controller usage
import { ZakButton } from 'zakuikit';
const button = new ZakButton('#save-btn');
await button.withLoading(saveData);`,
    a11y: {
      keys: [
        ['Enter / Space', 'Activates the focused button.'],
        ['Tab / Shift+Tab', 'Moves focus through the page in DOM order.'],
      ],
      aria: [
        ['aria-busy="true"', 'Announced while the loading spinner is visible.'],
        ['aria-disabled', 'Use instead of `disabled` when the button must stay focusable.'],
        ['aria-pressed', 'Only for toggle-style buttons, not one-shot actions.'],
      ],
    },
  }),
  'icon-button': defineDemo({
    desc: 'Square, label-free controls that carry the same five variants as buttons — use them for toolbars, table rows and card affordances. The accessible name must come from `aria-label` since there is no visible text.',
    tpl: `<div class="zak-flex zak-flex--center" style="gap:var(--zak-space-2);flex-wrap:wrap">
  <button class="zak-btn zak-btn--filled zak-btn--icon zak-btn--md" aria-label="Edit" type="button">${svgIcon('edit', 'zak-icon', 16)}</button>
  <button class="zak-btn zak-btn--outlined zak-btn--icon zak-btn--md" aria-label="Refresh" type="button">${svgIcon('refresh', 'zak-icon', 16)}</button>
  <button class="zak-btn zak-btn--text zak-btn--icon zak-btn--md" aria-label="Delete" type="button">${svgIcon('trash', 'zak-icon', 16)}</button>
  <button class="zak-btn zak-btn--soft zak-btn--icon zak-btn--md zak-btn--round" aria-label="Copy" type="button">${svgIcon('copy', 'zak-icon', 16)}</button>
  <button class="zak-btn zak-btn--filled zak-btn--icon zak-btn--md zak-btn--round" aria-label="Add" type="button">${svgIcon('plus', 'zak-icon', 16)}</button>
  <button class="zak-btn zak-btn--soft zak-btn--icon zak-btn--sm" aria-label="Settings" type="button">${svgIcon('settings', 'zak-icon', 16)}</button>
  <button class="zak-btn zak-btn--filled zak-btn--icon zak-btn--lg" aria-label="Menu" type="button">${svgIcon('menu', 'zak-icon', 18)}</button>
</div>`,
    codeTpl: `<!-- Variants -->
<button class="zak-btn zak-btn--filled zak-btn--icon zak-btn--md" aria-label="Edit" type="button">✎</button>
<button class="zak-btn zak-btn--outlined zak-btn--icon zak-btn--md" aria-label="Refresh" type="button">⟳</button>
<button class="zak-btn zak-btn--text zak-btn--icon zak-btn--md" aria-label="Delete" type="button">🗑</button>
<button class="zak-btn zak-btn--soft zak-btn--icon zak-btn--md" aria-label="Copy" type="button">📋</button>

<!-- Round (circular) -->
<button class="zak-btn zak-btn--filled zak-btn--icon zak-btn--md zak-btn--round" aria-label="Add" type="button">+</button>
<button class="zak-btn zak-btn--soft zak-btn--icon zak-btn--md zak-btn--round" aria-label="Settings" type="button">⚙</button>

<!-- Sizes -->
<button class="zak-btn zak-btn--filled zak-btn--icon zak-btn--sm" aria-label="Small" type="button">✎</button>
<button class="zak-btn zak-btn--filled zak-btn--icon zak-btn--md" aria-label="Medium" type="button">✎</button>
<button class="zak-btn zak-btn--filled zak-btn--icon zak-btn--lg" aria-label="Large" type="button">✎</button>`,
    props: [
      ['variant', 'enum', 'filled', 'filled · outlined · text · soft · link'],
      ['--icon', 'modifier', '—', 'Square 1:1 control with centered glyph.'],
      ['--round', 'modifier', '—', 'Fully circular shape.'],
      ['size', 'enum', 'md', 'sm · md · lg — match adjacent inputs.'],
      ['aria-label', 'string', 'required', 'Accessible name — mandatory for icon-only buttons.'],
    ],
    notes: ['Keep one shape language per toolbar cluster — mixing variants inside a single group reads as noise.'],
  }),
  'button-group': defineDemo({
    desc: 'Segments adjacent related actions into one visual unit. Active segments announce themselves with the `is-active` class and brand tint.',
    tpl: `<div class="zak-stack zak-stack--lg" style="flex-wrap:wrap;gap:var(--zak-space-3);align-items:center">
  <div class="zak-btn-group" role="group" aria-label="Date range presets">
    <button class="zak-btn zak-btn--soft zak-btn--sm is-active" type="button">Day</button>
    <button class="zak-btn zak-btn--soft zak-btn--sm" type="button">Week</button>
    <button class="zak-btn zak-btn--soft zak-btn--sm" type="button">Month</button>
    <button class="zak-btn zak-btn--soft zak-btn--sm" type="button">Quarter</button>
  </div>
  <div class="zak-btn-group" role="group" aria-label="View mode">
    <button class="zak-btn zak-btn--outlined zak-btn--sm is-active" type="button">Grid</button>
    <button class="zak-btn zak-btn--outlined zak-btn--sm" type="button">List</button>
    <button class="zak-btn zak-btn--outlined zak-btn--sm" type="button">Compact</button>
  </div>
</div>`,
    codeTpl: `<!-- Soft variant (recommended for segmented controls) -->
<div class="zak-btn-group" role="group" aria-label="Date range presets">
  <button class="zak-btn zak-btn--soft zak-btn--sm is-active" type="button">Day</button>
  <button class="zak-btn zak-btn--soft zak-btn--sm" type="button">Week</button>
  <button class="zak-btn zak-btn--soft zak-btn--sm" type="button">Month</button>
  <button class="zak-btn zak-btn--soft zak-btn--sm" type="button">Quarter</button>
</div>

<!-- Outlined variant -->
<div class="zak-btn-group" role="group" aria-label="View mode">
  <button class="zak-btn zak-btn--outlined zak-btn--sm is-active" type="button">Grid</button>
  <button class="zak-btn zak-btn--outlined zak-btn--sm" type="button">List</button>
  <button class="zak-btn zak-btn--outlined zak-btn--sm" type="button">Compact</button>
</div>

<!-- Filled variant -->
<div class="zak-btn-group" role="group" aria-label="Actions">
  <button class="zak-btn zak-btn--filled zak-btn--sm is-active" type="button">Save</button>
  <button class="zak-btn zak-btn--filled zak-btn--sm" type="button">Publish</button>
</div>`,
    props: [
      ['variant', 'enum', 'soft', 'Segments use one shared variant: filled · outlined · text · soft.'],
      ['is-active', 'class', '—', 'Marks the selected segment; renders brand-subtle tint.'],
      ['role="group"', 'attr', '—', 'Groups segments for assistive technology.'],
    ],
    a11y: {
      keys: [
        ['Enter / Space', 'Activates the focused segment.'],
        ['← / →', 'Moves between segments.'],
      ],
      aria: [
        ['role="group"', 'Groups segments for assistive technology.'],
        ['aria-pressed', 'Reflects pressed state on each segment.'],
      ],
    },
  }),
  'button-toolbar': defineDemo({
    desc: 'A floating cluster of icon tools with grouped separators and pressed states — the pattern behind rich-text and canvas editors.',
    tpl: `<div class="zak-btn-toolbar" role="toolbar" aria-label="Editor tools">
  <button class="zak-btn zak-btn--text zak-btn--icon" aria-label="Bold" data-zak-toggleable type="button">${svgIcon('type', 'zak-icon', 16)}</button>
  <button class="zak-btn zak-btn--text zak-btn--icon is-active" aria-label="Filters" aria-pressed="true" type="button">${svgIcon('filter', 'zak-icon', 16)}</button>
  <button class="zak-btn zak-btn--text zak-btn--icon" aria-label="Zap" aria-pressed="false" data-zak-toggleable type="button">${svgIcon('zap', 'zak-icon', 16)}</button>
  <span class="zak-divider zak-divider--v"></span>
  <button class="zak-btn zak-btn--text zak-btn--icon" aria-label="Duplicate" type="button">${svgIcon('copy', 'zak-icon', 16)}</button>
  <button class="zak-btn zak-btn--text zak-btn--icon" aria-label="Delete" type="button">${svgIcon('trash', 'zak-icon', 16)}</button>
</div>`,
    codeTpl: `<!-- Toolbar with toggleable tools -->
<div class="zak-btn-toolbar" role="toolbar" aria-label="Editor tools">
  <button class="zak-btn zak-btn--text zak-btn--icon" aria-label="Bold" data-zak-toggleable type="button">B</button>
  <button class="zak-btn zak-btn--text zak-btn--icon is-active" aria-label="Filters" aria-pressed="true" type="button">☰</button>
  <button class="zak-btn zak-btn--text zak-btn--icon" aria-label="Zap" aria-pressed="false" data-zak-toggleable type="button">⚡</button>
  <span class="zak-divider zak-divider--v"></span>
  <button class="zak-btn zak-btn--text zak-btn--icon" aria-label="Duplicate" type="button">📋</button>
  <button class="zak-btn zak-btn--text zak-btn--icon" aria-label="Delete" type="button">🗑</button>
</div>`,
    props: [
      ['variant', 'enum', 'text', 'Tool glyphs use one variant across the cluster — text · soft · filled · outlined.'],
      ['role="toolbar"', 'attr', '—', 'Declares the grouping for assistive tech.'],
      ['aria-pressed', 'boolean', 'false', 'Reflects toggle state of tools that have one.'],
      ['data-zak-toggleable', 'attr', '—', 'Toggles `is-active` + aria-pressed on click.'],
    ],
    a11y: {
      keys: [
        ['Enter / Space', 'Activates the focused tool.'],
        ['← / →', 'Moves between tools.'],
      ],
      aria: [
        ['role="toolbar"', 'Declares the grouping for assistive tech.'],
        ['aria-pressed', 'Reflects toggle state of tools that have one.'],
      ],
    },
  }),
  'loading-button': defineDemo({
    desc: 'Async actions keep their width while the spinner replaces the affordance. The label stays in the DOM visually-hidden so assistive tech keeps context.',
    tpl: `<div class="zak-flex zak-flex--center" style="gap:var(--zak-space-3);flex-wrap:wrap">
  <button class="zak-btn zak-btn--filled is-loading" type="button" aria-busy="true">
    <span class="zak-btn__spinner" aria-hidden="true"></span>
    <span>Saving changes…</span>
  </button>
  <button class="zak-btn zak-btn--outlined" type="button">
    <span class="zak-btn__spinner" aria-hidden="true"></span>
    <span>Click to toggle loading</span>
  </button>
</div>`,
    codeTpl: `<!-- Loading state (filled) -->
<button class="zak-btn zak-btn--filled is-loading" type="button" aria-busy="true">
  <span class="zak-btn__spinner" aria-hidden="true"></span>
  <span>Saving changes…</span>
</button>

<!-- Loading state (outlined) -->
<button class="zak-btn zak-btn--outlined is-loading" type="button" aria-busy="true">
  <span class="zak-btn__spinner" aria-hidden="true"></span>
  <span>Processing…</span>
</button>

<!-- Interactive toggle -->
<button class="zak-btn zak-btn--filled" type="button">
  <span class="zak-btn__spinner" aria-hidden="true"></span>
  <span>Click to toggle loading</span>
</button>`,
    props: [
      ['is-loading', 'class', '—', 'Replaces content with the inline spinner.'],
      ['aria-busy', 'boolean', 'false', 'Announced to assistive technology while pending.'],
      ['--btn__spinner', 'element', '—', 'Border-spinner sized in `em` so it scales with any button size.'],
    ],
    notes: ['Buttons in the loading state keep `pointer-events: none` to prevent double submission.'],
    js: `button.addEventListener('click', async () => {
  button.classList.add('is-loading');
  button.setAttribute('aria-busy', 'true');
  try {
    await save();
  } finally {
    button.classList.remove('is-loading');
    button.removeAttribute('aria-busy');
  }
});

// Controller usage
import { ZakButton } from 'zakuikit';
const button = new ZakButton('#save-btn');
await button.withLoading(saveData);`,
    a11y: {
      keys: [
        ['Enter / Space', 'Activates the button (if not in loading state).'],
      ],
      aria: [
        ['aria-busy="true"', 'Announced while the loading spinner is visible.'],
        ['aria-disabled', 'Use instead of `disabled` when the button must stay focusable.'],
      ],
    },
  }),
  'floating-action-button': defineDemo({
    desc: 'A prominent action anchored to the viewport corner. The gradient fill and spring hover make it read as the single "next step" on the screen.',
    tpl: `<div class="zak-flex zak-flex--center" style="gap:var(--zak-space-5)">
  <button class="zak-fab" aria-label="New project" type="button">${svgIcon('plus', 'zak-icon', 20)}<span>New project</span></button>
  <button class="zak-fab zak-fab--mini" aria-label="Quick add" type="button">${svgIcon('plus', 'zak-icon', 18)}</button>
</div>`,
    codeTpl: `<!-- Standard FAB with label -->
<button class="zak-fab" aria-label="New project" type="button">
  <svg class="zak-icon">…</svg>
  <span>New project</span>
</button>

<!-- Mini FAB (icon only) -->
<button class="zak-fab zak-fab--mini" aria-label="Quick add" type="button">
  <svg class="zak-icon">…</svg>
</button>

<!-- Fixed to viewport corner -->
<button class="zak-fab zak-fab--fixed" aria-label="New project" type="button">
  <svg class="zak-icon">…</svg>
  <span>New project</span>
</button>`,
    props: [
      ['--mini', 'modifier', '—', 'Compact 44px circle without a label.'],
      ['--fixed', 'modifier', '—', 'Anchors bottom-right at z-index sticky.'],
    ],
    notes: ['FAB is reserved for the primary create action; never place two FABs on the same screen.'],
    a11y: {
      keys: [
        ['Enter / Space', 'Activates the FAB.'],
      ],
      aria: [
        ['aria-label', 'Required — provides accessible name for icon-only or labeled FAB.'],
      ],
    },
  }),
  'button-toggle': defineDemo({
    desc: 'A button that stays pressed. Use `aria-pressed` as the source of truth; the `is-active` class mirrors it visually. `data-zak-toggleable` flips both on click.',
    tpl: `<div class="zak-flex zak-flex--wrap" style="justify-content:center;gap:var(--zak-space-2)">
  <button class="zak-btn zak-toggle-btn is-active" aria-pressed="true" data-zak-toggleable type="button">${svgIcon('star', 'zak-icon', 15)} Favorited</button>
  <button class="zak-btn zak-toggle-btn is-active" aria-pressed="true" data-zak-toggleable type="button">${svgIcon('eye', 'zak-icon', 15)} Watching</button>
  <button class="zak-btn zak-toggle-btn" aria-pressed="false" data-zak-toggleable type="button">${svgIcon('bell', 'zak-icon', 15)} Notify me</button>
  <button class="zak-btn zak-toggle-btn" aria-pressed="false" data-zak-toggleable type="button">${svgIcon('filter', 'zak-icon', 15)} Filters</button>
</div>`,
    codeTpl: `<!-- Off: aria-pressed="false" -->
<button class="zak-btn zak-toggle-btn" aria-pressed="false" data-zak-toggleable type="button"><svg class="zak-icon" aria-hidden="true">…</svg> Favorite</button>

<!-- On: is-active mirrors aria-pressed="true" -->
<button class="zak-btn zak-toggle-btn is-active" aria-pressed="true" data-zak-toggleable type="button"><svg class="zak-icon" aria-hidden="true">…</svg> Watching</button>

<!-- data-zak-toggleable auto-toggles the class + aria on click -->
<button class="zak-btn zak-toggle-btn" aria-pressed="false" data-zak-toggleable type="button"><svg class="zak-icon" aria-hidden="true">…</svg> Notify me</button>`,
    props: [
      ['aria-pressed', 'boolean', 'false', 'Source of truth for pressed state.'],
      ['is-active', 'class', '—', 'Visual pressed styling; keep in sync with aria-pressed.'],
      ['data-zak-toggleable', 'attr', '—', 'Auto-toggles class + aria on click.'],
    ],
    notes: ['Formerly documented under Forms as “Toggle”; the `.zak-toggle-btn` class is unchanged.'],
    a11y: {
      keys: [
        ['Enter / Space', 'Toggles the pressed state.'],
      ],
      aria: [
        ['aria-pressed', 'Conveys the three-state toggle (true / false / mixed) to assistive tech.'],
      ],
    },
  }),
};