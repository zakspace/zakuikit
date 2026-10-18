/**
 * ZAKUIKit — Global Behavior Runtime
 *
 * ALL interactive behavior uses document-level event delegation.
 * Components work on dynamically injected HTML without re-initialization.
 * No `data-zak-ready` guards — every listener uses `closest()` to find its target.
 */
import { setHtml } from './dom';
import { svgIcon } from '../data/icons';

function elementOf(node: EventTarget | null): HTMLElement | null {
  if (node instanceof HTMLElement) return node;
  /* Clicks land on the deepest child — an <svg> icon or its <path> is an SVGElement,
     not an HTMLElement, so resolve it to the nearest HTML ancestor instead of
     dropping the event (this is why icon buttons needed a second click). */
  if (node instanceof Element) return node.closest('svg')?.parentElement ?? null;
  return null;
}

/* -------------------------------------------------------------------------- toasts */

interface ToastOptions {
  duration?: number;
  desc?: string;
}

const TOAST_TONES: Record<string, { icon: string; role: 'status' | 'alert' }> = {
  default: { icon: 'info', role: 'status' },
  info: { icon: 'info', role: 'status' },
  success: { icon: 'check-circle', role: 'status' },
  warning: { icon: 'alert-triangle', role: 'status' },
  danger: { icon: 'alert-circle', role: 'alert' },
};

function toastRegion(): HTMLElement {
  let region = document.querySelector<HTMLElement>('.zak-toast-region');
  if (!region) {
    region = document.createElement('div');
    region.className = 'zak-toast-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-label', 'Notifications');
    document.body.append(region);
  }
  return region;
}

function dismissToast(toast: HTMLElement): void {
  if (toast.classList.contains('is-leaving')) return;
  toast.classList.add('is-leaving');
  toast.addEventListener('animationend', () => toast.remove(), { once: true });
  window.setTimeout(() => toast.remove(), 600);
}

/**
 * Fire a transient toast — Bootstrap-style contract: 5s autohide by default,
 * the countdown pauses while the toast is hovered or focused, `duration: 0`
 * pins it until dismissed. Exposed publicly as ZAKUI.toast(title, tone, opts).
 */
export function toast(title: string, tone = 'default', { duration = 5000, desc }: ToastOptions = {}): void {
  const spec = TOAST_TONES[tone] ?? TOAST_TONES.default;
  const el = document.createElement('div');
  el.className = `zak-toast${tone !== 'default' ? ` zak-toast--${tone}` : ''}`;
  el.setAttribute('role', spec.role);

  const icon = document.createElement('span');
  icon.className = 'zak-toast__icon';
  setHtml(icon, svgIcon(spec.icon, 'zak-icon', 16));

  const body = document.createElement('div');
  body.className = 'zak-toast__body';
  const titleEl = document.createElement('div');
  titleEl.className = 'zak-toast__title';
  titleEl.textContent = title;
  body.append(titleEl);
  if (desc) {
    const descEl = document.createElement('div');
    descEl.className = 'zak-toast__desc';
    descEl.textContent = desc;
    body.append(descEl);
  }

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'zak-toast__close';
  close.setAttribute('aria-label', 'Dismiss');
  close.setAttribute('data-zak-dismiss', '');
  setHtml(close, svgIcon('x', 'zak-icon', 13));

  el.append(icon, body, close);
  toastRegion().append(el);

  if (duration > 0) {
    let remaining = duration;
    let started = Date.now();
    let timer = window.setTimeout(() => dismissToast(el), remaining);
    const pause = (): void => {
      window.clearTimeout(timer);
      remaining -= Date.now() - started;
    };
    const resume = (): void => {
      started = Date.now();
      if (remaining > 0) timer = window.setTimeout(() => dismissToast(el), remaining);
    };
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', resume);
  }
}

/* --------------------------------------------------------- dismiss & close */

document.addEventListener('click', (event) => {
  const button = elementOf(event.target)?.closest('[data-zak-dismiss]');
  if (!button) return;
  const host = button.closest<HTMLElement>('.zak-toast, .zak-alert, .zak-banner');
  if (!host) return;
  if (host.classList.contains('zak-toast')) dismissToast(host);
  else host.remove();
});

/* --------------------------------------------------- attribute-fired toasts */
/* Any button can raise a toast with zero inline JavaScript — the attribute
   carries the title, the optional modifiers carry tone, description and life. */
document.addEventListener('click', (event) => {
  const button = elementOf(event.target)?.closest<HTMLElement>('[data-zak-toast]');
  if (!button) return;
  const duration = button.getAttribute('data-zak-toast-duration');
  toast(
    button.getAttribute('data-zak-toast') ?? 'Notification',
    button.getAttribute('data-zak-toast-tone') ?? 'default',
    {
      desc: button.getAttribute('data-zak-toast-desc') ?? undefined,
      duration: duration === null ? 5000 : Number(duration),
    },
  );
});

/* ======================================================================== snackbar */

interface SnackbarOptions {
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

function snackbarRegion(): HTMLElement {
  let region = document.querySelector<HTMLElement>('.zak-snackbar-region');
  if (!region) {
    region = document.createElement('div');
    region.className = 'zak-snackbar-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-label', 'Notifications');
    document.body.append(region);
  }
  return region;
}

function dismissSnackbar(el: HTMLElement): void {
  if (el.classList.contains('is-leaving')) return;
  el.classList.add('is-leaving');
  el.addEventListener('animationend', () => el.remove(), { once: true });
  window.setTimeout(() => el.remove(), 600);
}

/**
 * Show a snackbar — a single bottom-centred message with one optional action,
 * auto-dismissing after `duration` (pause on hover/focus, `0` pins it).
 */
export function snackbar(message: string, { actionLabel, onAction, duration = 4000 }: SnackbarOptions = {}): void {
  const el = document.createElement('div');
  el.className = 'zak-snackbar';
  el.setAttribute('role', 'status');

  const text = document.createElement('span');
  text.className = 'zak-snackbar__msg';
  text.textContent = message;
  el.append(text);

  if (actionLabel) {
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'zak-btn zak-btn--link zak-btn--sm';
    action.textContent = actionLabel;
    action.addEventListener('click', () => {
      if (onAction) onAction();
      else
        document.dispatchEvent(
          new CustomEvent('zak:snackbar-action', { detail: { message, action: actionLabel } }),
        );
      dismissSnackbar(el);
    });
    el.append(action);
  }

  snackbarRegion().append(el);

  if (duration > 0) {
    let remaining = duration;
    let started = Date.now();
    let timer = window.setTimeout(() => dismissSnackbar(el), remaining);
    el.addEventListener('mouseenter', () => {
      window.clearTimeout(timer);
      remaining -= Date.now() - started;
    });
    el.addEventListener('mouseleave', () => {
      started = Date.now();
      if (remaining > 0) timer = window.setTimeout(() => dismissSnackbar(el), remaining);
    });
    el.addEventListener('focusin', () => {
      window.clearTimeout(timer);
      remaining -= Date.now() - started;
    });
    el.addEventListener('focusout', () => {
      started = Date.now();
      if (remaining > 0) timer = window.setTimeout(() => dismissSnackbar(el), remaining);
    });
  }
}

/* Attribute contract: fires the snackbar without any inline JavaScript. */
document.addEventListener('click', (event) => {
  const button = elementOf(event.target)?.closest<HTMLElement>('[data-zak-snackbar]');
  if (!button) return;
  snackbar(button.getAttribute('data-zak-snackbar') ?? '', {
    actionLabel: button.getAttribute('data-zak-snackbar-action') ?? undefined,
    duration: Number(button.getAttribute('data-zak-snackbar-duration') ?? 4000),
  });
});

/* ------------------------------------------------- range inputs (fill sync) */

function syncRange(input: HTMLInputElement): void {
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const pct = max === min ? 0 : ((Number(input.value) - min) / (max - min)) * 100;
  input.style.setProperty('--zak-range-fill', `${pct}%`);
}

/* ------------------------------------------------------- delegated clicks */

function activateTab(tab: HTMLElement): void {
  const list = tab.closest('[role="tablist"]');
  if (!list) return;
  const tabs = Array.from(list.querySelectorAll<HTMLElement>('.zak-tab[role="tab"]'));
  for (const item of tabs) {
    const active = item === tab;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  }
  const root = tab.closest('[data-zak-tabs]');
  if (!root) return;
  const target = tab.getAttribute('aria-controls');
  root.querySelectorAll<HTMLElement>('.zak-tab-panel').forEach((panel) => {
    panel.hidden = panel.id !== target;
  });
}

function selectPage(button: HTMLButtonElement): void {
  const nav = button.closest('.zak-pagination');
  if (!nav || !/^\d+$/.test(button.textContent.trim())) return;
  nav.querySelectorAll<HTMLElement>('.zak-page-btn').forEach((item) => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    if (item instanceof HTMLButtonElement) {
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    }
  });
}

function handleTreeLabel(label: Element): void {
  const item = label.closest('li[role="treeitem"]');
  if (item) {
    const expanded = item.getAttribute('aria-expanded');
    if (expanded !== null) {
      const open = expanded === 'true';
      item.setAttribute('aria-expanded', String(!open));
      const group = item.querySelector(':scope > ul[role="group"]');
      if (group instanceof HTMLElement) group.hidden = open;
    }
  }
  label.closest('[data-zak-tree]')?.querySelectorAll('.zak-tree__label').forEach((candidate) => {
    candidate.classList.toggle('is-active', candidate === label);
  });
}

function applyRating(star: Element): void {
  const root = star.closest('[data-zak-rating]');
  if (!root) return;
  const stars = Array.from(root.querySelectorAll<HTMLElement>('.zak-rating__star'));
  const index = stars.indexOf(star as HTMLElement);
  if (index < 0) return;
  stars.forEach((item, i) => item.classList.toggle('is-on', i <= index));
  root.setAttribute('aria-label', `Rated ${index + 1} out of 5`);
  const readout = root.querySelector('[data-rating-value]');
  if (readout) readout.textContent = `${index + 1}.0`;
}

function applyTableSort(button: HTMLButtonElement): void {
  const table = button.closest<HTMLTableElement>('table');
  const header = button.closest('th');
  if (!table || !header || !button.closest('[data-zak-table-sort]')) return;
  const dir = button.getAttribute('data-dir') === 'asc' ? 'desc' : 'asc';
  table.querySelectorAll('th[aria-sort]').forEach((th) => th.removeAttribute('aria-sort'));
  table.querySelectorAll('.zak-table__sort').forEach((other) => {
    if (other !== button) other.removeAttribute('data-dir');
  });
  button.setAttribute('data-dir', dir);
  header.setAttribute('aria-sort', dir === 'asc' ? 'ascending' : 'descending');

  const tbody = table.tBodies[0];
  if (!tbody) return;
  const column = header.cellIndex;
  const units: HTMLTableRowElement[][] = [];
  const rows = Array.from(tbody.rows).filter((row) => !row.classList.contains('zak-table__detail-row'));
  for (const row of rows) {
    const detail = row.nextElementSibling;
    if (detail instanceof HTMLTableRowElement && detail.classList.contains('zak-table__detail-row')) {
      units.push([row, detail]);
    } else {
      units.push([row]);
    }
  }
  const textOf = (row: HTMLTableRowElement): string => (row.cells[column]?.textContent ?? '').trim();
  const metric = (text: string): number => {
    const duration = /^(\d+)m\s*(\d+)s$/.exec(text);
    if (duration) return Number(duration[1]) * 60 + Number(duration[2]);
    return Number(text.replace(/[^0-9.-]+/g, ''));
  };
  const numeric = units.length > 0 && units.every(([row]) => {
    const text = textOf(row);
    return text !== '' && /\d/.test(text) && Number.isFinite(metric(text));
  });
  const sign = dir === 'asc' ? 1 : -1;
  units.sort((a, b) => {
    const left = textOf(a[0]);
    const right = textOf(b[0]);
    if (numeric) return (metric(left) - metric(right)) * sign;
    return left.localeCompare(right, undefined, { numeric: true }) * sign;
  });
  const fragment = document.createDocumentFragment();
  for (const unit of units) for (const row of unit) fragment.append(row);
  tbody.append(fragment);
}

function toggleTableRow(button: HTMLButtonElement): void {
  const detail = button.closest('tr')?.nextElementSibling;
  if (!(detail instanceof HTMLTableRowElement) || !detail.classList.contains('zak-table__detail-row')) return;
  const open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  button.classList.toggle('is-open', !open);
  detail.hidden = open;
  const label = button.getAttribute('aria-label') ?? '';
  if (label.startsWith('Expand')) button.setAttribute('aria-label', label.replace(/^Expand/, 'Collapse'));
  else if (label.startsWith('Collapse')) button.setAttribute('aria-label', label.replace(/^Collapse/, 'Expand'));
}

/** Recompute visibility from the rail of parent states: a row is hidden when any
    ancestor row is collapsed, so nested collapse choices are preserved. */
function syncTreeRows(rows: HTMLTableRowElement[]): void {
  const stack: Array<{ level: number; open: boolean }> = [];
  for (const row of rows) {
    const level = Number(row.dataset.level ?? 0);
    while (stack.length > 0 && stack[stack.length - 1].level >= level) stack.pop();
    row.hidden = stack.some((frame) => !frame.open);
    if (row.hasAttribute('aria-expanded')) stack.push({ level, open: row.getAttribute('aria-expanded') === 'true' });
  }
}

/** Collapse a tree row: hide exactly the descendants, i.e. the following rows
    whose `data-level` is deeper than this row's. The caret turns with CSS. */
function toggleTreeTableRow(row: HTMLTableRowElement): void {
  const cell = row.cells[0];
  const toggle = cell?.querySelector<HTMLElement>('.zak-table__toggle');
  if (!toggle) return;
  const open = row.getAttribute('aria-expanded') !== 'false';
  row.setAttribute('aria-expanded', String(!open));
  const body = row.parentElement;
  if (body) syncTreeRows(Array.from(body.querySelectorAll<HTMLTableRowElement>('tr[data-level]')));
  const label = toggle.getAttribute('aria-label') ?? '';
  if (label.startsWith('Expand')) toggle.setAttribute('aria-label', label.replace(/^Expand/, 'Collapse'));
  else if (label.startsWith('Collapse')) toggle.setAttribute('aria-label', label.replace(/^Collapse/, 'Expand'));
}

function toggleReveal(button: HTMLButtonElement): void {
  const input = button.parentElement?.querySelector('input');
  if (!(input instanceof HTMLInputElement)) return;
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
}

/* --------------------------------------------------- navbar responsive menu */

function closeNavbar(bar: HTMLElement): void {
  if (!bar.classList.contains('is-open')) return;
  bar.classList.remove('is-open');
  bar.querySelector('[data-zak-navbar-toggle]')?.setAttribute('aria-expanded', 'false');
}

/* Clicking a link inside the collapsed menu puts the bar away. */
document.addEventListener('click', (event) => {
  const bar = elementOf(event.target)?.closest<HTMLAnchorElement>('.zak-navbar__link')
    ?.closest<HTMLElement>('.zak-navbar');
  if (bar) closeNavbar(bar);
});

/* Escape and any outside press dismiss the open menu. */
document.addEventListener('pointerdown', (event) => {
  const target = elementOf(event.target);
  document.querySelectorAll<HTMLElement>('.zak-navbar.is-open').forEach((bar) => {
    if (!target || !bar.contains(target)) closeNavbar(bar);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const bar = elementOf(event.target)?.closest<HTMLElement>('.zak-navbar.is-open');
  if (!bar) return;
  closeNavbar(bar);
  bar.querySelector<HTMLElement>('[data-zak-navbar-toggle]')?.focus();
});

/* ========================================================================
   SINGLE DOCUMENT-LEVEL CLICK HANDLER
   All interactive patterns use closest() — works on dynamic content.
   ======================================================================== */

document.addEventListener('click', (event) => {
  const target = elementOf(event.target);
  if (!target) return;

  /* Sidebar groups */
  const sidebarToggle = target.closest('.zak-sidebar__toggle');
  if (sidebarToggle) {
    const open = sidebarToggle.getAttribute('aria-expanded') === 'true';
    sidebarToggle.setAttribute('aria-expanded', String(!open));
    const links = sidebarToggle.nextElementSibling;
    if (links instanceof HTMLElement) links.hidden = open;
    return;
  }

  /* Navbar toggler — reveals the collapsed link column on narrow bars */
  const navbarToggle = target.closest<HTMLButtonElement>('[data-zak-navbar-toggle]');
  if (navbarToggle) {
    const bar = navbarToggle.closest<HTMLElement>('.zak-navbar');
    if (bar) {
      const open = bar.classList.toggle('is-open');
      navbarToggle.setAttribute('aria-expanded', String(open));
    }
    return;
  }

  /* Tabs — underline tabsets and pill toggles */
  const tab = target.closest<HTMLElement>('.zak-tab[role="tab"]');
  if (tab) {
    activateTab(tab);
    return;
  }

  /* Anchor navigation rail */
  const anchor = target.closest<HTMLAnchorElement>('[data-zak-anchors] a[href^="#"]');
  if (anchor) {
    event.preventDefault();
    anchor.closest('[data-zak-anchors]')?.querySelectorAll<HTMLElement>('.zak-anchor-nav__link').forEach((item) => {
      const active = item === anchor;
      item.classList.toggle('is-active', active);
      if (active) item.setAttribute('aria-current', 'true');
      else item.removeAttribute('aria-current');
    });
    const id = (anchor.getAttribute('href') ?? '').slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  /* Pagination */
  const pageBtn = target.closest<HTMLButtonElement>('.zak-page-btn');
  if (pageBtn && !pageBtn.disabled) {
    selectPage(pageBtn);
    return;
  }

  /* Tree view */
  const treeLabel = target.closest('.zak-tree__label');
  if (treeLabel) {
    handleTreeLabel(treeLabel);
    return;
  }

  /* Toolbar toggle tools */
  const toggler = target.closest<HTMLButtonElement>('[data-zak-toggleable]');
  if (toggler) {
    const pressed = toggler.getAttribute('aria-pressed') === 'true' || toggler.classList.contains('is-active');
    toggler.classList.toggle('is-active', !pressed);
    toggler.setAttribute('aria-pressed', String(!pressed));
    return;
  }

  /* Chip removal + interactive chips */
  const chipX = target.closest('.zak-chip__x');
  if (chipX) {
    chipX.closest('[data-zak-chip]')?.remove();
    return;
  }
  const chip = target.closest<HTMLButtonElement>('.zak-chip--interactive');
  if (chip) {
    const pressed = chip.getAttribute('aria-pressed') === 'true';
    chip.setAttribute('aria-pressed', String(!pressed));
    chip.classList.toggle('is-active', !pressed);
    return;
  }

  /* Star rating */
  const star = target.closest('.zak-rating__star');
  if (star) {
    applyRating(star);
    return;
  }

  /* Sortable tables */
  const sortBtn = target.closest<HTMLButtonElement>('.zak-table__sort');
  if (sortBtn) {
    applyTableSort(sortBtn);
    return;
  }

  /* Expandable table rows */
  const expand = target.closest<HTMLButtonElement>('.zak-table__expand');
  if (expand) {
    toggleTableRow(expand);
    return;
  }

  /* Tree table — parent rows toggle their indent children */
  const treeWrap = target.closest('[data-zak-table-tree]');
  if (treeWrap) {
    const row = target.closest('tr');
    const cell = target.closest('td');
    if (row instanceof HTMLTableRowElement && cell && cell === row.cells[0]) toggleTreeTableRow(row);
    return;
  }

  /* Table filter reset */
  const reset = target.closest('button');
  if (reset && reset.textContent.trim() === 'Reset') {
    const scope: ParentNode = reset.closest('.doc-demo__stage') ?? document;
    if (scope.querySelector('[data-zak-filter-count]')) {
      scope.querySelectorAll<HTMLElement>('[data-zak-table-filter]').forEach((control) => {
        if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement) control.value = '';
      });
      applyTableFilter(reset);
      return;
    }
  }

  /* Password reveal */
  const reveal = target.closest<HTMLButtonElement>('[data-zak-reveal]');
  if (reveal) {
    toggleReveal(reveal);
    return;
  }

  /* Autocomplete / Combobox — click outside to close */
  if (!target.closest('[data-zak-autocomplete]')) {
    document.querySelectorAll<HTMLElement>('[data-zak-autocomplete]').forEach((root) => {
      const list = root.querySelector<HTMLElement>('.zak-combo__list');
      if (list && !list.hidden) {
        list.hidden = true;
        (root.querySelector('button.zak-select') ?? root.querySelector('input[role="combobox"]'))?.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Tags input — click on tag remove button */
  const tagX = target.closest('.zak-tag__x');
  if (tagX) {
    tagX.closest('.zak-tag')?.remove();
    return;
  }

  /* Repeater — add/remove rows */
  const repeaterAdd = target.closest('[data-repeater-add]');
  if (repeaterAdd) {
    const root = repeaterAdd.closest('[data-zak-repeater]');
    const list = root?.querySelector<HTMLElement>('[data-repeater-list]');
    if (list) {
      const last = list.lastElementChild;
      if (last) {
        const row = last.cloneNode(true) as HTMLElement;
        row.querySelectorAll('input, textarea').forEach((field) => {
          if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.value = '';
        });
        row.querySelectorAll('select').forEach((field) => {
          if (field instanceof HTMLSelectElement) field.selectedIndex = 0;
        });
        list.append(row);
        row.querySelector('input')?.focus();
      }
    }
    return;
  }
  const repeaterRemove = target.closest('[data-repeater-remove]');
  if (repeaterRemove) {
    const list = repeaterRemove.closest('[data-repeater-list]');
    if (list && list.querySelectorAll('.zak-repeater__row').length > 1) {
      repeaterRemove.closest('.zak-repeater__row')?.remove();
    }
    return;
  }
});

/* --------------------------------------------------- table select & filters */

function syncTableSelection(changed: HTMLInputElement): void {
  const wrap = changed.closest<HTMLElement>('[data-zak-table-select]');
  if (!wrap) return;
  const isCheckAll = changed.hasAttribute('data-zak-checkall');
  if (isCheckAll) {
    wrap.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]').forEach((box) => {
      box.checked = changed.checked;
    });
    changed.indeterminate = false;
  }
  const boxes = Array.from(wrap.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]'));
  boxes.forEach((box) => box.closest('tr')?.classList.toggle('is-selected', box.checked));
  const all = wrap.querySelector<HTMLInputElement>('[data-zak-checkall]');
  if (all && !isCheckAll) {
    const checked = boxes.filter((box) => box.checked).length;
    all.checked = boxes.length > 0 && checked === boxes.length;
    all.indeterminate = checked > 0 && checked < boxes.length;
  }
}

function applyTableFilter(control: Element): void {
  const scope: ParentNode = control.closest('.doc-demo__stage') ?? document;
  const controls = Array.from(scope.querySelectorAll<HTMLElement>('[data-zak-table-filter]'));
  const query = controls
    .filter((el): el is HTMLInputElement => el instanceof HTMLInputElement)
    .map((el) => el.value.trim().toLowerCase())
    .filter(Boolean)
    .join(' ');
  const picks = controls
    .filter((el): el is HTMLSelectElement => el instanceof HTMLSelectElement)
    .map((el) => el.value.trim().toLowerCase())
    .filter(Boolean);
  const table = scope.querySelector('table');
  let shown = 0;
  if (table) {
    const rows = Array.from(table.querySelectorAll<HTMLTableRowElement>('tbody tr'));
    for (const row of rows) {
      const text = (row.textContent ?? '').toLowerCase();
      const match = (query === '' || text.includes(query)) && picks.every((pick) => text.includes(pick));
      row.hidden = !match;
      if (match) shown += 1;
    }
  }
  const count = scope.querySelector('[data-zak-filter-count]');
  if (count) count.textContent = `${shown} result${shown === 1 ? '' : 's'}`;
}

/* ------------------------------------------------------- otp & paste & keys */

function handleOtpInput(box: HTMLInputElement): void {
  box.classList.toggle('is-filled', box.value !== '');
  const container = box.closest('.zak-otp');
  if (!container) return;
  const boxes = Array.from(container.querySelectorAll<HTMLInputElement>('input'));
  const index = boxes.indexOf(box);
  if (box.value && boxes[index + 1]) boxes[index + 1].focus();
}

function handleTabKeys(event: KeyboardEvent, tab: HTMLElement): void {
  const list = tab.closest('[role="tablist"]');
  if (!list) return;
  const tabs = Array.from(list.querySelectorAll<HTMLElement>('.zak-tab[role="tab"]'));
  const index = tabs.indexOf(tab);
  let next = -1;
  if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
  else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = tabs.length - 1;
  if (next < 0) return;
  event.preventDefault();
  tabs[next].focus();
  activateTab(tabs[next]);
}

document.addEventListener('keydown', (event) => {
  const target = elementOf(event.target);
  if (!target) return;
  if (target instanceof HTMLInputElement && target.closest('.zak-otp')) {
    const group = target.closest('.zak-otp') as HTMLElement;
    const boxes = Array.from(group.querySelectorAll<HTMLInputElement>('input'));
    const index = boxes.indexOf(target);
    const prev = boxes[index - 1];
    const next = boxes[index + 1];
    if (event.key === 'ArrowLeft' && prev) { event.preventDefault(); prev.focus(); }
    else if (event.key === 'ArrowRight' && next) { event.preventDefault(); next.focus(); }
    else if ((event.ctrlKey || event.metaKey) && (event.key === 'a' || event.key === 'A')) {
      /* Select-all marks the group and focuses the first box so Ctrl+C copies the
         full code; the next Backspace/Delete replaces every digit in one action. */
      event.preventDefault();
      group.dataset.zakOtpAll = '';
      boxes[0]?.focus();
      boxes[0]?.select();
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      if (group.dataset.zakOtpAll !== undefined) {
        /* Ctrl+A then Backspace — clear the whole code at once. */
        delete group.dataset.zakOtpAll;
        boxes.forEach((box) => { box.value = ''; box.classList.remove('is-filled'); });
        boxes[0]?.focus();
      } else if (event.key === 'Backspace') {
        if (target.value !== '') {
          /* One press erases the focused digit. */
          target.value = '';
          target.classList.remove('is-filled');
        } else if (prev) {
          /* Empty box: the same press clears and lands on the previous digit. */
          prev.value = '';
          prev.classList.remove('is-filled');
          prev.focus();
        }
      } else if (target.value !== '') {
        target.value = '';
        target.classList.remove('is-filled');
      }
    }
    return;
  }
  const tab = target.closest<HTMLElement>('.zak-tab[role="tab"]');
  if (tab) handleTabKeys(event, tab);
});

document.addEventListener('input', (event) => {
  const target = elementOf(event.target);
  if (!target) return;
  if (target instanceof HTMLInputElement && target.type === 'range' && target.classList.contains('zak-range')) {
    syncRange(target);
    return;
  }
  if (target instanceof HTMLInputElement && target.closest('.zak-otp')) {
    delete (target.closest('.zak-otp') as HTMLElement).dataset.zakOtpAll;
    handleOtpInput(target);
    return;
  }
  if (target.hasAttribute('data-zak-table-filter')) {
    applyTableFilter(target);
  }
});

document.addEventListener('change', (event) => {
  const target = elementOf(event.target);
  if (!target) return;
  if (target instanceof HTMLInputElement && target.type === 'checkbox' && target.closest('[data-zak-table-select]')) {
    syncTableSelection(target);
    return;
  }
  if (target instanceof HTMLSelectElement && target.hasAttribute('data-zak-table-filter')) {
    applyTableFilter(target);
  }
});

document.addEventListener('paste', (event) => {
  const target = elementOf(event.target);
  if (!(target instanceof HTMLInputElement) || !target.closest('.zak-otp')) return;
  const digits = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '');
  if (!digits) return;
  event.preventDefault();
  const container = target.closest('.zak-otp');
  const boxes = Array.from(container?.querySelectorAll<HTMLInputElement>('input') ?? []);
  boxes.forEach((box, index) => {
    box.value = digits[index] ?? '';
    box.classList.toggle('is-filled', box.value !== '');
  });
});

/* ------------------------------------------------------- dropzone (drag/drop) */

for (const type of ['dragenter', 'dragover']) {
  document.addEventListener(type, (event) => {
    const zone = elementOf(event.target)?.closest('[data-zak-dropzone]');
    if (!zone) return;
    event.preventDefault();
    zone.classList.add('is-dragover');
  });
}

document.addEventListener('dragleave', (event) => {
  elementOf(event.target)?.closest('[data-zak-dropzone]')?.classList.remove('is-dragover');
});

document.addEventListener('drop', (event) => {
  const zone = elementOf(event.target)?.closest('[data-zak-dropzone]');
  if (!zone) return;
  event.preventDefault();
  zone.classList.remove('is-dragover');
  const count = event.dataTransfer?.files.length ?? 0;
  if (count > 0) toast(`${count} file${count === 1 ? '' : 's'} ready to upload`, 'success');
});

/* ------------------------------------------------------ autocomplete / combobox */

function comboLabel(item: HTMLElement): string {
  const clone = item.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.zak-avatar, small').forEach((node) => node.remove());
  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim();
}

interface Combo {
  root: HTMLElement;
  list: HTMLElement;
  trigger: HTMLButtonElement | null;
  input: HTMLInputElement | null;
}

function comboAt(el: HTMLElement): Combo | null {
  const root = el.closest<HTMLElement>('[data-zak-autocomplete]');
  const list = root?.querySelector<HTMLElement>('.zak-combo__list') ?? null;
  if (!root || !list) return null;
  return {
    root,
    list,
    trigger: root.querySelector<HTMLButtonElement>('button.zak-select'),
    input: root.querySelector<HTMLInputElement>('input[role="combobox"]'),
  };
}

const comboItems = (list: HTMLElement): HTMLElement[] =>
  Array.from(list.querySelectorAll<HTMLElement>('.zak-combo__item'));

const comboVisible = (list: HTMLElement): HTMLElement[] => comboItems(list).filter((item) => !item.hidden);

/** Options need ids for `aria-activedescendant`; assign any that are missing, unique page-wide. */
let comboOptionSeq = 0;
function ensureOptionIds(list: HTMLElement): void {
  comboItems(list).forEach((item) => {
    if (!item.id) item.id = `zak-combo-opt-${++comboOptionSeq}`;
  });
}

function comboSetOpen(combo: Combo, open: boolean): void {
  combo.list.hidden = !open;
  (combo.trigger ?? combo.input)?.setAttribute('aria-expanded', String(open));
  if (open) ensureOptionIds(combo.list);
  else comboHighlight(combo, null); // no stale roving highlight survives a close
}

/** The text entry that owns the listbox pointer: the combobox input or the filter. */
function comboSink(combo: Combo): HTMLInputElement | null {
  const active = document.activeElement;
  if (active instanceof HTMLInputElement && combo.root.contains(active)) return active;
  return combo.input;
}

/**
 * Roving highlight — focus never leaves the text entry. This is the keyboard
 * pointer only; the selected value is separate `aria-selected` state owned by
 * comboSelect, so navigation never erases or fakes a selection.
 */
function comboHighlight(combo: Combo, item: HTMLElement | null): void {
  comboItems(combo.list).forEach((option) => option.classList.toggle('is-active', option === item));
  const sink = comboSink(combo);
  if (!sink) return;
  if (item?.id) sink.setAttribute('aria-activedescendant', item.id);
  else sink.removeAttribute('aria-activedescendant');
  item?.scrollIntoView({ block: 'nearest' });
}

function comboFilter(combo: Combo, query: string): void {
  const q = query.trim().toLowerCase();
  comboItems(combo.list).forEach((item) => {
    item.hidden = q !== '' && !(item.textContent ?? '').toLowerCase().includes(q);
  });
  const visible = comboVisible(combo.list);
  const empty = combo.list.querySelector<HTMLElement>('.zak-combo__empty');
  if (empty) empty.hidden = visible.length > 0; // property, not attribute — hidden="false" still hides
  /* Filtering never pre-highlights — the pointer moves only on arrow keys.
     Drop it when the highlighted option was hidden by the new query. */
  if (!visible.some((item) => item.classList.contains('is-active'))) comboHighlight(combo, null);
  /* The suggestion list stays hidden until it has something to show. A free-text
     autocomplete reveals only while there is a query; a trigger-driven combobox
     is opened by its own click handler, so this must not force it shut. */
  if (combo.input && !combo.trigger) comboSetOpen(combo, q !== '');
  else if (q !== '') comboSetOpen(combo, true);
}

function comboSelect(combo: Combo, item: HTMLElement): void {
  comboItems(combo.list).forEach((option) => option.setAttribute('aria-selected', String(option === item)));
  if (combo.trigger) {
    const spans = Array.from(combo.trigger.querySelectorAll('span'));
    const label = spans[spans.length - 1];
    if (label) label.textContent = comboLabel(item);
    const avatar = item.querySelector('.zak-avatar')?.textContent ?? '';
    const triggerAvatar = combo.trigger.querySelector('.zak-avatar');
    if (triggerAvatar && avatar) triggerAvatar.textContent = avatar;
    combo.trigger.setAttribute('aria-haspopup', 'listbox');
    comboSetOpen(combo, false);
    combo.trigger.focus();
  } else if (combo.input) {
    combo.input.value = comboLabel(item);
    comboSetOpen(combo, false);
    combo.input.removeAttribute('aria-activedescendant');
    combo.input.focus();
    combo.input.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    comboSetOpen(combo, false);
  }
}

function comboStep(combo: Combo, direction: number): void {
  const visible = comboVisible(combo.list);
  if (visible.length === 0) return;
  const current = visible.findIndex((item) => item.classList.contains('is-active'));
  const next = ((current + direction) % visible.length + visible.length) % visible.length;
  comboHighlight(combo, visible[current === -1 ? (direction === 1 ? 0 : visible.length - 1) : next]);
}

/* Click: item selects, trigger toggles, the input only ever opens. */
document.addEventListener('click', (event) => {
  const target = elementOf(event.target);
  if (!target) return;
  const combo = comboAt(target);
  if (!combo) return;

  const item = target.closest<HTMLElement>('.zak-combo__item');
  if (item && combo.list.contains(item)) {
    comboSelect(combo, item);
    return;
  }

  if (combo.trigger && (target === combo.trigger || combo.trigger.contains(target))) {
    const willOpen = combo.list.hidden;
    comboSetOpen(combo, willOpen);
    if (willOpen) {
      const filter = combo.list.querySelector<HTMLInputElement>('input');
      if (filter) filter.value = ''; // a reopen shows the full list, not the last query
      comboFilter(combo, '');
      filter?.focus();
    }
    return;
  }

  /* Typing target: opening is owned by focus/input, never toggled here. */
  if (target instanceof HTMLInputElement && (target === combo.input || combo.list.contains(target))) {
    comboFilter(combo, target.value);
  }
});

/* Focus no longer pops the list open — the suggestion list is hidden by default
   and only appears once the user types (or presses ArrowDown). */
document.addEventListener('input', (event) => {
  const target = elementOf(event.target);
  if (!(target instanceof HTMLInputElement)) return;
  const combo = comboAt(target);
  if (!combo) return;
  if (target === combo.input || combo.list.contains(target)) comboFilter(combo, target.value);
});

document.addEventListener('keydown', (event) => {
  const target = elementOf(event.target);
  if (!(target instanceof HTMLInputElement)) return;
  const combo = comboAt(target);
  if (!combo || (target !== combo.input && !combo.list.contains(target))) return;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      if (combo.list.hidden) {
        comboSetOpen(combo, true);
        comboHighlight(combo, comboVisible(combo.list)[0] ?? null);
      } else {
        comboStep(combo, 1);
      }
      break;
    case 'ArrowUp':
      event.preventDefault();
      comboStep(combo, -1);
      break;
    case 'Enter': {
      const active = comboVisible(combo.list).find((item) => item.classList.contains('is-active'));
      if (!combo.list.hidden && active) {
        event.preventDefault();
        comboSelect(combo, active);
      }
      break;
    }
    case 'Escape':
      if (!combo.list.hidden) {
        event.preventDefault();
        comboSetOpen(combo, false);
        combo.input?.focus();
      }
      break;
    default:
      break;
  }
});

/* Anywhere else closes the list. */
document.addEventListener('pointerdown', (event) => {
  const target = elementOf(event.target);
  if (!target) return;
  document
    .querySelectorAll<HTMLElement>('[data-zak-autocomplete]')
    .forEach((root) => {
      if (root.contains(target)) return;
      const combo = comboAt(root);
      if (combo && !combo.list.hidden) comboSetOpen(combo, false);
    });
});

/* ------------------------------------------------------------------ tags */

document.addEventListener('keydown', (event) => {
  const target = elementOf(event.target);
  if (!target) return;

  const tagsRoot = target.closest('[data-zak-tags]');
  if (!tagsRoot) return;

  const input = tagsRoot.querySelector<HTMLInputElement>('.zak-tags__input');
  if (!input || target !== input) return;

  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault();
    const text = input.value.trim();
    if (text) {
      const chip = document.createElement('span');
      chip.className = 'zak-tag';
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'zak-tag__x';
      remove.setAttribute('aria-label', `Remove ${text}`);
      remove.textContent = '×';
      chip.append(document.createTextNode(`${text} `), remove);
      tagsRoot.insertBefore(chip, input);
      input.value = '';
    }
    return;
  }
  if (event.key === 'Backspace' && !input.value) {
    const tags = tagsRoot.querySelectorAll('.zak-tag');
    tags[tags.length - 1]?.remove();
  }
});

document.addEventListener('paste', (event) => {
  const target = elementOf(event.target);
  if (!target) return;

  const tagsRoot = target.closest('[data-zak-tags]');
  if (!tagsRoot) return;

  const input = tagsRoot.querySelector<HTMLInputElement>('.zak-tags__input');
  if (!input || target !== input) return;

  const text = event.clipboardData?.getData('text') ?? '';
  if (!text.includes(',')) return;
  event.preventDefault();
  text.split(',').forEach((part) => {
    const t = part.trim();
    if (t) {
      const chip = document.createElement('span');
      chip.className = 'zak-tag';
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'zak-tag__x';
      remove.setAttribute('aria-label', `Remove ${t}`);
      remove.textContent = '×';
      chip.append(document.createTextNode(`${t} `), remove);
      tagsRoot.insertBefore(chip, input);
    }
  });
  input.value = '';
});

/* Tag remove button handled in main click handler above */

/* --------------------------------------------------------------- repeater
   Handled in the main delegated click handler above (lines ~417-444).
   No separate listener needed — avoids double-firing. */

/* --------------------------------------------------------------- form wizard
   `[data-zak-wizard]` root, `[data-zak-wizard-step]`/`.zak-wizard__step` rail,
   `[data-zak-wizard-panel]` bodies and `[data-zak-wizard-next|-back|-goto]`
   controls. Required fields in the leaving panel gate progress. */

interface Wizard {
  root: HTMLElement;
  steps: HTMLElement[];
  panels: HTMLElement[];
}

function wizardAt(el: HTMLElement): Wizard | null {
  const root = el.closest<HTMLElement>('[data-zak-wizard]');
  if (!root) return null;
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-zak-wizard-panel]'));
  if (panels.length === 0) return null;
  /* The rail is either an explicit list of steps or the `.zak-wizard__steps` children. */
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-zak-wizard-step], .zak-wizard__step'));
  return { root, steps, panels };
}

const wizardIndex = (wizard: Wizard): number =>
  Math.max(0, wizard.panels.findIndex((panel) => !panel.hidden));

function wizardShow(wizard: Wizard, index: number, action: string): void {
  const target = Math.min(Math.max(index, 0), wizard.panels.length - 1);
  wizard.panels.forEach((panel, i) => {
    panel.hidden = i !== target;
  });
  wizard.steps.forEach((step, i) => {
    step.classList.toggle('is-done', i < target);
    step.classList.toggle('is-active', i === target);
    if (i === target) step.setAttribute('aria-current', 'step');
    else step.removeAttribute('aria-current');
  });
  /* Back is meaningless on the first panel; button labels stay authored by the page. */
  wizard.root.querySelectorAll<HTMLButtonElement>('[data-zak-wizard-back]').forEach((button) => {
    button.disabled = target === 0;
  });
  wizard.root.dispatchEvent(new CustomEvent('zak:wizard', { bubbles: true, detail: { index: target, total: wizard.panels.length, action } }));
}

/** Block advancing while a required control in the leaving panel is empty. */
function wizardValidate(wizard: Wizard, index: number): boolean {
  const panel = wizard.panels[index];
  if (!panel) return true;
  const fields = Array.from(
    panel.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'input[required], select[required], textarea[required]',
    ),
  ).filter((field) => !field.disabled && !field.value.trim());
  panel.querySelectorAll('.is-invalid').forEach((node) => node.classList.remove('is-invalid'));
  if (fields.length === 0) return true;
  fields.forEach((field) => {
    field.classList.add('is-invalid');
    field.closest<HTMLElement>('.zak-field, .zak-input-group')?.classList.add('is-invalid');
  });
  fields[0].focus();
  toast('Fill in the required fields to continue', 'warning');
  return false;
}

document.addEventListener('click', (event) => {
  const target = elementOf(event.target);
  if (!target) return;
  const wizard = wizardAt(target);
  if (!wizard) return;
  const current = wizardIndex(wizard);

  const goto = target.closest<HTMLElement>('[data-zak-wizard-goto]');
  if (goto) {
    const index = Number(goto.getAttribute('data-zak-wizard-goto'));
    if (index < current || wizardValidate(wizard, current)) wizardShow(wizard, index, 'goto');
    return;
  }

  if (target.closest('[data-zak-wizard-back]')) {
    wizardShow(wizard, current - 1, 'back');
    return;
  }

  if (target.closest('[data-zak-wizard-next]')) {
    if (!wizardValidate(wizard, current)) return;
    if (current >= wizard.panels.length - 1) {
      wizard.steps.forEach((step) => {
        step.classList.add('is-done');
        step.classList.remove('is-active');
        step.removeAttribute('aria-current');
      });
      wizard.root.dispatchEvent(new CustomEvent('zak:wizard', { bubbles: true, detail: { index: current, total: wizard.panels.length, action: 'complete' } }));
      toast('Wizard complete', 'success');
      return;
    }
    wizardShow(wizard, current + 1, 'next');
  }
});

/* Typing clears the validation marker on the field itself. */
document.addEventListener('input', (event) => {
  const target = elementOf(event.target);
  if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) return;
  if (!target.value.trim()) return;
  target.classList.remove('is-invalid');
  target.closest<HTMLElement>('.zak-field, .zak-input-group')?.classList.remove('is-invalid');
});

/* --------------------------------------------------- autocomplete data source */

/**
 * An autocomplete/combobox may carry its dataset as JSON instead of hard-coding
 * options in markup: `data-zak-autocomplete` + `data-zak-source='["Ada","Alan"]'`
 * (strings) or `data-zak-source='[{"label":"Ada","value":"ada"}]'`. Options are
 * rendered into the `.zak-combo__list` once, on load, then filtered by the
 * shared combo runtime above.
 */
interface ComboOption {
  label: string;
  value: string;
  hint?: string;
}

function readOptions(root: HTMLElement): ComboOption[] {
  const raw = root.getAttribute('data-zak-source');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((entry: unknown): ComboOption => {
      if (typeof entry === 'string') return { label: entry, value: entry };
      const obj = entry as Record<string, string>;
      const label = obj.label ?? obj.value ?? '';
      return { label, value: obj.value ?? label, hint: obj.hint };
    });
  } catch {
    return [];
  }
}

function hydrateCombos(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLElement>('[data-zak-source]').forEach((root) => {
    const list = root.querySelector<HTMLElement>('.zak-combo__list');
    if (!list || list.querySelector('.zak-combo__item')) return; // already populated
    readOptions(root).forEach((option) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'zak-combo__item';
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', 'false');
      item.dataset.value = option.value;
      item.textContent = option.label;
      if (option.hint) {
        const small = document.createElement('small');
        small.textContent = option.hint;
        item.append(small);
      }
      list.insertBefore(item, list.querySelector('.zak-combo__empty') ?? null);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => hydrateCombos());
} else {
  hydrateCombos();
}

/* --------------------------------------------------------------- multiselect */

interface Multiselect {
  root: HTMLElement;
  field: HTMLElement;
  panel: HTMLElement | null;
  chips: HTMLElement | null;
  options: ComboOption[];
  selected: string[];
}

function msAt(el: HTMLElement): Multiselect | null {
  const root = el.closest<HTMLElement>('[data-zak-multiselect]');
  if (!root) return null;
  const field = root.querySelector<HTMLElement>('.zak-multiselect__field');
  if (!field) return null;
  const options = readOptions(root);
  const selected: string[] = (() => {
    try {
      const v = JSON.parse(root.getAttribute('data-zak-value') ?? '[]');
      return Array.isArray(v) ? v.map(String) : [];
    } catch {
      return [];
    }
  })();
  return {
    root,
    field,
    panel: root.querySelector<HTMLElement>('.zak-multiselect__panel'),
    chips: root.querySelector<HTMLElement>('.zak-multiselect__chips'),
    options,
    selected,
  };
}

function msRenderPanel(ms: Multiselect): void {
  if (!ms.panel) return;
  const current = new Set(ms.selected);
  setHtml(ms.panel, ms.options
    .map((option) => {
      const checked = current.has(option.value) ? ' checked' : '';
      return `<label class="zak-multiselect__option"><input type="checkbox" value="${option.value}"${checked}/><span>${option.label}</span></label>`;
    })
    .join(''));
}

function msRenderChips(ms: Multiselect): void {
  if (!ms.chips) return;
  const byValue = new Map(ms.options.map((o) => [o.value, o.label]));
  ms.chips.textContent = '';
  ms.selected.forEach((value) => {
    const chip = document.createElement('span');
    chip.className = 'zak-multiselect__chip';
    chip.append(document.createTextNode(`${byValue.get(value) ?? value} `));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'zak-multiselect__chip-x';
    remove.setAttribute('aria-label', `Remove ${byValue.get(value) ?? value}`);
    remove.dataset.msRemove = value;
    remove.textContent = '×';
    chip.append(remove);
    ms.chips!.append(chip);
  });
  if (ms.selected.length === 0) {
    const placeholder = document.createElement('span');
    placeholder.className = 'zak-multiselect__placeholder';
    placeholder.textContent = ms.root.getAttribute('data-zak-placeholder') ?? 'Select…';
    ms.chips.append(placeholder);
  }
}

function msSync(ms: Multiselect): void {
  msRenderChips(ms);
  ms.panel?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((box) => {
    box.checked = ms.selected.includes(box.value);
  });
  /* Persist the live selection so the next `msAt()` re-read reflects it — the
     attribute is the single source of truth for every delegated event. */
  ms.root.setAttribute('data-zak-value', JSON.stringify(ms.selected));
  ms.root.classList.toggle('is-open', Boolean(ms.panel && !ms.panel.hidden));
  ms.root.dispatchEvent(new CustomEvent('zak:change', { bubbles: true, detail: { value: [...ms.selected] } }));
}

function msToggleOpen(ms: Multiselect, open: boolean): void {
  if (!ms.panel) return;
  if (open && ms.panel.dataset.built !== '1') {
    msRenderPanel(ms);
    ms.panel.dataset.built = '1';
  }
  ms.panel.hidden = !open;
  ms.field.setAttribute('aria-expanded', String(open));
  ms.root.classList.toggle('is-open', open);
}

/** Render chips for any preset `data-zak-value` so the field is populated before first interaction. */
function hydrateMultiselects(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLElement>('[data-zak-multiselect]').forEach((root) => {
    const ms = msAt(root);
    if (ms) msRenderChips(ms);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => hydrateMultiselects());
} else {
  hydrateMultiselects();
}

document.addEventListener('click', (event) => {
  const target = elementOf(event.target);
  if (!target) return;
  const ms = msAt(target);
  if (!ms) return;

  // Close every other multiselect.
  document.querySelectorAll<HTMLElement>('[data-zak-multiselect]').forEach((other) => {
    if (other !== ms.root) {
      const panel = other.querySelector<HTMLElement>('.zak-multiselect__panel');
      if (panel) panel.hidden = true;
      other.classList.remove('is-open');
    }
  });

  if (target.closest('[data-ms-remove]')) {
    const value = (target.closest('[data-ms-remove]') as HTMLElement).dataset.msRemove!;
    ms.selected = ms.selected.filter((v) => v !== value);
    msSync(ms);
    return;
  }

  if (ms.field.contains(target) || target === ms.field) {
    msToggleOpen(ms, Boolean(ms.panel && ms.panel.hidden));
  }
});

document.addEventListener('change', (event) => {
  const target = elementOf(event.target);
  if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') return;
  const ms = msAt(target);
  if (!ms) return;
  ms.selected = ms.selected.filter((v) => v !== target.value);
  if (target.checked) ms.selected.push(target.value);
  msSync(ms);
});

document.addEventListener('keydown', (event) => {
  const target = elementOf(event.target);
  if (!target) return;
  const ms = msAt(target);
  if (!ms) return;
  if (event.key === 'Escape' && ms.panel && !ms.panel.hidden) {
    event.preventDefault();
    msToggleOpen(ms, false);
    ms.field.focus();
  }
});

document.addEventListener('pointerdown', (event) => {
  const target = elementOf(event.target);
  if (!target) return;
  document.querySelectorAll<HTMLElement>('[data-zak-multiselect]').forEach((root) => {
    if (root.contains(target)) return;
    const panel = root.querySelector<HTMLElement>('.zak-multiselect__panel');
    if (panel && !panel.hidden) {
      panel.hidden = true;
      root.classList.remove('is-open');
      root.querySelector('.zak-multiselect__field')?.setAttribute('aria-expanded', 'false');
    }
  });
});

/* ------------------------------------------------------- repeater drag reorder */

let dragRepeaterRow: HTMLElement | null = null;

function repeaterAfter(list: HTMLElement, y: number): HTMLElement | null {
  const rows = Array.from(list.querySelectorAll<HTMLElement>('.zak-repeater__row:not(.zak-repeater__row--dragging)'));
  for (const row of rows) {
    const box = row.getBoundingClientRect();
    if (y < box.top + box.height / 2) return row;
  }
  return null;
}

document.addEventListener('dragstart', (event) => {
  const row = elementOf(event.target)?.closest<HTMLElement>('.zak-repeater__row');
  if (!row || !row.closest('[data-repeater-list]')) return;
  dragRepeaterRow = row;
  row.classList.add('zak-repeater__row--dragging');
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    try {
      event.dataTransfer.setData('text/plain', '');
    } catch {
      /* some browsers require a payload; ignore failures */
    }
  }
});

document.addEventListener('dragover', (event) => {
  const list = elementOf(event.target)?.closest('[data-repeater-list]');
  if (!list || !dragRepeaterRow) return;
  event.preventDefault();
  const after = repeaterAfter(list as HTMLElement, event.clientY);
  if (after == null) list.append(dragRepeaterRow);
  else list.insertBefore(dragRepeaterRow, after);
});

document.addEventListener('drop', (event) => {
  if (elementOf(event.target)?.closest('[data-repeater-list]')) event.preventDefault();
});

document.addEventListener('dragend', () => {
  dragRepeaterRow?.classList.remove('zak-repeater__row--dragging');
  dragRepeaterRow = null;
});

/* Pickers (calendar grids, time selects, color swatches) live in calendar.ts —
   every surface is generated from data attributes at runtime. */