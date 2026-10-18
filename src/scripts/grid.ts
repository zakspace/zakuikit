/**
 * ZAKUIKit Docs — data grid runtime.
 *
 * Each `.zak-grid[data-zak-grid]` instance reads its options from the embedded
 * `script[data-grid-config]` JSON and renders client-side from the shared
 * people dataset. One runtime per element (tracked in a WeakMap) wires:
 *
 *   · list mode    — search, facet filters, sorting, pagination, selection,
 *                    row expansion, bulk bar, editable cells;
 *   · tree mode    — team parents with subtree rollups and collapsible rows;
 *   · grouped mode — aggregate group rows with counts and totals;
 *   · virtual mode — windowed rendering between two spacer rows;
 *   · server mode  — `zak:gridrequest` events + a simulated loading overlay.
 *
 * Interactions that mutate state re-render through `update()`; in-place
 * toggles (row expansion, tree/group collapse, editing) never re-render so
 * focus and scroll survive. No innerHTML sinks anywhere — rows are built with
 * createElement and icons arrive through `setHtml` (DOMParser).
 */
import { people, teams, type Person } from '../data/people';
import { svgIcon } from '../data/icons';
import { setHtml } from './dom';
import { toast } from './behaviors';

const OVERSCAN = 6;
const SEARCH_FIELDS = ['name', 'email', 'team', 'role', 'location', 'status', 'joined'] as const;

interface GridColumn {
  key: string;
  label: string;
  sortable: boolean;
  numeric: boolean;
  hidden: boolean;
}

interface GridConfig {
  selectable: boolean;
  expandable: boolean;
  resizable: boolean;
  reorderable: boolean;
  editable: string[];
  /** Row action buttons rendered as a trailing `zak-grid__actions` cell. */
  actions: string[];
  tree: boolean;
  grouped: boolean;
  server: boolean;
  virtual: boolean;
  rowCount: number;
  pageSize: number;
  presetFilters: Record<string, string>;
  emptyText: string;
  columns: GridColumn[];
}

type GridRow = Person & { key: string };

interface GridState {
  page: number;
  pageSize: number;
  query: string;
  sortKey: string | null;
  sortDir: 1 | -1;
  filters: Record<string, string>;
  selection: Set<string>;
  timer: number;
  rowHeight: number;
  virtualBound: boolean;
}

interface GridRuntime {
  root: HTMLElement;
  cfg: GridConfig;
  rows: GridRow[];
  byKey: Map<string, GridRow>;
  body: HTMLTableSectionElement;
  scroll: HTMLElement;
  count: HTMLElement | null;
  loading: HTMLElement | null;
  pager: HTMLElement | null;
  bulk: HTMLElement | null;
  bulkCount: HTMLElement | null;
  state: GridState;
  request: number;
}

const runtimes = new WeakMap<HTMLElement, GridRuntime>();

function elementOf(node: EventTarget | null): HTMLElement | null {
  return node instanceof HTMLElement ? node : null;
}

/* ---- Data helpers ------------------------------------------------------------ */

const STATUS_META: Record<string, { tone: string; label: string }> = {
  active: { tone: 'success', label: 'Active' },
  invited: { tone: 'warning', label: 'Invited' },
  suspended: { tone: 'danger', label: 'Suspended' },
};

function buildVirtualRows(count: number): GridRow[] {
  return Array.from({ length: count }, (_, i) => {
    const person = people[i % people.length];
    const cycle = Math.floor(i / people.length);
    return {
      ...person,
      key: `v${i}`,
      name: cycle === 0 ? person.name : `${person.name} ${cycle + 1}`,
      email: cycle === 0 ? person.email : person.email.replace('@', `+${i}@`),
      usage: person.usage * 3 + ((i * 7) % 120),
    };
  });
}

function fieldOf(row: GridRow, key: string): string {
  return String((row as unknown as Record<string, unknown>)[key] ?? '');
}

function applyFilters(rt: GridRuntime): GridRow[] {
  const { state } = rt;
  let rows: GridRow[] = rt.rows;

  if (state.query) {
    rows = rows.filter((row) =>
      SEARCH_FIELDS.some((field) => row[field].toLowerCase().includes(state.query)),
    );
  }

  const active = Object.entries(state.filters).filter(([, value]) => value !== '');
  if (active.length > 0) {
    rows = rows.filter((row) => active.every(([key, value]) => fieldOf(row, key) === value));
  }

  if (state.sortKey) {
    const key = state.sortKey;
    const column = rt.cfg.columns.find((col) => col.key === key);
    const dir = state.sortDir;
    rows = [...rows].sort((a, b) => {
      if (column?.numeric) return (Number(fieldOf(a, key)) - Number(fieldOf(b, key))) * dir;
      return fieldOf(a, key).localeCompare(fieldOf(b, key), undefined, { numeric: true }) * dir;
    });
  }

  return rows;
}

function groupByTeam(rows: GridRow[]): Map<string, GridRow[]> {
  const groups = new Map<string, GridRow[]>();
  for (const team of teams) groups.set(team, []);
  for (const row of rows) {
    if (!groups.has(row.team)) groups.set(row.team, []);
    groups.get(row.team)?.push(row);
  }
  for (const [team, members] of groups) if (members.length === 0) groups.delete(team);
  return groups;
}

function totalColumns(rt: GridRuntime): number {
  return (
    rt.cfg.columns.length +
    (rt.cfg.selectable ? 1 : 0) +
    (rt.cfg.expandable ? 1 : 0) +
    (rt.cfg.actions.length > 0 ? 1 : 0)
  );
}

/* ---- Cell builders -------------------------------------------------------------- */

function statusBadge(status: string): HTMLElement {
  const meta = STATUS_META[status] ?? { tone: 'info', label: status };
  const badge = document.createElement('span');
  badge.className = `zak-badge zak-badge--${meta.tone}`;
  const dot = document.createElement('span');
  dot.className = 'zak-badge__dot';
  badge.append(dot, document.createTextNode(meta.label));
  return badge;
}

function fillCell(td: HTMLTableCellElement, row: GridRow, column: GridColumn): void {
  switch (column.key) {
    case 'name':
      td.textContent = row.name;
      break;
    case 'status':
      td.append(statusBadge(row.status));
      break;
    case 'usage':
      td.textContent = `${row.usage} GB`;
      break;
    case 'balance':
      td.textContent = `$${row.balance.toLocaleString('en-US')}`;
      break;
    default:
      td.textContent = fieldOf(row, column.key);
  }
}

function buildCell(rt: GridRuntime, row: GridRow, column: GridColumn): HTMLTableCellElement {
  const td = document.createElement('td');
  td.dataset.col = column.key;
  if (column.hidden) td.classList.add('is-hidden');

  if (rt.cfg.editable.includes(column.key)) {
    const value = fieldOf(row, column.key);
    td.contentEditable = 'true';
    td.dataset.value = value;
    td.dataset.row = row.key;
    td.setAttribute('aria-label', `${column.label} for ${row.name}`);
    td.textContent = value;
    return td;
  }

  fillCell(td, row, column);
  return td;
}

function buildDetailRow(rt: GridRuntime, row: GridRow): HTMLTableRowElement {
  const tr = document.createElement('tr');
  tr.className = 'zak-grid__detail';
  tr.hidden = true;

  const td = document.createElement('td');
  td.colSpan = totalColumns(rt);

  const inner = document.createElement('div');
  inner.className = 'zak-grid__detail-inner';
  const facts: Array<[string, string]> = [
    ['Role', row.role],
    ['Location', row.location],
    ['Joined', row.joined],
    ['Email', row.email],
  ];
  for (const [label, value] of facts) {
    const cell = document.createElement('div');
    const hint = document.createElement('div');
    hint.className = 'zak-hint';
    hint.textContent = label;
    cell.append(hint, document.createTextNode(value));
    inner.append(cell);
  }

  td.append(inner);
  tr.append(td);
  return tr;
}

const GRID_ACTIONS: Record<string, { icon: string; label: string; tone?: string }> = {
  view: { icon: 'eye', label: 'View' },
  edit: { icon: 'edit', label: 'Edit' },
  delete: { icon: 'trash', label: 'Delete', tone: 'danger' },
};

/** Trailing action cell: one icon button per configured row action. */
function buildActionCell(rt: GridRuntime, row: GridRow): HTMLTableCellElement | null {
  if (rt.cfg.actions.length === 0) return null;
  const td = document.createElement('td');
  td.className = 'zak-grid__row-actions';
  for (const name of rt.cfg.actions) {
    const spec = GRID_ACTIONS[name];
    if (!spec) continue;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm zak-grid__action${
      spec.tone ? ` zak-grid__action--${spec.tone}` : ''
    }`;
    button.setAttribute('data-grid-action', name);
    button.setAttribute('aria-label', `${spec.label} ${row.name}`);
    setHtml(button, svgIcon(spec.icon, 'zak-icon', 14));
    td.append(button);
  }
  return td;
}

function buildRow(rt: GridRuntime, row: GridRow): HTMLTableRowElement[] {
  const { cfg } = rt;
  const tr = document.createElement('tr');
  tr.dataset.rowKey = row.key;
  if (rt.state.selection.has(row.key)) tr.classList.add('is-selected');

  if (cfg.selectable) {
    const td = document.createElement('td');
    td.className = 'zak-grid__check';
    /* The ZAKUIKit checkbox: a real input inside the label surface. */
    const label = document.createElement('label');
    label.className = 'zak-check zak-check--bare';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = rt.state.selection.has(row.key);
    box.setAttribute('aria-label', `Select ${row.name}`);
    label.append(box);
    td.append(label);
    tr.append(td);
  }

  if (cfg.expandable) {
    const td = document.createElement('td');
    td.className = 'zak-grid__check';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm';
    button.setAttribute('data-grid-expand', row.key);
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', `Expand ${row.name}`);
    setHtml(button, svgIcon('chevron-right', 'zak-icon', 14));
    td.append(button);
    tr.append(td);
  }

  for (const column of cfg.columns) tr.append(buildCell(rt, row, column));

  const actions = buildActionCell(rt, row);
  if (actions) tr.append(actions);

  return cfg.expandable ? [tr, buildDetailRow(rt, row)] : [tr];
}

function emptyRow(rt: GridRuntime): HTMLTableRowElement {
  const tr = document.createElement('tr');
  const td = document.createElement('td');
  td.colSpan = totalColumns(rt);
  td.className = 'zak-grid__empty';
  td.textContent = rt.cfg.emptyText;
  tr.append(td);
  return tr;
}

/* ---- Chrome sync ------------------------------------------------------------------ */

function renderCount(rt: GridRuntime, from: number, to: number, total: number): void {
  if (!rt.count) return;
  if (total === 0) {
    rt.count.textContent = 'No rows';
    return;
  }
  const strong = document.createElement('strong');
  strong.textContent = `${from}–${to}`;
  rt.count.replaceChildren(
    document.createTextNode('Showing '),
    strong,
    document.createTextNode(` of ${total} rows`),
  );
}

function paginationButton(
  text: string,
  label: string,
  icon: string | null,
  target: number | null,
): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'zak-page-btn';
  button.setAttribute('aria-label', label);
  if (icon) setHtml(button, svgIcon(icon, 'zak-icon', 14));
  else button.textContent = text;
  if (target === null) button.disabled = true;
  else button.dataset.page = String(target);
  return button;
}

function pagerWindow(page: number, pages: number): Array<number | '…'> {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const values = [...new Set([1, pages, page - 1, page, page + 1])]
    .filter((value) => value >= 1 && value <= pages)
    .sort((a, b) => a - b);
  const output: Array<number | '…'> = [];
  let previous = 0;
  for (const value of values) {
    if (value - previous > 1) output.push('…');
    output.push(value);
    previous = value;
  }
  return output;
}

function renderPager(rt: GridRuntime, pages: number): void {
  if (!rt.pager) return;
  const page = rt.state.page;
  const frag = document.createDocumentFragment();
  frag.append(paginationButton('', 'Previous page', 'chevron-left', page > 1 ? page - 1 : null));

  for (const entry of pagerWindow(page, pages)) {
    if (entry === '…') {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'zak-page-ellipsis';
      ellipsis.textContent = '…';
      frag.append(ellipsis);
      continue;
    }
    const button = paginationButton(String(entry), `Page ${entry}`, null, entry);
    if (entry === page) {
      button.classList.add('is-active');
      button.setAttribute('aria-current', 'page');
    }
    frag.append(button);
  }

  frag.append(paginationButton('', 'Next page', 'chevron-right', page < pages ? page + 1 : null));
  rt.pager.replaceChildren(frag);
}

function syncCheckAll(rt: GridRuntime): void {
  const checkAll = rt.root.querySelector<HTMLInputElement>('[data-grid-check-all]');
  if (!checkAll) return;
  const boxes = Array.from(
    rt.body.querySelectorAll<HTMLInputElement>('tr[data-row-key] input[type="checkbox"]'),
  );
  const checked = boxes.filter((box) => box.checked).length;
  checkAll.checked = boxes.length > 0 && checked === boxes.length;
  checkAll.indeterminate = checked > 0 && checked < boxes.length;
}

function syncBulk(rt: GridRuntime): void {
  if (!rt.bulk) return;
  rt.bulk.hidden = rt.state.selection.size === 0;
  if (rt.bulkCount) rt.bulkCount.textContent = `${rt.state.selection.size} selected`;
}

function syncSortUI(rt: GridRuntime): void {
  rt.root.querySelectorAll<HTMLElement>('[data-grid-sort]').forEach((button) => {
    const active = button.dataset.gridSort === rt.state.sortKey;
    const th = button.closest('th');
    if (active) {
      button.setAttribute('data-dir', rt.state.sortDir === 1 ? 'asc' : 'desc');
      th?.setAttribute('aria-sort', rt.state.sortDir === 1 ? 'ascending' : 'descending');
    } else {
      button.removeAttribute('data-dir');
      th?.removeAttribute('aria-sort');
    }
  });
}

function syncColumnVisibility(rt: GridRuntime, key: string, hidden: boolean): void {
  rt.root
    .querySelectorAll<HTMLElement>(`th[data-grid-th="${key}"], td[data-col="${key}"]`)
    .forEach((el) => el.classList.toggle('is-hidden', hidden));
}

/* ---- Renderers ------------------------------------------------------------------------ */

function renderTable(rt: GridRuntime): void {
  const filtered = applyFilters(rt);
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / rt.state.pageSize));
  if (rt.state.page > pages) rt.state.page = pages;
  const start = (rt.state.page - 1) * rt.state.pageSize;
  const pageRows = filtered.slice(start, start + rt.state.pageSize);

  const frag = document.createDocumentFragment();
  if (pageRows.length === 0) {
    frag.append(emptyRow(rt));
  } else {
    for (const row of pageRows) for (const line of buildRow(rt, row)) frag.append(line);
  }
  rt.body.replaceChildren(frag);

  renderCount(rt, total === 0 ? 0 : start + 1, Math.min(start + rt.state.pageSize, total), total);
  renderPager(rt, pages);
  syncCheckAll(rt);
  syncBulk(rt);
}

function disclosureButton(scopeKey: string, label: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm';
  button.setAttribute('data-grid-collapse', scopeKey);
  button.setAttribute('aria-expanded', 'true');
  button.setAttribute('aria-label', `Collapse ${label}`);
  setHtml(button, svgIcon('chevron-right', 'zak-icon', 14));
  const icon = button.querySelector('svg');
  if (icon instanceof SVGElement) icon.style.transform = 'rotate(90deg)';
  return button;
}

function buildParentRow(
  rt: GridRuntime,
  scopeKey: string,
  label: string,
  members: GridRow[],
): HTMLTableRowElement {
  const tr = document.createElement('tr');
  tr.className = 'zak-grid__group';
  tr.dataset.gridParent = scopeKey;

  const usage = members.reduce((sum, member) => sum + member.usage, 0);
  const balance = members.reduce((sum, member) => sum + member.balance, 0);

  for (const column of rt.cfg.columns) {
    const td = document.createElement('td');
    td.dataset.col = column.key;
    if (column.hidden) td.classList.add('is-hidden');

    switch (column.key) {
      case 'name': {
        const wrap = document.createElement('span');
        wrap.style.display = 'inline-flex';
        wrap.style.alignItems = 'center';
        wrap.style.gap = 'var(--zak-space-2)';
        wrap.append(disclosureButton(scopeKey, label), document.createTextNode(label));
        const count = document.createElement('span');
        count.className = 'zak-badge zak-badge--counter';
        count.textContent = String(members.length);
        wrap.append(count);
        td.append(wrap);
        break;
      }
      case 'status':
        td.textContent = '—';
        break;
      case 'usage':
        td.textContent = `${usage} GB`;
        break;
      case 'balance':
        td.textContent = `$${balance.toLocaleString('en-US')}`;
        break;
      default:
        td.textContent = '';
    }
    tr.append(td);
  }
  return tr;
}

function buildMemberRow(
  rt: GridRuntime,
  row: GridRow,
  scopeKey: string,
  indent: boolean,
): HTMLTableRowElement {
  const tr = document.createElement('tr');
  tr.dataset.rowKey = row.key;
  tr.dataset.gridChild = scopeKey;

  for (const column of rt.cfg.columns) {
    const td = document.createElement('td');
    td.dataset.col = column.key;
    if (column.hidden) td.classList.add('is-hidden');
    if (indent && column.key === rt.cfg.columns[0]?.key) {
      td.style.paddingInlineStart = 'var(--zak-space-8)';
    }
    fillCell(td, row, column);
    tr.append(td);
  }
  return tr;
}

function renderHierarchy(rt: GridRuntime, prefix: string, indent: boolean): void {
  const filtered = applyFilters(rt);
  const groups = groupByTeam(filtered);
  const frag = document.createDocumentFragment();
  if (groups.size === 0) {
    frag.append(emptyRow(rt));
  } else {
    for (const [team, members] of groups) {
      const scopeKey = `${prefix}:${team}`;
      frag.append(buildParentRow(rt, scopeKey, team, members));
      for (const member of members) frag.append(buildMemberRow(rt, member, scopeKey, indent));
    }
  }
  rt.body.replaceChildren(frag);
}

function vpadRow(rt: GridRuntime, height: number, label: string): HTMLTableRowElement {
  const tr = document.createElement('tr');
  tr.className = 'zak-grid__vpad';
  tr.setAttribute('aria-hidden', 'true');
  const td = document.createElement('td');
  td.colSpan = totalColumns(rt);
  td.style.height = `${Math.round(height)}px`;
  td.textContent = label;
  tr.append(td);
  return tr;
}

function renderVirtual(rt: GridRuntime): void {
  const total = rt.rows.length;
  const rowHeight = rt.state.rowHeight || 44;
  const viewport = rt.scroll.clientHeight || 272;
  const start = Math.max(0, Math.floor(rt.scroll.scrollTop / rowHeight) - OVERSCAN);
  const end = Math.min(total, start + Math.ceil(viewport / rowHeight) + OVERSCAN * 2);

  const frag = document.createDocumentFragment();
  const topHeight = start * rowHeight;
  const bottomHeight = (total - end) * rowHeight;
  if (topHeight > 0) frag.append(vpadRow(rt, topHeight, `${start} rows above`));
  for (let i = start; i < end; i += 1) frag.append(buildRow(rt, rt.rows[i])[0]);
  if (bottomHeight > 0) frag.append(vpadRow(rt, bottomHeight, `${total - end} rows below`));
  rt.body.replaceChildren(frag);

  if (rt.state.rowHeight === 0) {
    const sample = rt.body.querySelector<HTMLTableRowElement>('tr:not(.zak-grid__vpad)');
    const measured = sample?.offsetHeight ?? 0;
    if (measured > 0) {
      rt.state.rowHeight = measured;
      if (Math.abs(measured - rowHeight) > 1) renderVirtual(rt); // recalibrate the window
    }
  }
}

function renderAll(rt: GridRuntime): void {
  if (rt.cfg.virtual) {
    renderVirtual(rt);
    return;
  }
  if (rt.cfg.tree) {
    renderHierarchy(rt, 't', true);
    return;
  }
  if (rt.cfg.grouped) {
    renderHierarchy(rt, 'g', false);
    return;
  }
  renderTable(rt);
}

/* ---- Server simulation ------------------------------------------------------------------ */

function requestServer(rt: GridRuntime): void {
  const token = ++rt.request;
  rt.root.classList.add('is-loading');
  rt.loading?.classList.add('is-visible');
  if (rt.count) rt.count.textContent = 'Loading rows…';

  rt.root.dispatchEvent(
    new CustomEvent('zak:gridrequest', {
      bubbles: true,
      detail: {
        query: rt.state.query,
        filters: { ...rt.state.filters },
        sortKey: rt.state.sortKey,
        sortDir: rt.state.sortDir === 1 ? 'asc' : 'desc',
        page: rt.state.page,
        pageSize: rt.state.pageSize,
      },
    }),
  );

  // No API in docs — resolve the "request" against the local dataset.
  window.setTimeout(
    () => {
      if (token !== rt.request) return;
      rt.root.classList.remove('is-loading');
      rt.loading?.classList.remove('is-visible');
      renderTable(rt);
    },
    420 + Math.random() * 160,
  );
}

function update(rt: GridRuntime): void {
  if (rt.cfg.server) requestServer(rt);
  else renderAll(rt);
}

/* ---- Editable cells ------------------------------------------------------------------------ */

function commitEdit(rt: GridRuntime, cell: HTMLTableCellElement): void {
  const key = cell.dataset.row ?? '';
  const column = cell.dataset.col ?? '';
  const row = rt.byKey.get(key);
  if (!row) return;

  const text = cell.textContent.trim();
  if (text === '') {
    cell.classList.add('is-invalid');
    window.requestAnimationFrame(() => cell.focus());
    return;
  }

  cell.classList.remove('is-invalid');
  cell.textContent = text;
  const previous = fieldOf(row, column);
  cell.dataset.value = text;
  if (text === previous) return;

  (row as unknown as Record<string, unknown>)[column] = text;
  const label = rt.cfg.columns.find((col) => col.key === column)?.label ?? column;
  toast(`${label} updated for ${row.name}`, 'success');
}

/* ---- Column tools ------------------------------------------------------------------------------ */

function moveColumn(rt: GridRuntime, fromKey: string, toKey: string): void {
  if (!fromKey || !toKey || fromKey === toKey) return;
  const columns = rt.cfg.columns;
  const from = columns.findIndex((col) => col.key === fromKey);
  const to = columns.findIndex((col) => col.key === toKey);
  if (from < 0 || to < 0) return;

  const [moved] = columns.splice(from, 1);
  columns.splice(to, 0, moved);

  const headRow = rt.root.querySelector('thead tr');
  if (headRow) {
    const cells = new Map(
      Array.from(rt.root.querySelectorAll<HTMLTableCellElement>('th[data-grid-th]')).map((th) => [
        th.dataset.gridTh ?? '',
        th,
      ]),
    );
    for (const column of columns) {
      const th = cells.get(column.key);
      if (th) headRow.append(th);
    }
  }

  update(rt);
  toast(`Moved “${moved.label}” column`, 'info');
}

function initResizable(rt: GridRuntime): void {
  if (!rt.cfg.resizable) return;
  const table = rt.root.querySelector<HTMLTableElement>('table');
  if (table) table.style.tableLayout = 'fixed';

  rt.root.querySelectorAll<HTMLTableCellElement>('th[data-grid-th]').forEach((th) => {
    th.classList.add('zak-grid__resizable');
    const handle = document.createElement('span');
    handle.className = 'zak-grid__resizer';
    handle.setAttribute('aria-hidden', 'true');
    th.append(handle);

    handle.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const startX = event.clientX;
      const startWidth = th.offsetWidth;
      const wasDraggable = th.draggable;
      th.draggable = false; // keep HTML5 drag from hijacking the resize
      handle.classList.add('is-active');
      handle.setPointerCapture(event.pointerId);

      const onMove = (moveEvent: PointerEvent): void => {
        th.style.width = `${Math.max(80, startWidth + moveEvent.clientX - startX)}px`;
      };
      const onUp = (): void => {
        handle.classList.remove('is-active');
        th.draggable = wasDraggable;
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onUp);
      };
      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onUp);
    });
  });
}

function initReorderable(rt: GridRuntime): void {
  if (!rt.cfg.reorderable) return;
  const headers = Array.from(rt.root.querySelectorAll<HTMLTableCellElement>('th[data-grid-th]'));
  let dragKey: string | null = null;

  headers.forEach((th) => {
    th.draggable = true;
    th.tabIndex = 0;

    th.addEventListener('dragstart', (event) => {
      dragKey = th.dataset.gridTh ?? null;
      event.dataTransfer?.setData('text/plain', dragKey ?? '');
      if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    });
    th.addEventListener('dragover', (event) => {
      if (!dragKey || th.dataset.gridTh === dragKey) return;
      event.preventDefault();
      th.classList.add('is-dragover');
    });
    th.addEventListener('dragleave', () => th.classList.remove('is-dragover'));
    th.addEventListener('drop', (event) => {
      event.preventDefault();
      th.classList.remove('is-dragover');
      const from = dragKey ?? event.dataTransfer?.getData('text/plain') ?? '';
      dragKey = null;
      moveColumn(rt, from, th.dataset.gridTh ?? '');
    });
    th.addEventListener('dragend', () => {
      dragKey = null;
      headers.forEach((header) => header.classList.remove('is-dragover'));
    });

    th.addEventListener('keydown', (event) => {
      if (!event.altKey || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
      event.preventDefault();
      const columns = rt.cfg.columns;
      const index = columns.findIndex((col) => col.key === th.dataset.gridTh);
      const target = event.key === 'ArrowLeft' ? index - 1 : index + 1;
      if (index < 0 || target < 0 || target >= columns.length) return;
      moveColumn(rt, columns[index].key, columns[target].key);
    });
  });
}

/* ---- Row expansion -------------------------------------------------------------------------- */

/** Flip a row's detail panel; works for the chevron cell and the `view` action. */
function toggleRowDetail(row: HTMLTableRowElement): void {
  const detail = row.nextElementSibling;
  if (!(detail instanceof HTMLTableRowElement) || !detail.classList.contains('zak-grid__detail')) {
    return;
  }
  const open = row.classList.toggle('is-expanded');
  detail.hidden = !open;
  row.setAttribute('aria-expanded', String(open));
  const toggle = row.querySelector<HTMLElement>('[data-grid-expand]');
  if (toggle) {
    toggle.setAttribute('aria-expanded', String(open));
    const label = toggle.getAttribute('aria-label') ?? '';
    toggle.setAttribute(
      'aria-label',
      open ? label.replace(/^Expand/, 'Collapse') : label.replace(/^Collapse/, 'Expand'),
    );
    const icon = toggle.querySelector('svg');
    if (icon instanceof SVGElement) icon.style.transform = open ? 'rotate(90deg)' : '';
  }
}

/* ---- Interaction binding --------------------------------------------------------------------------- */

function bindGrid(rt: GridRuntime): void {
  const { root } = rt;

  const search = root.querySelector<HTMLInputElement>('[data-grid-search]');
  search?.addEventListener('input', () => {
    rt.state.query = search.value.trim().toLowerCase();
    rt.state.page = 1;
    window.clearTimeout(rt.state.timer);
    rt.state.timer = window.setTimeout(() => update(rt), 280); // docs: debounce ~300 ms
  });

  root.addEventListener('click', (event) => {
    const target = elementOf(event.target);
    if (!target) return;

    const sortButton = target.closest<HTMLElement>('[data-grid-sort]');
    if (sortButton) {
      const key = sortButton.dataset.gridSort ?? '';
      if (rt.state.sortKey === key) rt.state.sortDir = rt.state.sortDir === 1 ? -1 : 1;
      else {
        rt.state.sortKey = key;
        rt.state.sortDir = 1;
      }
      rt.state.page = 1;
      syncSortUI(rt);
      update(rt);
      return;
    }

    const collapseButton = target.closest<HTMLElement>('[data-grid-collapse]');
    if (collapseButton) {
      const scopeKey = collapseButton.dataset.gridCollapse ?? '';
      const parent = collapseButton.closest('tr');
      const open = collapseButton.getAttribute('aria-expanded') !== 'false';
      collapseButton.setAttribute('aria-expanded', String(!open));
      collapseButton.setAttribute(
        'aria-label',
        `${open ? 'Expand' : 'Collapse'} ${collapseButton.dataset.gridCollapse?.split(':')[1] ?? ''}`,
      );
      const icon = collapseButton.querySelector('svg');
      if (icon instanceof SVGElement) icon.style.transform = open ? '' : 'rotate(90deg)';
      let sibling = parent?.nextElementSibling;
      while (sibling instanceof HTMLTableRowElement && sibling.dataset.gridChild === scopeKey) {
        sibling.hidden = open;
        sibling = sibling.nextElementSibling;
      }
      return;
    }

    const expandButton = target.closest<HTMLElement>('[data-grid-expand]');
    if (expandButton) {
      const row = expandButton.closest<HTMLTableRowElement>('tr');
      if (row) toggleRowDetail(row);
      return;
    }

    const actionButton = target.closest<HTMLElement>('[data-grid-action]');
    if (actionButton) {
      const row = actionButton.closest<HTMLTableRowElement>('tr[data-row-key]');
      const record = row ? rt.byKey.get(row.dataset.rowKey ?? '') : undefined;
      if (!row || !record) return;
      const action = actionButton.dataset.gridAction ?? '';

      if (action === 'view') {
        if (rt.cfg.expandable) {
          toggleRowDetail(row);
        } else {
          toast(
            `${record.name} — ${record.team} · ${record.role} · joined ${record.joined}`,
            'info',
          );
        }
        return;
      }

      if (action === 'edit') {
        const cell = row.querySelector<HTMLElement>('td[contenteditable="true"]');
        if (cell) {
          cell.focus();
          const range = document.createRange();
          range.selectNodeContents(cell);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        } else {
          toast(`${record.name}: this grid has no editable columns`, 'warning');
        }
        return;
      }

      if (action === 'delete') {
        const key = row.dataset.rowKey ?? '';
        rt.rows = rt.rows.filter((item) => item.key !== key);
        rt.byKey.delete(key);
        rt.state.selection.delete(key);
        update(rt);
        toast(`${record.name} removed`, 'danger');
      }
      return;
    }

    const pageButton = target.closest<HTMLElement>('.zak-page-btn');
    if (pageButton && rt.pager?.contains(pageButton) && pageButton.dataset.page) {
      rt.state.page = Number(pageButton.dataset.page);
      update(rt);
      return;
    }

    const colsButton = target.closest<HTMLElement>('[data-grid-cols-btn]');
    if (colsButton) {
      const menu = root.querySelector<HTMLElement>('[data-grid-cols-menu]');
      if (menu) {
        menu.hidden = !menu.hidden;
        colsButton.setAttribute('aria-expanded', String(!menu.hidden));
      }
      return;
    }

    const refreshButton = target.closest<HTMLElement>('[data-grid-refresh]');
    if (refreshButton) {
      toast('Data refreshed', 'success');
      update(rt);
      return;
    }

    const clearAll = target.closest<HTMLElement>('button.zak-btn--link');
    if (clearAll && clearAll.textContent.trim() === 'Clear all') {
      root.querySelectorAll('[data-zak-chip]').forEach((chip) => chip.remove());
      root.querySelectorAll<HTMLSelectElement>('[data-grid-filter]').forEach((select) => {
        select.value = '';
        rt.state.filters[select.dataset.gridFilter ?? ''] = '';
      });
      rt.state.page = 1;
      update(rt);
    }
  });

  root.addEventListener('change', (event) => {
    const target = event.target;

    if (target instanceof HTMLSelectElement) {
      if (target.matches('[data-grid-filter]')) {
        rt.state.filters[target.dataset.gridFilter ?? ''] = target.value;
        rt.state.page = 1;
        update(rt);
      } else if (target.matches('[data-grid-pagesize]')) {
        rt.state.pageSize = Number(target.value) || rt.state.pageSize;
        rt.state.page = 1;
        update(rt);
      }
      return;
    }

    if (!(target instanceof HTMLInputElement)) return;

    if (target.matches('[data-grid-check-all]')) {
      const boxes = Array.from(
        rt.body.querySelectorAll<HTMLInputElement>('tr[data-row-key] input[type="checkbox"]'),
      );
      for (const box of boxes) {
        box.checked = target.checked;
        const row = box.closest<HTMLTableRowElement>('tr[data-row-key]');
        const key = row?.dataset.rowKey;
        if (!key) continue;
        if (target.checked) rt.state.selection.add(key);
        else rt.state.selection.delete(key);
        row?.classList.toggle('is-selected', target.checked);
      }
      syncCheckAll(rt);
      syncBulk(rt);
      return;
    }

    if (target.matches('[data-grid-col]')) {
      const key = target.dataset.gridCol ?? '';
      const column = rt.cfg.columns.find((col) => col.key === key);
      if (column) {
        column.hidden = !target.checked;
        syncColumnVisibility(rt, key, column.hidden);
      }
      return;
    }

    const row = target.closest<HTMLTableRowElement>('tr[data-row-key]');
    if (row && target.type === 'checkbox') {
      const key = row.dataset.rowKey ?? '';
      if (target.checked) rt.state.selection.add(key);
      else rt.state.selection.delete(key);
      row.classList.toggle('is-selected', target.checked);
      syncCheckAll(rt);
      syncBulk(rt);
    }
  });

  root.addEventListener('focusout', (event) => {
    const cell = elementOf(event.target)?.closest<HTMLTableCellElement>(
      'td[contenteditable="true"]',
    );
    if (cell) commitEdit(rt, cell);
  });

  root.addEventListener('keydown', (event) => {
    const cell = elementOf(event.target)?.closest<HTMLTableCellElement>(
      'td[contenteditable="true"]',
    );
    if (!cell) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      cell.blur(); // focusout commits
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cell.textContent = cell.dataset.value ?? '';
      cell.classList.remove('is-invalid');
      cell.blur();
    }
  });
}

/* ---- Column menu dismissal (document-level) ------------------------------------------------------------ */

document.addEventListener('pointerdown', (event) => {
  if (!(event.target instanceof Element)) return;
  const target: Node = event.target;
  document.querySelectorAll<HTMLElement>('[data-zak-grid]').forEach((grid) => {
    const menu = grid.querySelector<HTMLElement>('[data-grid-cols-menu]');
    if (!menu || menu.hidden) return;
    const button = grid.querySelector('[data-grid-cols-btn]');
    if (menu.contains(target) || button?.contains(target)) return;
    menu.hidden = true;
    button?.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll<HTMLElement>('[data-grid-cols-menu]').forEach((menu) => {
    if (menu.hidden) return;
    menu.hidden = true;
    menu.closest('[data-zak-grid]')?.querySelector('[data-grid-cols-btn]')?.setAttribute('aria-expanded', 'false');
  });
});

/* ---- Boot + playground re-init ---------------------------------------------------------------------------- */

function parseConfig(element: HTMLElement): GridConfig | null {
  const script = element.querySelector('script[data-grid-config]');
  if (!script?.textContent) return null;
  try {
    const raw = JSON.parse(script.textContent) as Partial<GridConfig>;
    return {
      selectable: !!raw.selectable,
      expandable: !!raw.expandable,
      resizable: !!raw.resizable,
      reorderable: !!raw.reorderable,
      editable: raw.editable ?? [],
      actions: Array.isArray(raw.actions) ? raw.actions : [],
      tree: !!raw.tree,
      grouped: !!raw.grouped,
      server: !!raw.server,
      virtual: !!raw.virtual,
      rowCount: raw.rowCount ?? 0,
      pageSize: raw.pageSize ?? 6,
      presetFilters: raw.presetFilters ?? {},
      emptyText: raw.emptyText ?? 'No rows match the current filters.',
      columns: (raw.columns ?? []).map((column) => ({
        key: column.key,
        label: column.label,
        sortable: !!column.sortable,
        numeric: !!column.numeric,
        hidden: !!column.hidden,
      })),
    };
  } catch {
    return null;
  }
}

function initGrids(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>('[data-zak-grid]').forEach((element) => {
    if (runtimes.has(element)) return;
    const cfg = parseConfig(element);
    const body = element.querySelector<HTMLTableSectionElement>('[data-grid-body]');
    if (!cfg || !body) return;

    const state: GridState = {
      page: 1,
      pageSize: cfg.pageSize || 6,
      query: '',
      sortKey: null,
      sortDir: 1,
      filters: { ...cfg.presetFilters },
      selection: new Set(),
      timer: 0,
      rowHeight: 0,
      virtualBound: false,
    };

    const rt: GridRuntime = {
      root: element,
      cfg,
      rows: cfg.virtual
        ? buildVirtualRows(cfg.rowCount || 500)
        : people.map((person) => ({ ...person, key: `p${person.id}` })),
      byKey: new Map(),
      body,
      scroll: element.querySelector<HTMLElement>('.zak-grid__scroll') ?? element,
      count: element.querySelector<HTMLElement>('[data-grid-count]'),
      loading: element.querySelector<HTMLElement>('[data-grid-loading]'),
      pager: element.querySelector<HTMLElement>('[data-grid-pager]'),
      bulk: element.querySelector<HTMLElement>('[data-grid-bulk]'),
      bulkCount: element.querySelector<HTMLElement>('[data-grid-bulk-count]'),
      state,
      request: 0,
    };
    for (const row of rt.rows) rt.byKey.set(row.key, row);
    runtimes.set(element, rt);

    // Preset/initial select values fold into the filter state.
    element.querySelectorAll<HTMLSelectElement>('[data-grid-filter]').forEach((select) => {
      state.filters[select.dataset.gridFilter ?? ''] = select.value;
    });

    // Hidden columns ship in config — mirror them onto the headers once.
    for (const column of cfg.columns) {
      if (column.hidden) syncColumnVisibility(rt, column.key, true);
    }

    bindGrid(rt);
    initResizable(rt);
    initReorderable(rt);

    if (cfg.virtual) {
      state.virtualBound = true;
      let ticking = false;
      rt.scroll.addEventListener(
        'scroll',
        () => {
          if (ticking) return;
          ticking = true;
          window.requestAnimationFrame(() => {
            ticking = false;
            renderVirtual(rt);
          });
        },
        { passive: true },
      );
    }

    if (cfg.server) requestServer(rt);
    else renderAll(rt);
  });
}

initGrids(document);
document.addEventListener('zak:refresh', () => initGrids(document));
