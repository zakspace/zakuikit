/**
 * Demos — Navigation: navbar, sidebar, menus, breadcrumb, tabs, pagination,
 * stepper, vertical and anchor navigation.
 */
import { defineDemo, type DemoDef } from './types';
import { svgIcon } from '../data/icons';

const searchI = svgIcon('search', 'zak-icon', 14);
const menuI = svgIcon('menu', 'zak-icon', 16);
const chevDown = svgIcon('chevron-down', 'zak-icon', 13);
const chevRight = svgIcon('chevron-right', 'zak-icon', 12);
const checkI = svgIcon('check', 'zak-icon', 12);
const githubI = svgIcon('github', 'zak-icon', 15);
const folderI = svgIcon('folder', 'zak-icon', 15);
const chartI = svgIcon('bar-chart', 'zak-icon', 15);
const settingsI = svgIcon('settings', 'zak-icon', 15);
const layoutI = svgIcon('layout', 'zak-icon', 15);
const usersI = svgIcon('users', 'zak-icon', 15);
const shieldI = svgIcon('shield', 'zak-icon', 15);
const cardI = svgIcon('credit-card', 'zak-icon', 15);
const editI = svgIcon('edit', 'zak-icon', 14);
const copyI = svgIcon('copy', 'zak-icon', 14);
const trashI = svgIcon('trash', 'zak-icon', 14);

export const navigationDemos: Record<string, DemoDef> = {
  navbar: defineDemo({
    desc: 'The top-level application bar: brand, primary links, global search and utilities. Under 48rem the bar collapses behind a toggler; the glass surface blurs content scrolling beneath it.',
    usage: '<nav class="zak-navbar">\n  <a class="zak-navbar__brand" href="#">ZAKUIKit</a>\n  <button class="zak-btn zak-btn--ghost zak-btn--icon zak-navbar__toggle" type="button" data-zak-navbar-toggle aria-expanded="false" aria-controls="nav" aria-label="Toggle navigation">☰</button>\n  <div class="zak-navbar__collapse" id="nav">\n    <div class="zak-navbar__nav">\n      <a class="zak-navbar__link is-active" href="#">Docs</a>\n    </div>\n  </div>\n</nav>',
    stage: 'stretch',
    tpl: `<nav class="zak-navbar" style="position:static;width:100%;border:1px solid var(--zak-border-subtle);border-radius:var(--zak-radius-lg)">
    <a class="zak-navbar__brand" href="#" style="text-decoration:none"><span class="zak-ai-avatar zak-ai-avatar--sm" aria-hidden="true"></span>ZAKUIKit</a>
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm zak-navbar__toggle" type="button" data-zak-navbar-toggle aria-expanded="false" aria-controls="demo-navbar-nav" aria-label="Toggle navigation">${menuI}</button>
    <div class="zak-navbar__collapse" id="demo-navbar-nav">
      <div class="zak-navbar__nav">
        <a class="zak-navbar__link is-active" href="#">Docs</a>
        <a class="zak-navbar__link" href="#">Components</a>
        <a class="zak-navbar__link" href="#">Tokens</a>
        <a class="zak-navbar__link" href="#">Changelog</a>
      </div>
      <div class="zak-navbar__search">
        <span class="zak-search" style="width:12rem">${searchI}<input type="search" placeholder="Search…" aria-label="Search"/></span>
      </div>
      <div class="zak-navbar__extra">
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="GitHub repository">${githubI}</button>
        <span class="zak-avatar zak-avatar--sm" title="Abdul Shaikh">AS</span>
      </div>
    </div>
  </nav>`,
    codeTpl: `<!-- The bar collapses as a whole: everything between .zak-navbar__collapse
     moves into the toggler menu under 48rem of available width -->
<nav class="zak-navbar" aria-label="Main">
  <a class="zak-navbar__brand" href="#">ZAKUIKit</a>

  <!-- Desktop-hidden toggler; the runtime flips .is-open + aria-expanded -->
  <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm zak-navbar__toggle"
          type="button" data-zak-navbar-toggle aria-expanded="false"
          aria-controls="nav" aria-label="Toggle navigation">☰</button>

  <div class="zak-navbar__collapse" id="nav">
    <!-- Active link: .zak-navbar__link.is-active -->
    <div class="zak-navbar__nav">
      <a class="zak-navbar__link is-active" href="#">Docs</a>
      <a class="zak-navbar__link" href="#">Components</a>
    </div>
    <!-- .zak-navbar__search sits at the inline end; inside the menu when collapsed -->
    <div class="zak-navbar__search"><span class="zak-search">…</span></div>
    <!-- .zak-navbar__extra groups icon buttons and the avatar -->
    <div class="zak-navbar__extra">…</div>
  </div>
</nav>

<!-- Sticky surface: position: sticky; top: 0 -->
<nav class="zak-navbar" style="position:sticky;top:0">…</nav>`,
    examples: [
      {
        title: 'Brand and links',
        desc: 'The smallest working bar: a brand link plus the nav group.',
        stage: 'stretch',
        tpl: `<nav class="zak-navbar" aria-label="Main" style="position:static;width:100%;border:1px solid var(--zak-border-subtle);border-radius:var(--zak-radius-lg)">
  <a class="zak-navbar__brand" href="#" style="text-decoration:none">ZAKUIKit</a>
  <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm zak-navbar__toggle" type="button" data-zak-navbar-toggle aria-expanded="false" aria-controls="ex-navbar-min-nav" aria-label="Toggle navigation">${menuI}</button>
  <div class="zak-navbar__collapse" id="ex-navbar-min-nav">
    <div class="zak-navbar__nav">
      <a class="zak-navbar__link is-active" href="#">Docs</a>
      <a class="zak-navbar__link" href="#">Components</a>
      <a class="zak-navbar__link" href="#">Tokens</a>
    </div>
  </div>
</nav>`,
        code: `<nav class="zak-navbar" aria-label="Main">
  <a class="zak-navbar__brand" href="#">ZAKUIKit</a>

  <!-- Even the smallest bar ships a toggler, or the links are unreachable when the bar collapses -->
  <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm zak-navbar__toggle"
          type="button" data-zak-navbar-toggle aria-expanded="false"
          aria-controls="nav" aria-label="Toggle navigation">☰</button>

  <div class="zak-navbar__collapse" id="nav">
    <div class="zak-navbar__nav">
      <!-- .is-active marks the current section -->
      <a class="zak-navbar__link is-active" href="#">Docs</a>
      <a class="zak-navbar__link" href="#">Components</a>
      <a class="zak-navbar__link" href="#">Tokens</a>
    </div>
  </div>
</nav>`,
      },
      {
        title: 'Search and utilities',
        desc: '`__search` pins to the inline end and `__extra` groups icon buttons plus the avatar.',
        stage: 'stretch',
        tpl: `<nav class="zak-navbar" aria-label="Main" style="position:static;width:100%;border:1px solid var(--zak-border-subtle);border-radius:var(--zak-radius-lg)">
  <a class="zak-navbar__brand" href="#" style="text-decoration:none">ZAKUIKit</a>
  <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm zak-navbar__toggle" type="button" data-zak-navbar-toggle aria-expanded="false" aria-controls="ex-navbar-util-nav" aria-label="Toggle navigation">${menuI}</button>
  <div class="zak-navbar__collapse" id="ex-navbar-util-nav">
    <div class="zak-navbar__nav">
      <a class="zak-navbar__link is-active" href="#">Docs</a>
      <a class="zak-navbar__link" href="#">Changelog</a>
    </div>
    <div class="zak-navbar__search">
      <span class="zak-search" style="width:12rem">${searchI}<input type="search" placeholder="Search…" aria-label="Search"/></span>
    </div>
    <div class="zak-navbar__extra">
      <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="GitHub repository">${githubI}</button>
      <span class="zak-avatar zak-avatar--sm" title="Abdul Shaikh">AS</span>
    </div>
  </div>
</nav>`,
        code: `<div class="zak-navbar__collapse" id="nav">
  <div class="zak-navbar__nav">…</div>

  <!-- Inline-end search; moves into the toggler menu when collapsed -->
  <div class="zak-navbar__search">
    <span class="zak-search">
      <svg class="zak-icon" aria-hidden="true">…</svg>
      <input type="search" placeholder="Search…" aria-label="Search"/>
    </span>
  </div>

  <!-- Utilities: icon buttons need names -->
  <div class="zak-navbar__extra">
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="GitHub repository">…</button>
    <span class="zak-avatar zak-avatar--sm">AS</span>
  </div>
</div>`,
      },
      {
        title: 'Responsive collapse',
        desc: 'Below 48rem of available width everything between `__collapse` becomes a menu behind the toggler.',
        stage: 'stretch',
        tpl: `<nav class="zak-navbar" aria-label="Main" style="position:static;width:100%;border:1px solid var(--zak-border-subtle);border-radius:var(--zak-radius-lg)">
  <a class="zak-navbar__brand" href="#" style="text-decoration:none">ZAKUIKit</a>
  <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm zak-navbar__toggle" type="button" data-zak-navbar-toggle aria-expanded="false" aria-controls="ex-navbar-nav" aria-label="Toggle navigation">${menuI}</button>
  <div class="zak-navbar__collapse" id="ex-navbar-nav">
    <div class="zak-navbar__nav">
      <a class="zak-navbar__link is-active" href="#">Docs</a>
      <a class="zak-navbar__link" href="#">Components</a>
    </div>
    <div class="zak-navbar__search">
      <span class="zak-search">${searchI}<input type="search" placeholder="Search…" aria-label="Search"/></span>
    </div>
  </div>
</nav>`,
        code: `<nav class="zak-navbar" aria-label="Main">
  <a class="zak-navbar__brand" href="#">ZAKUIKit</a>

  <!-- Hidden on wide bars; the runtime flips .is-open + aria-expanded -->
  <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm zak-navbar__toggle"
          type="button" data-zak-navbar-toggle aria-expanded="false"
          aria-controls="nav" aria-label="Toggle navigation">☰</button>

  <div class="zak-navbar__collapse" id="nav">
    <div class="zak-navbar__nav">…</div>
    <div class="zak-navbar__search">…</div>
  </div>
</nav>`,
      },
      {
        title: 'Sticky glass bar',
        desc: 'The bar is `position: sticky` with a blurred glass surface by default — no extra class needed.',
        stage: 'stretch',
        tpl: `<nav class="zak-navbar" aria-label="Main" style="position:static;width:100%;border:1px solid var(--zak-border-subtle);border-radius:var(--zak-radius-lg)">
  <a class="zak-navbar__brand" href="#" style="text-decoration:none">ZAKUIKit</a>
  <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm zak-navbar__toggle" type="button" data-zak-navbar-toggle aria-expanded="false" aria-controls="ex-navbar-glass-nav" aria-label="Toggle navigation">${menuI}</button>
  <div class="zak-navbar__collapse" id="ex-navbar-glass-nav">
    <div class="zak-navbar__nav">
      <a class="zak-navbar__link is-active" href="#">Docs</a>
    </div>
  </div>
</nav>`,
        code: `<nav class="zak-navbar" aria-label="Main" style="position:sticky;top:0">…</nav>`,
      },
    ],
    props: [
      ['.zak-navbar__brand', 'element', '—', 'Logo + wordmark link; bold 18px with tight tracking.'],
      ['.zak-navbar__link.is-active', 'class', '—', 'Brand-subtle pill marks the current section.'],
      ['.zak-navbar__collapse', 'element', '—', 'Collapsible region: links, search and utilities.'],
      ['.zak-navbar__toggle', 'element', '—', 'Appears below 48rem; reveals the collapse region as a menu.'],
      ['data-zak-navbar-toggle', 'attr', '—', 'Toggles `.is-open` on the bar and mirrors `aria-expanded`.'],
      ['position: sticky', 'css', 'top: 0', 'Stays pinned; glass surface keeps text legible over content.'],
    ],
    a11y: {
      keys: [
        ['Tab', 'Visits brand → links → utilities in DOM order.'],
        ['Escape', 'Closes the open toggler menu and returns focus to the toggler.'],
        ['Skip link', 'First tab stop should bypass the bar entirely.'],
      ],
      aria: [
        ['aria-label', 'Icon-only utilities need names; the bar gets aria-label="Main".'],
        ['aria-expanded', 'The toggler reflects whether the collapsed menu is open.'],
        ['aria-current="page"', 'Better than a class alone for the active link.'],
      ],
    },
  }),
  sidebar: defineDemo({
    desc: 'Persistent vertical navigation with collapsible groups, counts and an active rail. The toggle rotates its chevron and flips aria-expanded.',
    usage: '<div data-zak-sidebar>\n  <nav class="zak-sidebar" aria-label="Product">\n    <div class="zak-sidebar__section">\n      <button class="zak-sidebar__toggle" aria-expanded="true">Getting started</button>\n      <div class="zak-sidebar__links">\n        <a class="zak-sidebar__link is-active" href="#">Introduction</a>\n      </div>\n    </div>\n  </nav>\n</div>',
    stage: 'stretch',
    tpl: `<div style="width:15.5rem;border:1px solid var(--zak-border-subtle);border-radius:var(--zak-radius-lg);background:var(--zak-bg-surface)" data-zak-sidebar>
    <nav class="zak-sidebar" aria-label="Product">
      <div class="zak-sidebar__section">
        <button class="zak-sidebar__toggle" type="button" aria-expanded="true">${layoutI} Getting started ${chevDown}</button>
        <div class="zak-sidebar__links">
          <a class="zak-sidebar__link is-active" href="#">Introduction</a>
          <a class="zak-sidebar__link" href="#">Installation</a>
          <a class="zak-sidebar__link" href="#">Theming</a>
        </div>
      </div>
      <div class="zak-sidebar__section">
        <button class="zak-sidebar__toggle" type="button" aria-expanded="true">${folderI} Components <span class="zak-sidebar__count">167</span> ${chevDown}</button>
        <div class="zak-sidebar__links">
          <a class="zak-sidebar__link" href="#">Buttons</a>
          <a class="zak-sidebar__link" href="#">Forms</a>
          <a class="zak-sidebar__link" href="#">Data Grid <span class="zak-ai-badge" style="margin-inline-start:auto">AI</span></a>
        </div>
      </div>
      <div class="zak-sidebar__section">
        <button class="zak-sidebar__toggle" type="button" aria-expanded="false">${settingsI} Settings ${chevDown}</button>
        <div class="zak-sidebar__links" hidden>
          <a class="zak-sidebar__link" href="#">Preferences</a>
          <a class="zak-sidebar__link" href="#">API keys</a>
        </div>
      </div>
    </nav>
  </div>`,
    codeTpl: `<!-- Group toggle: .zak-sidebar__toggle -->
<nav class="zak-sidebar" aria-label="Product">
  <div class="zak-sidebar__section">
    <button class="zak-sidebar__toggle" type="button" aria-expanded="true">Getting started</button>

    <!-- Active link: .zak-sidebar__link.is-active -->
    <div class="zak-sidebar__links">
      <a class="zak-sidebar__link is-active" href="#">Introduction</a>
    </div>
  </div>

  <div class="zak-sidebar__section">
    <button class="zak-sidebar__toggle" type="button" aria-expanded="true">
      Components
      <!-- Trailing count: .zak-sidebar__count -->
      <span class="zak-sidebar__count">167</span>
    </button>
  </div>
</nav>`,
    js: `toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  toggle.nextElementSibling.hidden = open;   // .zak-sidebar__links
});`,
    props: [
      ['.zak-sidebar__toggle', 'element', '—', 'Group header; chevron rotates when aria-expanded flips.'],
      ['.zak-sidebar__link.is-active', 'class', '—', 'Brand-subtle fill + brand rail on the leading edge.'],
      ['.zak-sidebar__count', 'element', '—', 'Trailing tabular count, pushed right automatically.'],
    ],
  }),
  'navigation-menu': defineDemo({
    desc: 'A horizontal menu bar for product-level navigation: equal-height items, an active pill and inline badges for counts.',
    tpl: `<div style="display:flex;align-items:center;gap:var(--zak-space-4);padding:var(--zak-space-2) var(--zak-space-3);width:100%;max-width:40rem;border:1px solid var(--zak-border-subtle);border-radius:var(--zak-radius-lg);background:var(--zak-bg-surface)">
    <span style="font-weight:var(--zak-weight-bold);letter-spacing:-0.02em">Acme Corp</span>
    <ul class="zak-menu zak-menu--h" style="box-shadow:none;border:0;background:transparent;padding:0;gap:var(--zak-space-1)">
      <li><a class="zak-menu__item is-active" href="#">Overview</a></li>
      <li><a class="zak-menu__item" href="#">Members <span class="zak-badge zak-badge--counter">24</span></a></li>
      <li><a class="zak-menu__item" href="#">Billing</a></li>
      <li><a class="zak-menu__item" href="#">Settings</a></li>
    </ul>
  </div>`,
    codeTpl: `<!-- Horizontal modifier: .zak-menu--h -->
<ul class="zak-menu zak-menu--h">
  <!-- Active item: is-active -->
  <li><a class="zak-menu__item is-active" href="#">Overview</a></li>
  <li><a class="zak-menu__item" href="#">Members <span class="zak-badge zak-badge--counter">24</span></a></li>
  <li><a class="zak-menu__item" href="#">Billing</a></li>
</ul>`,
    props: [
      ['.zak-menu--h', 'modifier', '—', 'Flex row instead of column; items stay inline.'],
      ['is-active on item', 'class', '—', 'Brand-subtle pill with semibold weight.'],
    ],
  }),
  menu: defineDemo({
    desc: 'The vertical command list: section labels, icon items with keyboard shortcuts, separators and a danger row. The building block under Dropdown and Context Menu.',
    tpl: `<ul class="zak-menu" style="width:15rem" role="menu" aria-label="Workspace menu">
    <li class="zak-menu__label">Workspace</li>
    <li><a class="zak-menu__item is-active" href="#" role="menuitem">${layoutI} Dashboard</a></li>
    <li><a class="zak-menu__item" href="#" role="menuitem">${folderI} Projects</a></li>
    <li><a class="zak-menu__item" href="#" role="menuitem">${chartI} Reports <kbd class="zak-kbd">R</kbd></a></li>
    <li class="zak-menu__sep" role="separator"></li>
    <li><a class="zak-menu__item" href="#" role="menuitem">${editI} Invite members <kbd class="zak-kbd">I</kbd></a></li>
    <li><a class="zak-menu__item" href="#" role="menuitem">${settingsI} Settings</a></li>
    <li class="zak-menu__sep" role="separator"></li>
    <li><a class="zak-menu__item" href="#" role="menuitem" style="color:var(--zak-danger-text)">${trashI} Delete workspace</a></li>
  </ul>`,
    codeTpl: `<ul class="zak-menu" role="menu" aria-label="Workspace menu">
  <!-- Section label: .zak-menu__label -->
  <li class="zak-menu__label">Workspace</li>

  <li><a class="zak-menu__item" href="#" role="menuitem">Dashboard</a></li>

  <!-- Shortcut hint: kbd -->
  <li><a class="zak-menu__item" href="#" role="menuitem">Reports <kbd class="zak-kbd">R</kbd></a></li>

  <!-- Separator: .zak-menu__sep -->
  <li class="zak-menu__sep" role="separator"></li>
</ul>`,
    props: [
      ['.zak-menu__label', 'element', '—', 'Uppercase non-interactive section header.'],
      ['.zak-menu__sep', 'element', '—', '1px hairline with block margins.'],
      ['kbd', 'element', '—', 'Trailing shortcut hint, pushed right automatically.'],
    ],
    a11y: {
      keys: [
        ['↑ / ↓', 'Moves the active option in a menu.'],
        ['Home / End', 'Jumps to first / last option.'],
        ['Escape', 'Closes the hosting dropdown and restores focus.'],
      ],
      aria: [
        ['role="menu" / menuitem', 'Only for application menus — navigation links stay lists.'],
      ],
    },
  }),
  'dropdown-menu': defineDemo({
    desc: 'An anchored menu panel with items, shortcuts and a destructive row. Panels can align to either edge via `--end` for right-edge triggers.',
    tpl: `<div class="zak-flex" style="justify-content:space-between;align-items:flex-start;width:100%;max-width:38rem">
    <div class="zak-dropdown" data-zak-dropdown>
      <button class="zak-btn zak-btn--outline" type="button" data-zak-toggle="dropdown" aria-haspopup="menu" aria-expanded="false">Actions ${chevDown}</button>
      <div class="zak-dropdown__panel" hidden role="menu" aria-label="Row actions">
        <a class="zak-menu__item" href="#" role="menuitem">${editI} Edit <kbd class="zak-kbd">E</kbd></a>
        <a class="zak-menu__item" href="#" role="menuitem">${copyI} Duplicate <kbd class="zak-kbd">D</kbd></a>
        <div class="zak-menu__sep" role="separator"></div>
        <a class="zak-menu__item" href="#" role="menuitem" style="color:var(--zak-danger-text)">${trashI} Delete <kbd class="zak-kbd">⌫</kbd></a>
      </div>
    </div>
    <div class="zak-dropdown" data-zak-dropdown>
      <button class="zak-btn zak-btn--ghost zak-btn--icon" type="button" data-zak-toggle="dropdown" aria-haspopup="menu" aria-expanded="false" aria-label="More options">${svgIcon('more-h', 'zak-icon', 16)}</button>
      <div class="zak-dropdown__panel zak-dropdown__panel--end" hidden role="menu" aria-label="More options">
        <a class="zak-menu__item" href="#" role="menuitem">Export as CSV</a>
        <a class="zak-menu__item" href="#" role="menuitem">Copy link</a>
        <a class="zak-menu__item" href="#" role="menuitem">Print</a>
      </div>
    </div>
  </div>`,
    codeTpl: `<!-- Trigger contract: data-zak-toggle="dropdown" -->
<div class="zak-dropdown" data-zak-dropdown>
  <!-- Popup type + state: aria-haspopup / aria-expanded -->
  <button class="zak-btn zak-btn--outlined" type="button" data-zak-toggle="dropdown" aria-haspopup="menu" aria-expanded="false">Actions ▾</button>

  <div class="zak-dropdown__panel" hidden role="menu">
    <a class="zak-menu__item" href="#" role="menuitem">Edit</a>
    <a class="zak-menu__item" href="#" role="menuitem">Duplicate</a>
  </div>
</div>

<!-- End-aligned panel: .zak-dropdown__panel--end -->
<div class="zak-dropdown__panel zak-dropdown__panel--end" hidden role="menu">…</div>`,
    examples: [
      {
        title: 'Menu with icons and shortcuts',
        desc: 'Each item pairs an icon with a `kbd` hint; the separator splits action groups.',
        tpl: `<div class="zak-dropdown" data-zak-dropdown>
  <button class="zak-btn zak-btn--outlined" type="button" data-zak-toggle="dropdown" aria-haspopup="menu" aria-expanded="false">Actions ${chevDown}</button>
  <div class="zak-dropdown__panel" hidden role="menu" aria-label="Row actions">
    <a class="zak-menu__item" href="#" role="menuitem">${editI} Edit <kbd class="zak-kbd">E</kbd></a>
    <a class="zak-menu__item" href="#" role="menuitem">${copyI} Duplicate <kbd class="zak-kbd">D</kbd></a>
    <div class="zak-menu__sep" role="separator"></div>
    <a class="zak-menu__item" href="#" role="menuitem">${settingsI} Settings…</a>
  </div>
</div>`,
        code: `<div class="zak-dropdown" data-zak-dropdown>
  <button class="zak-btn zak-btn--outlined" type="button" data-zak-toggle="dropdown"
          aria-haspopup="menu" aria-expanded="false">Actions ▾</button>
  <div class="zak-dropdown__panel" hidden role="menu" aria-label="Row actions">
    <a class="zak-menu__item" href="#" role="menuitem">Edit <kbd class="zak-kbd">E</kbd></a>
    <a class="zak-menu__item" href="#" role="menuitem">Duplicate <kbd class="zak-kbd">D</kbd></a>
    <div class="zak-menu__sep" role="separator"></div>
    <a class="zak-menu__item" href="#" role="menuitem">Settings…</a>
  </div>
</div>`,
      },
      {
        title: 'Icon trigger, end-aligned',
        desc: 'Edge triggers use `--end` so the panel hugs the container instead of overflowing it.',
        tpl: `<div style="display:flex;justify-content:flex-end;width:100%">
  <div class="zak-dropdown" data-zak-dropdown>
    <button class="zak-btn zak-btn--ghost zak-btn--icon" type="button" data-zak-toggle="dropdown" aria-haspopup="menu" aria-expanded="false" aria-label="More options">${svgIcon('more-h', 'zak-icon', 16)}</button>
    <div class="zak-dropdown__panel zak-dropdown__panel--end" hidden role="menu" aria-label="More options">
      <a class="zak-menu__item" href="#" role="menuitem">Export as CSV</a>
      <a class="zak-menu__item" href="#" role="menuitem">Copy link</a>
      <a class="zak-menu__item" href="#" role="menuitem">Print</a>
    </div>
  </div>
</div>`,
        code: `<div class="zak-dropdown" data-zak-dropdown>
  <button class="zak-btn zak-btn--ghost zak-btn--icon" type="button" data-zak-toggle="dropdown"
          aria-haspopup="menu" aria-expanded="false" aria-label="More options">…</button>
  <div class="zak-dropdown__panel zak-dropdown__panel--end" hidden role="menu" aria-label="More options">
    <a class="zak-menu__item" href="#" role="menuitem">Export as CSV</a>
    <a class="zak-menu__item" href="#" role="menuitem">Copy link</a>
  </div>
</div>`,
      },
      {
        title: 'Destructive item',
        desc: 'Danger items keep the menu semantics and only change colour — never hide the action.',
        tpl: `<div class="zak-dropdown" data-zak-dropdown>
  <button class="zak-btn zak-btn--outlined" type="button" data-zak-toggle="dropdown" aria-haspopup="menu" aria-expanded="false">Row ${chevDown}</button>
  <div class="zak-dropdown__panel" hidden role="menu" aria-label="Row actions">
    <a class="zak-menu__item" href="#" role="menuitem">${editI} Rename</a>
    <div class="zak-menu__sep" role="separator"></div>
    <a class="zak-menu__item" href="#" role="menuitem" style="color:var(--zak-danger-text)">${trashI} Delete <kbd class="zak-kbd">⌫</kbd></a>
  </div>
</div>`,
        code: `<div class="zak-dropdown__panel" hidden role="menu">
  <a class="zak-menu__item" href="#" role="menuitem">Rename</a>
  <div class="zak-menu__sep" role="separator"></div>
  <!-- Danger tone from the text token; role stays menuitem -->
  <a class="zak-menu__item" href="#" role="menuitem" style="color:var(--zak-danger-text)">Delete</a>
</div>`,
      },
    ],
    js: `trigger.addEventListener('click', () => {
  const open = trigger.getAttribute('aria-expanded') === 'true';
  trigger.setAttribute('aria-expanded', String(!open));
  panel.hidden = open;
});

// Close on outside click and on Escape
document.addEventListener('click', (e) => {
  if (!wrapper.contains(e.target)) close();
});`,
    props: [
      ['[data-zak-dropdown]', 'wrapper', '—', 'Anchors the trigger to its panel; the runtime scopes dismiss to it.'],
      ['data-zak-toggle="dropdown"', 'attr', '—', 'Trigger contract: toggles the sibling panel.'],
      ['.zak-dropdown__panel', 'element', '—', 'The panel itself — hidden by default, role="menu" with menuitem children.'],
      ['.zak-dropdown__panel--end', 'modifier', '—', 'Right-aligns the panel under edge triggers.'],
      ['aria-haspopup / aria-expanded', 'attr', '—', 'Announce both the menu type and its open state.'],
    ],
    a11y: {
      keys: [
        ['Enter / Space', 'Opens the menu and focuses the first item.'],
        ['↓ / ↑', 'Moves focus through items, wrapping at the ends.'],
        ['Escape', 'Closes and returns focus to the trigger.'],
      ],
      aria: [
        ['aria-haspopup="menu"', 'Declares the popup type on the trigger.'],
        ['role="menu" / menuitem', 'Reserve for action menus; use links for navigation.'],
      ],
    },
  }),
  dropdown: defineDemo({
    desc: 'The trigger-anchored panel. Hosts either a `role="menu"` list of items with shortcuts, or a richer content surface (form fields, links, one primary action). Panels align to either edge with `--end` and light-dismiss on outside click or Escape.',
    tpl: `<div class="zak-flex" style="justify-content:center">
    <div class="zak-dropdown" data-zak-dropdown>
      <button class="zak-btn zak-btn--filled" type="button" data-zak-toggle="dropdown" aria-expanded="false" aria-haspopup="dialog">Share ${chevDown}</button>
      <div class="zak-dropdown__panel" hidden style="width:21rem">
        <div style="font-weight:var(--zak-weight-semibold);font-size:var(--zak-text-sm);margin-block-end:var(--zak-space-3)">Share document</div>
        <div class="zak-stack zak-stack--md">
          <div class="zak-flex" style="gap:var(--zak-space-2)">
            <input class="zak-input" value="zakui.dev/d/4f31c" readonly aria-label="Share link"/>
            <button class="zak-btn zak-btn--outlined zak-btn--icon" type="button" aria-label="Copy link">${copyI}</button>
          </div>
          <div class="zak-field">
            <label class="zak-label" for="share-access">General access</label>
            <select class="zak-select" id="share-access">
              <option>Restricted — only invited people</option>
              <option selected>Anyone in the workspace</option>
              <option>Anyone with the link</option>
            </select>
          </div>
          <button class="zak-btn zak-btn--filled" type="button" style="width:100%">Copy link</button>
        </div>
      </div>
    </div>
  </div>`,
    codeTpl: `<!-- Wrapper + trigger + panel: the runtime contract in overlays.ts -->
<div class="zak-dropdown" data-zak-dropdown>
  <button class="zak-btn zak-btn--filled" type="button" data-zak-toggle="dropdown"
          aria-expanded="false" aria-haspopup="dialog">Share ▾</button>

  <!-- aria-haspopup="dialog" — a rich panel is a dialog, not a menu -->
  <div class="zak-dropdown__panel" hidden style="width:21rem">
    <div class="zak-stack zak-stack--md">
      <input class="zak-input" value="zakui.dev/d/4f31c" readonly aria-label="Share link"/>
      <button class="zak-btn zak-btn--filled" type="button" style="width:100%">Copy link</button>
    </div>
  </div>
</div>

<!-- .zak-dropdown__panel--end — right-aligns the panel for edge triggers -->
<div class="zak-dropdown">
  <button class="zak-btn zak-btn--outlined" type="button" data-zak-toggle="dropdown" aria-expanded="false">Options</button>
  <div class="zak-dropdown__panel zak-dropdown__panel--end" hidden>…</div>
</div>

<!-- light dismiss: outside click and Esc close; focus returns to the trigger -->`,
    examples: [
      {
        title: 'Share panel',
        desc: 'Read-only link, access select and one primary action inside the panel.',
        tpl: `<div class="zak-dropdown" data-zak-dropdown>
  <button class="zak-btn zak-btn--filled" type="button" data-zak-toggle="dropdown" aria-expanded="false" aria-haspopup="dialog">Share ${chevDown}</button>
  <div class="zak-dropdown__panel" hidden style="width:21rem">
    <div style="font-weight:var(--zak-weight-semibold);font-size:var(--zak-text-sm);margin-block-end:var(--zak-space-3)">Share document</div>
    <div class="zak-stack zak-stack--md">
      <div class="zak-flex" style="gap:var(--zak-space-2)">
        <input class="zak-input" value="zakui.dev/d/4f31c" readonly aria-label="Share link"/>
        <button class="zak-btn zak-btn--outlined zak-btn--icon" type="button" aria-label="Copy link">${copyI}</button>
      </div>
      <div class="zak-field">
        <label class="zak-label" for="ex-share-access">General access</label>
        <select class="zak-select" id="ex-share-access">
          <option>Restricted — only invited people</option>
          <option selected>Anyone in the workspace</option>
          <option>Anyone with the link</option>
        </select>
      </div>
      <button class="zak-btn zak-btn--filled" type="button" style="width:100%">Copy link</button>
    </div>
  </div>
</div>`,
        code: `<div class="zak-dropdown" data-zak-dropdown>
  <button class="zak-btn zak-btn--filled" type="button" data-zak-toggle="dropdown"
          aria-expanded="false" aria-haspopup="dialog">Share ▾</button>

  <!-- Rich panels are dialogs, not menus -->
  <div class="zak-dropdown__panel" hidden style="width:21rem">
    <input class="zak-input" value="zakui.dev/d/4f31c" readonly aria-label="Share link"/>
    <button class="zak-btn zak-btn--filled" type="button" style="width:100%">Copy link</button>
  </div>
</div>`,
      },
      {
        title: 'Filter panel',
        desc: 'Switches and a select compose a filter surface that stays open while the user tunes it.',
        tpl: `<div class="zak-dropdown" data-zak-dropdown>
  <button class="zak-btn zak-btn--outlined" type="button" data-zak-toggle="dropdown" aria-expanded="false" aria-haspopup="dialog">Filters ${chevDown}</button>
  <div class="zak-dropdown__panel" hidden style="width:18rem">
    <div class="zak-stack zak-stack--sm">
      <label class="zak-switch"><input type="checkbox" role="switch" checked/> Only failing runs</label>
      <label class="zak-switch"><input type="checkbox" role="switch"/> Include scheduled</label>
      <div class="zak-field">
        <label class="zak-label" for="ex-filter-env">Environment</label>
        <select class="zak-select" id="ex-filter-env">
          <option>All environments</option>
          <option>Production</option>
          <option>Preview</option>
        </select>
      </div>
    </div>
  </div>
</div>`,
        code: `<div class="zak-dropdown" data-zak-dropdown>
  <button class="zak-btn zak-btn--outlined" type="button" data-zak-toggle="dropdown"
          aria-expanded="false" aria-haspopup="dialog">Filters ▾</button>
  <div class="zak-dropdown__panel" hidden style="width:18rem">
    <label class="zak-switch"><input type="checkbox" role="switch" checked/> Only failing runs</label>
    <label class="zak-switch"><input type="checkbox" role="switch"/> Include scheduled</label>
  </div>
</div>`,
      },
      {
        title: 'End-aligned trigger',
        desc: 'Panels opened near the inline end of a container use `--end` to stay inside it.',
        tpl: `<div style="display:flex;justify-content:flex-end;width:100%">
  <div class="zak-dropdown" data-zak-dropdown>
    <button class="zak-btn zak-btn--text" type="button" data-zak-toggle="dropdown" aria-expanded="false" aria-haspopup="dialog">Options ${chevDown}</button>
    <div class="zak-dropdown__panel zak-dropdown__panel--end" hidden style="width:16rem">
      <div class="zak-stack zak-stack--sm">
        <label class="zak-check"><input type="checkbox" checked/> <span class="zak-check__label">Show timestamps</span></label>
        <label class="zak-check"><input type="checkbox"/> <span class="zak-check__label">Group by service</span></label>
      </div>
    </div>
  </div>
</div>`,
        code: `<div class="zak-dropdown" data-zak-dropdown>
  <button class="zak-btn zak-btn--text" type="button" data-zak-toggle="dropdown" aria-expanded="false">Options ▾</button>
  <div class="zak-dropdown__panel zak-dropdown__panel--end" hidden>…</div>
</div>`,
      },
    ],
    js: `// data-zak-toggle="dropdown" flips the sibling panel and the wrapper state
button.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  panel.hidden = open;
  wrapper.classList.toggle('is-open', !open);
});

// Light dismiss: click outside, or Escape (focus returns to the trigger)
document.addEventListener('click', (e) => {
  if (!wrapper.contains(e.target)) close();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') close();
});`,
    props: [
      ['[data-zak-dropdown]', 'wrapper', '—', 'Scopes the panel, the trigger state and light dismiss.'],
      ['data-zak-toggle="dropdown"', 'attr', '—', 'Toggles the sibling .zak-dropdown__panel.'],
      ['.zak-dropdown__panel', 'element', '—', 'Rich content surface — fields, links, one primary action.'],
      ['aria-haspopup="dialog"', 'attr', '—', 'A rich panel is a dialog, not a menu — announce it correctly.'],
      ['.zak-dropdown__panel--end', 'modifier', '—', 'Right-aligns the panel for edge triggers.'],
      ['light dismiss', 'behaviour', '—', 'Outside click and Esc close; focus returns to the trigger.'],
    ],
    a11y: {
      keys: [
        ['Enter / Space', 'Opens the panel and focuses the first field.'],
        ['Esc', 'Closes and returns focus to the trigger.'],
      ],
      aria: [
        ['aria-expanded', 'Reflects panel visibility on the trigger.'],
        ['aria-haspopup', '"menu" for action lists, "dialog" for rich content panels.'],
      ],
    },
  }),
  breadcrumb: defineDemo({
    desc: 'Hierarchical location trail. Chevron separators are decorative; the final crumb is plain text marked with `aria-current="page"`.',
    tpl: `<nav aria-label="Breadcrumb">
    <ol class="zak-breadcrumb">
      <li><a href="#">Home</a> <span aria-hidden="true" style="display:inline-flex">${chevRight}</span></li>
      <li><a href="#">Data Grid</a> <span aria-hidden="true" style="display:inline-flex">${chevRight}</span></li>
      <li><a href="#">Advanced</a> <span aria-hidden="true" style="display:inline-flex">${chevRight}</span></li>
      <li aria-current="page">Column Resizing</li>
    </ol>
  </nav>`,
    codeTpl: `<!-- Landmark: nav[aria-label="Breadcrumb"] -->
<nav aria-label="Breadcrumb">
  <ol class="zak-breadcrumb">
    <li>
      <a href="#">Home</a>
      <!-- Separator: decorative chevron, aria-hidden -->
      <span aria-hidden="true">›</span>
    </li>
    <!-- Terminal crumb: aria-current="page" -->
    <li aria-current="page">Column Resizing</li>
  </ol>
</nav>`,
    props: [
      ['nav[aria-label="Breadcrumb"]', 'attr', '—', 'Distinguishes it from other nav landmarks.'],
      ['aria-current="page"', 'attr', '—', 'Marks the terminal crumb; it is not a link.'],
      ['separator aria-hidden', 'attr', '—', 'Chevrons are decorative punctuation.'],
    ],
    notes: ['Collapse the middle of long trails to an ellipsis crumb that expands on click.'],
  }),
  tabs: defineDemo({
    desc: 'Underline, pill, enclosed and vertical tab sets with proper tablist semantics. One tab stop, arrow-key traversal, and panels wired via aria-controls.',
    usage: '<div data-zak-tabs>\n  <div class="zak-tabs" role="tablist">\n    <button class="zak-tab is-active" role="tab">Overview</button>\n    <button class="zak-tab" role="tab">Activity</button>\n    <button class="zak-tab" role="tab">Usage</button>\n  </div>\n  <div class="zak-tab-panel" role="tabpanel">…</div>\n  <div class="zak-tab-panel" role="tabpanel" hidden>…</div>\n  <div class="zak-tab-panel" role="tabpanel" hidden>…</div>\n</div>\n\n<!-- Variants: .zak-tabs--pill, .zak-tabs--enclosed, .zak-tabs--v (vertical) -->',
    stage: 'stretch',
    tpl: `<div data-zak-tabs style="width:100%;max-width:36rem">
    <div class="zak-tabs" role="tablist" aria-label="Project views">
      <button class="zak-tab is-active" role="tab" aria-selected="true" aria-controls="tp-1" id="tt-1" tabindex="0" type="button">Overview</button>
      <button class="zak-tab" role="tab" aria-selected="false" aria-controls="tp-2" id="tt-2" tabindex="-1" type="button">Activity <span class="zak-badge zak-badge--counter">3</span></button>
      <button class="zak-tab" role="tab" aria-selected="false" aria-controls="tp-3" id="tt-3" tabindex="-1" type="button">Usage</button>
      <button class="zak-tab" role="tab" aria-selected="false" aria-controls="tp-4" id="tt-4" tabindex="-1" type="button">API <span class="zak-badge zak-badge--danger zak-badge--counter">2</span></button>
    </div>
    <div class="zak-tab-panel" role="tabpanel" id="tp-1" aria-labelledby="tt-1">
      <p style="margin:0">The overview shows deployment health, recent activity and environment status at a glance. Panels are siblings — only the active one is visible.</p>
    </div>
    <div class="zak-tab-panel" role="tabpanel" id="tp-2" aria-labelledby="tt-2" hidden>
      <p style="margin:0">Activity: Marcus approved #4821, Priya commented on “Streaming grids”, Jonas scaled worker-pool.</p>
    </div>
    <div class="zak-tab-panel" role="tabpanel" id="tp-3" aria-labelledby="tt-3" hidden>
      <p style="margin:0">Usage: 82 GB of 200 GB storage, 1.2M of 5M monthly requests.</p>
    </div>
    <div class="zak-tab-panel" role="tabpanel" id="tp-4" aria-labelledby="tt-4" hidden>
      <p style="margin:0">API: two deprecation warnings for v1 endpoints.</p>
    </div>
  </div>
  <div class="zak-tabs zak-tabs--pill" role="tablist" aria-label="Time range" style="margin-block-start:var(--zak-space-6)">
    <button class="zak-tab is-active" role="tab" aria-selected="true" type="button">Day</button>
    <button class="zak-tab" role="tab" aria-selected="false" type="button">Week</button>
    <button class="zak-tab" role="tab" aria-selected="false" type="button">Month</button>
    <button class="zak-tab" role="tab" aria-selected="false" type="button">Year</button>
  </div>`,
    codeTpl: `<!-- Active tab: .zak-tab.is-active -->
<div class="zak-tabs" role="tablist" aria-label="Project views">
  <button class="zak-tab is-active" role="tab" aria-selected="true" aria-controls="tp-1" id="tt-1">Overview</button>
  <button class="zak-tab" role="tab" aria-selected="false" aria-controls="tp-2" id="tt-2">Activity</button>
</div>

<!-- Inactive panels stay mounted: hidden -->
<div class="zak-tab-panel" role="tabpanel" id="tp-1" aria-labelledby="tt-1">…</div>
<div class="zak-tab-panel" role="tabpanel" id="tp-2" aria-labelledby="tt-2" hidden>…</div>

<!-- Pill variant: .zak-tabs--pill -->
<div class="zak-tabs zak-tabs--pill" role="tablist" aria-label="Time range">…</div>

<!-- Enclosed / filled variant: .zak-tabs--enclosed -->
<div class="zak-tabs zak-tabs--enclosed" role="tablist" aria-label="Filters">…</div>

<!-- Vertical variant: .zak-tabs--v + aria-orientation="vertical" -->
<div class="zak-tabs zak-tabs--v" role="tablist" aria-orientation="vertical">…</div>`,
    js: `tablist.addEventListener('keydown', (event) => {
  const i = tabs.indexOf(document.activeElement);
  if (event.key === 'ArrowRight') tabs[(i + 1) % tabs.length].focus();
  if (event.key === 'ArrowLeft') tabs[(i - 1 + tabs.length) % tabs.length].focus();
  if (event.key === 'Home') tabs[0].focus();
  if (event.key === 'End') tabs[tabs.length - 1].focus();
});`,
    examples: [
      {
        title: 'Underline',
        desc: 'The default strip: a 2px brand indicator sits under the active tab.',
        tpl: `<div class="zak-tabs" role="tablist" aria-label="Views">
  <button class="zak-tab is-active" role="tab" aria-selected="true" type="button">Overview</button>
  <button class="zak-tab" role="tab" aria-selected="false" tabindex="-1" type="button">Activity</button>
  <button class="zak-tab" role="tab" aria-selected="false" tabindex="-1" type="button">Usage</button>
</div>`,
        code: `<!-- Default variant — no modifier class -->
<div class="zak-tabs" role="tablist" aria-label="Views">
  <button class="zak-tab is-active" role="tab" aria-selected="true">Overview</button>
  <button class="zak-tab" role="tab" aria-selected="false" tabindex="-1">Activity</button>
  <button class="zak-tab" role="tab" aria-selected="false" tabindex="-1">Usage</button>
</div>`,
      },
      {
        title: 'Pill',
        desc: 'Segmented control on a muted track — the active tab is raised.',
        tpl: `<div class="zak-tabs zak-tabs--pill" role="tablist" aria-label="Time range">
  <button class="zak-tab is-active" role="tab" aria-selected="true" type="button">Day</button>
  <button class="zak-tab" role="tab" aria-selected="false" tabindex="-1" type="button">Week</button>
  <button class="zak-tab" role="tab" aria-selected="false" tabindex="-1" type="button">Month</button>
</div>`,
        code: `<!-- Pill variant: .zak-tabs--pill -->
<div class="zak-tabs zak-tabs--pill" role="tablist" aria-label="Time range">
  <button class="zak-tab is-active" role="tab" aria-selected="true">Day</button>
  <button class="zak-tab" role="tab" aria-selected="false" tabindex="-1">Week</button>
  <button class="zak-tab" role="tab" aria-selected="false" tabindex="-1">Month</button>
</div>`,
      },
      {
        title: 'Enclosed',
        desc: 'Bordered box; the active tab fills with a brand-subtle surface.',
        tpl: `<div class="zak-tabs zak-tabs--enclosed" role="tablist" aria-label="Filters">
  <button class="zak-tab is-active" role="tab" aria-selected="true" type="button">All</button>
  <button class="zak-tab" role="tab" aria-selected="false" tabindex="-1" type="button">Open</button>
  <button class="zak-tab" role="tab" aria-selected="false" tabindex="-1" type="button">Closed</button>
</div>`,
        code: `<!-- Enclosed / filled variant: .zak-tabs--enclosed -->
<div class="zak-tabs zak-tabs--enclosed" role="tablist" aria-label="Filters">
  <button class="zak-tab is-active" role="tab" aria-selected="true">All</button>
  <button class="zak-tab" role="tab" aria-selected="false" tabindex="-1">Open</button>
  <button class="zak-tab" role="tab" aria-selected="false" tabindex="-1">Closed</button>
</div>`,
      },
      {
        title: 'Vertical',
        desc: 'Stacked rail with the indicator on the inline edge, beside its panels.',
        tpl: `<div data-zak-tabs style="display:flex;gap:var(--zak-space-5);align-items:flex-start">
  <div class="zak-tabs zak-tabs--v" role="tablist" aria-orientation="vertical" aria-label="Settings">
    <button class="zak-tab is-active" role="tab" aria-selected="true" aria-controls="ex-vt-1" id="ex-vt-t1" tabindex="0" type="button">General</button>
    <button class="zak-tab" role="tab" aria-selected="false" aria-controls="ex-vt-2" id="ex-vt-t2" tabindex="-1" type="button">Security</button>
    <button class="zak-tab" role="tab" aria-selected="false" aria-controls="ex-vt-3" id="ex-vt-t3" tabindex="-1" type="button">Notifications</button>
  </div>
  <div style="flex:1;min-width:0">
    <div class="zak-tab-panel" role="tabpanel" id="ex-vt-1" aria-labelledby="ex-vt-t1"><p style="margin:0">General settings panel.</p></div>
    <div class="zak-tab-panel" role="tabpanel" id="ex-vt-2" aria-labelledby="ex-vt-t2" hidden><p style="margin:0">Security settings panel.</p></div>
    <div class="zak-tab-panel" role="tabpanel" id="ex-vt-3" aria-labelledby="ex-vt-t3" hidden><p style="margin:0">Notification settings panel.</p></div>
  </div>
</div>`,
        code: `<!-- Vertical variant: .zak-tabs--v + aria-orientation="vertical" -->
<div data-zak-tabs style="display:flex;gap:var(--zak-space-5)">
  <div class="zak-tabs zak-tabs--v" role="tablist" aria-orientation="vertical" aria-label="Settings">
    <button class="zak-tab is-active" role="tab" aria-selected="true" aria-controls="p1" id="t1">General</button>
    <button class="zak-tab" role="tab" aria-selected="false" aria-controls="p2" id="t2" tabindex="-1">Security</button>
    <button class="zak-tab" role="tab" aria-selected="false" aria-controls="p3" id="t3" tabindex="-1">Notifications</button>
  </div>
  <div style="flex:1">
    <div class="zak-tab-panel" role="tabpanel" id="p1" aria-labelledby="t1">…</div>
    <div class="zak-tab-panel" role="tabpanel" id="p2" aria-labelledby="t2" hidden>…</div>
    <div class="zak-tab-panel" role="tabpanel" id="p3" aria-labelledby="t3" hidden>…</div>
  </div>
</div>`,
      },
    ],
    props: [
      ['.zak-tab.is-active', 'class', '—', 'Underline variant: 2px brand indicator slides across.'],
      ['.zak-tabs--pill', 'modifier', '—', 'Segmented control look on a muted track.'],
      ['.zak-tabs--enclosed', 'modifier', '—', 'Bordered box; active tab raised on brand-subtle fill.'],
      ['.zak-tabs--v', 'modifier', '—', 'Vertical rail; indicator moves to the inline edge.'],
      ['hidden on panels', 'attr', '—', 'Inactive panels are hidden, never unmounted.'],
    ],
    a11y: {
      keys: [
        ['← / →', 'Moves between tabs; activation follows focus.'],
        ['Home / End', 'Jumps to the first / last tab.'],
        ['Tab', 'Moves focus from the tab strip into the panel.'],
      ],
      aria: [
        ['role="tablist" / tab / tabpanel', 'Wires the strip and its panels.'],
        ['aria-selected + tabindex', 'Active tab: selected, tabindex 0 — others −1 (roving).'],
        ['aria-controls / aria-labelledby', 'Connects tabs and panels in both directions.'],
      ],
    },
  }),
  pagination: defineDemo({
    desc: 'Page navigation with a truncated window: first, current ±1, last and an ellipsis that hides the middle. The active page carries `aria-current`.',
    tpl: `<div class="zak-stack zak-stack--lg" style="align-items:center">
    <nav class="zak-pagination" aria-label="Search results pages">
      <button class="zak-page-btn" type="button" aria-label="Previous page">${svgIcon('chevron-left', 'zak-icon', 13)}</button>
      <button class="zak-page-btn is-active" type="button" aria-current="page">1</button>
      <button class="zak-page-btn" type="button">2</button>
      <button class="zak-page-btn" type="button">3</button>
      <span class="zak-page-ellipsis">…</span>
      <button class="zak-page-btn" type="button">24</button>
      <button class="zak-page-btn" type="button" aria-label="Next page">${chevRight}</button>
    </nav>
    <nav class="zak-pagination" aria-label="Compact pages">
      <button class="zak-page-btn" type="button" aria-label="Previous page">${svgIcon('chevron-left', 'zak-icon', 13)}</button>
      <span class="zak-page-ellipsis" style="font-size:var(--zak-text-sm)">Page 8 of 24</span>
      <button class="zak-page-btn" type="button" aria-label="Next page">${chevRight}</button>
    </nav>
  </div>`,
    codeTpl: `<nav class="zak-pagination" aria-label="Search results pages">
  <!-- Boundary control: disabled at the ends -->
  <button class="zak-page-btn" type="button" aria-label="Previous page" disabled>‹</button>

  <!-- Active page: .zak-page-btn.is-active -->
  <button class="zak-page-btn is-active" type="button" aria-current="page">1</button>
  <button class="zak-page-btn" type="button">2</button>

  <!-- Truncation window: .zak-page-ellipsis -->
  <span class="zak-page-ellipsis">…</span>
  <button class="zak-page-btn" type="button">24</button>
</nav>`,
    props: [
      ['.zak-page-btn.is-active', 'class', '—', 'Brand fill; pair with aria-current="page".'],
      ['.zak-page-ellipsis', 'element', '—', 'Non-interactive truncation window.'],
      ['disabled', 'attr', '—', 'Boundary chevrons disable, never wrap around.'],
    ],
    notes: ['Window rule of thumb: first, last, current ±1, ellipsis — never more than 7 targets on desktop, 5 on mobile.'],
  }),
  stepper: defineDemo({
    desc: 'Ordered progress through a flow: completed steps fill success with a check, the current step pulses brand, upcoming steps stay hollow. Horizontal and vertical layouts.',
    stage: 'stretch',
    tpl: `<ol class="zak-stepper" style="width:100%;max-width:38rem">
    <li class="zak-step zak-step--done"><span class="zak-step__dot">${checkI}</span><span>Workspace<br/><strong style="font-weight:400;color:var(--zak-text-tertiary)">acme-corp</strong></span></li>
    <li class="zak-step zak-step--done"><span class="zak-step__dot">${checkI}</span><span>Plan<br/><strong style="font-weight:400;color:var(--zak-text-tertiary)">Business</strong></span></li>
    <li class="zak-step zak-step--active" aria-current="step"><span class="zak-step__dot">3</span><span>Invite team<br/><strong style="font-weight:400;color:var(--zak-text-tertiary)">4 of 6 sent</strong></span></li>
    <li class="zak-step"><span class="zak-step__dot">4</span><span>Connect billing</span></li>
  </ol>
  <ol class="zak-stepper zak-stepper--v" style="margin-block-start:var(--zak-space-6);width:20rem" aria-label="Vertical stepper">
    <li class="zak-step zak-step--done"><span class="zak-step__dot">${checkI}</span><span>Draft <span class="zak-hint" style="display:block">Saved 14:02</span></span></li>
    <li class="zak-step zak-step--active" aria-current="step"><span class="zak-step__dot">2</span><span>Review <span class="zak-hint" style="display:block">2 approvers assigned</span></span></li>
    <li class="zak-step"><span class="zak-step__dot">3</span><span>Publish</span></li>
  </ol>`,
    codeTpl: `<!-- Completed step: .zak-step--done -->
<li class="zak-step zak-step--done"><span class="zak-step__dot">✓</span><span>Workspace</span></li>

<!-- Current step: .zak-step--active -->
<li class="zak-step zak-step--active" aria-current="step"><span class="zak-step__dot">3</span><span>Invite team</span></li>

<!-- Vertical layout: .zak-stepper--v -->
<ol class="zak-stepper zak-stepper--v">…</ol>`,
    props: [
      ['.zak-step--done', 'modifier', '—', 'Success dot and connector; content becomes a check.'],
      ['.zak-step--active', 'modifier', '—', 'Brand dot with a 4px halo; pair with aria-current="step".'],
      ['.zak-stepper--v', 'modifier', '—', 'Rows stack; connectors hide, dots align left.'],
    ],
    a11y: {
      aria: [
        ['aria-current="step"', 'Exactly one step carries it.'],
        ['ol > li', 'Order is semantic; no extra roles required.'],
      ],
    },
  }),
  'vertical-navigation': defineDemo({
    desc: 'A grouped settings rail: section titles, icon items with trailing badges, and a single active row. Ideal for account, project and admin areas.',
    tpl: `<nav class="zak-vnav" aria-label="Account settings" style="width:16rem">
    <span class="zak-vnav__title">Account</span>
    <a class="zak-vnav__item" href="#">${svgIcon('user', 'zak-icon', 15)} Profile</a>
    <a class="zak-vnav__item" href="#">${cardI} Billing <span class="zak-badge zak-badge--counter">2</span></a>
    <a class="zak-vnav__item is-active" href="#">${shieldI} Security</a>
    <span class="zak-vnav__title" style="margin-block-start:var(--zak-space-2)">Workspace</span>
    <a class="zak-vnav__item" href="#">${usersI} Members</a>
    <a class="zak-vnav__item" href="#">${settingsI} Preferences</a>
    <a class="zak-vnav__item" href="#">${svgIcon('terminal', 'zak-icon', 15)} Developer <span class="zak-badge zak-badge--ai zak-ai-badge">Beta</span></a>
  </nav>`,
    codeTpl: `<!-- Section title: .zak-vnav__title -->
<span class="zak-vnav__title">Account</span>

<!-- Active row: .zak-vnav__item.is-active -->
<a class="zak-vnav__item is-active" href="#">Security</a>

<!-- Trailing badge: .zak-badge -->
<a class="zak-vnav__item" href="#">Billing <span class="zak-badge zak-badge--counter">2</span></a>`,
    props: [
      ['.zak-vnav__title', 'element', '—', 'Uppercase group label; reuse per section.'],
      ['.zak-vnav__item.is-active', 'class', '—', 'Brand-subtle row with semibold text.'],
      ['.zak-badge', 'element', '—', 'Trailing badge pushed right automatically.'],
    ],
  }),
  'anchor-navigation': defineDemo({
    desc: 'In-page section rail with scroll-spy. The active link grows a brand edge on the left; clicks smooth-scroll and update the URL hash.',
    tpl: `<nav class="zak-anchor-nav" aria-label="On this page" style="width:13rem" data-zak-anchors>
    <span class="zak-vnav__title">On this page</span>
    <a class="zak-anchor-nav__link is-active" href="#overview" aria-current="true">Overview</a>
    <a class="zak-anchor-nav__link" href="#demo">Demo</a>
    <a class="zak-anchor-nav__link" href="#usage">Usage</a>
    <a class="zak-anchor-nav__link" href="#props">Props API</a>
    <a class="zak-anchor-nav__link" href="#accessibility">Accessibility</a>
  </nav>`,
    codeTpl: `<!-- Active link: .zak-anchor-nav__link.is-active -->
<nav class="zak-anchor-nav" aria-label="On this page" data-zak-anchors>
  <a class="zak-anchor-nav__link is-active" href="#overview" aria-current="true">Overview</a>
  <a class="zak-anchor-nav__link" href="#demo">Demo</a>
</nav>

<!-- Scroll-spy: IntersectionObserver with a reading band (see JS) -->
<!-- Smooth scrolling: html { scroll-behavior: smooth } -->`,
    js: `// Scroll-spy: highlight the section owning the viewport band
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((link) => {
      const active = link.hash === '#' + entry.target.id;
      link.classList.toggle('is-active', active);
      link.toggleAttribute('aria-current', active);
    });
  });
}, { rootMargin: '-20% 0px -70% 0px' });

sections.forEach((section) => observer.observe(section));`,
    props: [
      ['.zak-anchor-nav__link.is-active', 'class', '—', 'Brand text + 2px leading border.'],
      ['IntersectionObserver', 'api', '—', 'rootMargin shapes a reading band, not raw visibility.'],
      ['scroll-behavior: smooth', 'css', '—', 'Respect prefers-reduced-motion before enabling.'],
    ],
  }),
};
