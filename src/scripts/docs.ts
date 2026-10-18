/**
 * Docs chrome — mobile navigation, sidebar filtering + collapsible sections,
 * the Ctrl/Cmd+K search dialog, code tabs, copy buttons and TOC scroll-spy.
 */
import { copyText } from './dom';

/* ---- Mobile navigation ---------------------------------------------------- */

const sidebar = document.querySelector<HTMLElement>('[data-docs-sidebar]');
const scrim = document.querySelector<HTMLElement>('[data-docs-scrim]');
const menuButton = document.querySelector<HTMLElement>('[data-docs-menu]');

function setNav(open: boolean): void {
  sidebar?.classList.toggle('is-open', open);
  scrim?.classList.toggle('is-open', open);
  menuButton?.setAttribute('aria-expanded', String(open));
  menuButton?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}

menuButton?.addEventListener('click', () => {
  setNav(!sidebar?.classList.contains('is-open'));
});
scrim?.addEventListener('click', () => setNav(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setNav(false);
});
sidebar?.addEventListener('click', (event) => {
  if (
    event.target instanceof Element &&
    event.target.closest('a') &&
    window.matchMedia('(max-width: 960px)').matches
  ) {
    setNav(false);
  }
});

/* ---- Sidebar sections ------------------------------------------------------ */

const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-docs-section]'));
const COLLAPSED_KEY = 'zak-nav-collapsed';

let collapsed: string[] = [];
try {
  const raw: unknown = JSON.parse(localStorage.getItem(COLLAPSED_KEY) ?? '[]');
  if (Array.isArray(raw)) collapsed = raw.filter((item): item is string => typeof item === 'string');
} catch {
  collapsed = [];
}

function persistCollapsed(): void {
  try {
    localStorage.setItem(COLLAPSED_KEY, JSON.stringify(collapsed));
  } catch {
    /* ignore */
  }
}

function setSectionCollapsed(section: HTMLElement, value: boolean, persist: boolean): void {
  section.dataset.collapsed = String(value);
  section.querySelector('[data-docs-section-toggle]')?.setAttribute('aria-expanded', String(!value));
  if (!persist) return;
  const slug = section.dataset.docsSection ?? '';
  collapsed = collapsed.filter((item) => item !== slug);
  if (value) collapsed.push(slug);
  persistCollapsed();
}

sections.forEach((section) => {
  const slug = section.dataset.docsSection ?? '';
  setSectionCollapsed(section, collapsed.includes(slug), false);
  section.querySelector('[data-docs-section-toggle]')?.addEventListener('click', () => {
    setSectionCollapsed(section, section.dataset.collapsed !== 'true', true);
  });
});

// Keep the active link centred when the sidebar has its own scroll.
const activeLink = sidebar?.querySelector<HTMLElement>('.sbx-link.is-active');
if (sidebar && activeLink) {
  sidebar.scrollTop = Math.max(0, activeLink.offsetTop - sidebar.clientHeight / 2);
}

/* ---- Sidebar filter --------------------------------------------------------- */

const filter = document.querySelector<HTMLInputElement>('[data-docs-filter]');
const emptyNote = document.querySelector<HTMLElement>('[data-docs-empty]');

filter?.addEventListener('input', () => {
  const query = filter.value.trim().toLowerCase();
  let anyVisible = false;

  for (const section of sections) {
    let visible = 0;
    section.querySelectorAll<HTMLElement>('.sbx-link').forEach((link) => {
      const haystack = (link.dataset.search ?? link.textContent ?? '').toLowerCase();
      const match = !query || haystack.includes(query);
      link.classList.toggle('zak-hidden', !match);
      if (match) visible += 1;
    });

    section.classList.toggle('zak-hidden', visible === 0);
    if (visible > 0) anyVisible = true;

    if (query) {
      // Matching sections expand; the user's own collapse state is preserved
      // in the background and restored when the filter clears.
      section.dataset.collapsed = 'false';
      section.querySelector('[data-docs-section-toggle]')?.setAttribute('aria-expanded', 'true');
    } else {
      setSectionCollapsed(section, collapsed.includes(section.dataset.docsSection ?? ''), false);
    }
  }

  emptyNote?.classList.toggle('zak-hidden', anyVisible);
});

filter?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && filter.value) {
    filter.value = '';
    filter.dispatchEvent(new Event('input'));
  }
});

/* ---- Code tabs + copy --------------------------------------------------------- */

document.querySelectorAll<HTMLElement>('[data-code]').forEach((code) => {
  const tabs = Array.from(code.querySelectorAll<HTMLElement>('[data-code-tab]'));
  const panels = Array.from(code.querySelectorAll<HTMLElement>('[data-code-panel]'));
  if (!tabs.length) return;

  const activate = (index: number): void => {
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    panels.forEach((panel, i) => panel.classList.toggle('is-active', i === index));
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index));
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const next =
        event.key === 'ArrowRight'
          ? (index + 1) % tabs.length
          : (index - 1 + tabs.length) % tabs.length;
      activate(next);
      tabs[next]?.focus();
    });
  });
});

document.addEventListener('click', (event) => {
  const button =
    event.target instanceof Element ? event.target.closest<HTMLElement>('[data-copy]') : null;
  if (!button) return;

  const code = button.closest('[data-code]');
  const panel = code?.querySelector<HTMLElement>('[data-code-panel].is-active');
  const source = (panel?.querySelector('code')?.textContent ?? '').trim();
  if (!source) return;

  void copyText(source).then((ok) => {
    if (!ok) return;
    const label = button.querySelector<HTMLElement>('[data-copy-label]');
    button.classList.add('is-done');
    if (label) label.textContent = 'Copied!';
    window.setTimeout(() => {
      button.classList.remove('is-done');
      if (label) label.textContent = 'Copy';
    }, 1600);
  });
});

/* ---- TOC scroll-spy ------------------------------------------------------------- */

const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'));
if (tocLinks.length) {
  const targets = tocLinks
    .map((link) => document.getElementById(link.dataset.tocLink ?? ''))
    .filter((element): element is HTMLElement => element !== null);

  let ticking = false;
  const spy = (): void => {
    ticking = false;
    let current: HTMLElement | undefined = targets[0];
    for (const target of targets) {
      if (target.getBoundingClientRect().top <= 140) current = target;
    }
    tocLinks.forEach((link) =>
      link.classList.toggle('is-active', link.dataset.tocLink === current?.id),
    );
  };

  document.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(spy);
    },
    { passive: true },
  );
  spy();
}

/* ---- Search dialog --------------------------------------------------------------- */

interface IndexEntry {
  n: string;
  s: string;
  c: string;
  cn: string;
  d: string;
  k: string;
  /** Explicit href for entries that do not live under /docs/{category}/{slug}/ (guide pages). */
  u?: string;
}

const dialog = document.querySelector<HTMLDialogElement>('[data-docs-search]');
const searchInput = document.querySelector<HTMLInputElement>('[data-docs-search-input]');
const resultsBox = document.querySelector<HTMLElement>('[data-docs-search-results]');
const indexScript = document.querySelector<HTMLScriptElement>('[data-docs-search-index]');

let searchIndex: IndexEntry[] = [];
try {
  const parsed: unknown = JSON.parse(indexScript?.textContent ?? '[]');
  if (Array.isArray(parsed)) searchIndex = parsed as IndexEntry[];
} catch {
  searchIndex = [];
}

let activeIndex = 0;

function resultItems(): HTMLAnchorElement[] {
  return Array.from(resultsBox?.querySelectorAll<HTMLAnchorElement>('.docs-search__item') ?? []);
}

function syncActiveItem(): void {
  const items = resultItems();
  items.forEach((item, i) => item.classList.toggle('is-active', i === activeIndex));
  items[activeIndex]?.scrollIntoView({ block: 'nearest' });
}

function renderResults(query: string): void {
  if (!resultsBox) return;
  resultsBox.replaceChildren();
  activeIndex = 0;

  const q = query.trim().toLowerCase();
  const matches = q
    ? searchIndex
        .filter((entry) => `${entry.n} ${entry.cn} ${entry.k} ${entry.d}`.toLowerCase().includes(q))
        .slice(0, 24)
    : searchIndex.slice(0, 10);

  const group = document.createElement('div');
  group.className = 'docs-search__group';
  group.textContent = q
    ? `${matches.length} match${matches.length === 1 ? '' : 'es'}`
    : 'Popular components';
  resultsBox.append(group);

  if (!matches.length) {
    const empty = document.createElement('p');
    empty.className = 'sbx-empty';
    empty.textContent = 'Nothing matches — try “grid”, “prompt” or “picker”.';
    resultsBox.append(empty);
    return;
  }

  for (const entry of matches) {
    const link = document.createElement('a');
    link.className = 'docs-search__item';
    link.href = entry.u ?? `/docs/${entry.c}/${entry.s}/`;

    const name = document.createElement('span');
    name.textContent = entry.n;

    const desc = document.createElement('small');
    desc.textContent = entry.d;

    const cat = document.createElement('span');
    cat.className = 'docs-search__cat';
    cat.textContent = entry.cn;

    link.append(name, desc, cat);
    // In-page anchors (used by the standalone single-page build) should dismiss
    // the dialog after navigating; routed pages navigate away and never fire this.
    if (link.href.includes('#')) link.addEventListener('click', () => dialog?.close());
    resultsBox.append(link);
  }

  syncActiveItem();
}

function openSearch(): void {
  if (!dialog) return;
  if (!dialog.open) dialog.showModal();
  if (searchInput) {
    searchInput.value = '';
    renderResults('');
    searchInput.focus();
  }
}

document.querySelectorAll('[data-docs-search-open]').forEach((trigger) => {
  trigger.addEventListener('click', openSearch);
});

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openSearch();
  }
});

searchInput?.addEventListener('input', () => renderResults(searchInput.value));

searchInput?.addEventListener('keydown', (event) => {
  const items = resultItems();
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if (!items.length) return;
    activeIndex =
      event.key === 'ArrowDown'
        ? (activeIndex + 1) % items.length
        : (activeIndex - 1 + items.length) % items.length;
    syncActiveItem();
  }
  if (event.key === 'Enter') {
    const item = items[activeIndex];
    if (item) {
      event.preventDefault();
      item.click();
    }
  }
});

dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

dialog?.addEventListener('close', () => {
  document.querySelector<HTMLElement>('[data-docs-search-open]')?.focus();
});
