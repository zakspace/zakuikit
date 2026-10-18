/**
 * Demos — Data Grid: the full enterprise grid family.
 * Rows render client-side from the shared dataset (see the grid runtime in
 * scripts) driven by a JSON config embedded in each instance.
 *
 * Every demo renders as a static preview card and ships a curated `codeTpl`
 * that demonstrates each entry in its props API.
 */
import { defineDemo, type DemoDef } from './types';
import { svgIcon } from '../data/icons';
import { teams } from '../data/people';

const sortI = svgIcon('chevrons-up-down', 'zak-icon', 12);
const searchI = svgIcon('search', 'zak-icon', 14);
const columnsI = svgIcon('columns', 'zak-icon', 14);
const refreshI = svgIcon('refresh', 'zak-icon', 14);
const xI = svgIcon('x', 'zak-icon', 11);

interface GridCol {
  key: string;
  label: string;
  sortable?: boolean;
  numeric?: boolean;
  width?: string;
  hidden?: boolean;
}

interface GridOpts {
  columns: GridCol[];
  search?: boolean;
  filters?: Array<{ key: string; label: string; options: string[] }>;
  columnPanel?: boolean;
  selectable?: boolean;
  expandable?: boolean;
  bulk?: boolean;
  pagination?: boolean;
  resizable?: boolean;
  reorderable?: boolean;
  editable?: string[];
  actions?: string[];
  tree?: boolean;
  grouped?: boolean;
  server?: boolean;
  virtual?: boolean;
  rowCount?: number;
  pageSize?: number;
  presetFilters?: Record<string, string>;
  applied?: string[];
  maxHeight?: string;
  emptyText?: string;
}

/** Build one grid instance: static skeleton + embedded JSON config. */
function grid(opts: GridOpts): string {
  const cfg = {
    selectable: !!opts.selectable,
    expandable: !!opts.expandable,
    resizable: !!opts.resizable,
    reorderable: !!opts.reorderable,
    editable: opts.editable ?? [],
    actions: opts.actions ?? [],
    tree: !!opts.tree,
    grouped: !!opts.grouped,
    server: !!opts.server,
    virtual: !!opts.virtual,
    rowCount: opts.rowCount ?? 0,
    pageSize: opts.pageSize ?? 6,
    presetFilters: opts.presetFilters ?? {},
    emptyText: opts.emptyText ?? 'No rows match the current filters.',
    columns: opts.columns.map((c) => ({
      key: c.key,
      label: c.label,
      sortable: !!c.sortable,
      numeric: !!c.numeric,
      hidden: !!c.hidden,
    })),
  };

  const filterRow = opts.filters?.length
    ? `<div class="zak-grid__filters">${opts.filters
        .map(
          (f) =>
            `<select class="zak-select" data-grid-filter="${f.key}" aria-label="Filter by ${f.label}"><option value="">All ${f.label.toLowerCase()}</option>${f.options
              .map((o) => `<option${opts.presetFilters?.[f.key] === o ? ' selected' : ''}>${o}</option>`)
              .join('')}</select>`,
        )
        .join('')}</div>`
    : '';

  const colsMenu = opts.columnPanel
    ? `<div class="zak-grid__cols" hidden data-grid-cols-menu>
        <div class="zak-grid__cols-title">Visible columns</div>
        ${opts.columns
          .map(
            (c) =>
              `<label><input type="checkbox" data-grid-col="${c.key}" ${c.hidden ? '' : 'checked'}/> ${c.label}</label>`,
          )
          .join('\n        ')}
      </div>`
    : '';

  const appliedRow = opts.applied?.length
    ? `<div class="zak-grid__toolbar" style="padding-block:var(--zak-space-2)">
        <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">Active filters</span>
        <div class="zak-saved-filters">${opts.applied
          .map(
            (a) =>
              `<span class="zak-chip" data-zak-chip>${a} <button class="zak-chip__x" type="button" aria-label="Remove filter ${a}">${xI}</button></span>`,
          )
          .join('')}</div>
        <button class="zak-btn zak-btn--link zak-btn--sm" type="button" style="margin-inline-start:auto">Clear all</button>
      </div>`
    : '';

  const headCells = [
    opts.selectable
      ? '<th class="zak-grid__check"><label class="zak-check zak-check--bare"><input type="checkbox" data-grid-check-all aria-label="Select all rows"/></label></th>'
      : '',
    opts.expandable ? '<th class="zak-grid__check" style="width:2.2rem"><span class="zak-visually-hidden">Expand</span></th>' : '',
    ...opts.columns.map(
      (c) =>
        `<th data-grid-th="${c.key}"${c.width ? ` style="width:${c.width}"` : ''}>${
          c.sortable
            ? `<button class="zak-grid__sort" type="button" data-grid-sort="${c.key}">${c.label} ${sortI}</button>`
            : c.label
        }</th>`,
    ),
    opts.actions?.length ? '<th class="zak-grid__row-actions"><span class="zak-visually-hidden">Actions</span></th>' : '',
  ]
    .filter(Boolean)
    .join('');

  const footer = opts.pagination
    ? `<div class="zak-grid__footer">
      <span class="zak-grid__count" data-grid-count>Loading rows…</span>
      <label class="zak-grid__pagesize">Rows
        <select class="zak-select" data-grid-pagesize aria-label="Rows per page">${[5, 10, 25]
          .map((n) => `<option${n === (opts.pageSize ?? 6) ? ' selected' : ''}>${n}</option>`)
          .join('')}</select>
      </label>
      <div class="zak-grid__pager" data-grid-pager></div>
    </div>`
    : '';

  const style = `width:100%;max-width:52rem${opts.maxHeight ? `;--grid-max-height:${opts.maxHeight}` : ''}`;

  return `<div class="zak-grid" data-zak-grid style="${style}">
    <div class="zak-grid__toolbar">
      ${
        opts.search
          ? `<div class="zak-grid__search"><span class="zak-search">${searchI}<input type="search" placeholder="Search…" aria-label="Search rows" data-grid-search/></span></div>`
          : ''
      }
      ${filterRow}
      <div class="zak-grid__actions">
        ${
          opts.columnPanel
            ? `<button class="zak-btn zak-btn--ghost zak-btn--sm" type="button" data-grid-cols-btn aria-expanded="false">${columnsI} Columns</button>`
            : ''
        }
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Refresh data" data-grid-refresh>${refreshI}</button>
        <button class="zak-btn zak-btn--primary zak-btn--sm" type="button">New member</button>
      </div>
      ${colsMenu}
    </div>
    ${appliedRow}
    ${
      opts.bulk
        ? `<div class="zak-grid__bulk" hidden data-grid-bulk>
      <span data-grid-bulk-count>0 selected</span>
      <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Export</button>
      <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Archive</button>
      <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button" style="color:var(--zak-danger-text)">Delete</button>
    </div>`
        : ''
    }
    <div class="zak-grid__scroll">
      <table class="zak-grid__table"${opts.editable?.length ? ' role="grid"' : ''}>
        <thead><tr>${headCells}</tr></thead>
        <tbody data-grid-body></tbody>
      </table>
      <div class="zak-grid__loading" data-grid-loading><span class="zak-spinner zak-spinner--sm"></span> Fetching rows…</div>
    </div>
    ${footer}
    <script type="application/json" data-grid-config>${JSON.stringify(cfg).replace(/</g, '\\u003c')}</script>
  </div>`;
}

const BASE: GridCol[] = [
  { key: 'name', label: 'Member', sortable: true, width: '32%' },
  { key: 'team', label: 'Team', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'usage', label: 'Storage', sortable: true, numeric: true },
];

const teamFilter = { key: 'team', label: 'Teams', options: teams };
const statusFilter = { key: 'status', label: 'Statuses', options: ['active', 'invited', 'suspended'] };

export const gridDemos: Record<string, DemoDef> = {
  'data-grid': defineDemo({
    desc: 'The core grid: sortable headers, a live search box, facet selects, checkbox selection, row expansion, per-row actions and a paginated footer — all state-driven.',
    usage: '<!-- Declare the grid — toolbar, table, pagination generated from JSON config -->\n<div class="zak-grid" data-zak-grid>\n  <script type="application/json" data-grid-config>\n    { "columns": [{"key":"name","label":"Member"},{"key":"team","label":"Team"}],\n      "search": true, "selectable": true, "pagination": true, "pageSize": 5 }\n  <\/script>\n</div>',
    playground: false,
    stage: 'stretch',
    tpl: grid({
      columns: BASE,
      search: true,
      filters: [teamFilter, statusFilter],
      selectable: true,
      expandable: true,
      editable: ['team'],
      actions: ['view', 'edit', 'delete'],
      pagination: true,
      pageSize: 5,
    }),
    codeTpl: `<!-- .zak-grid__sort[data-dir] — sorted column shows a brand chevron -->
<div class="zak-grid" data-zak-grid>
  <div class="zak-grid__toolbar">
    <div class="zak-grid__search">…</div>
    <div class="zak-grid__filters">…</div>
    <div class="zak-grid__actions">…</div>
  </div>
  <div class="zak-grid__scroll">
    <table class="zak-grid__table" role="grid">
      <thead><tr>
        <!-- ZAKUIKit checkbox in the header — the label draws the box -->
        <th class="zak-grid__check">
          <label class="zak-check zak-check--bare">
            <input type="checkbox" data-grid-check-all aria-label="Select all rows"/>
          </label>
        </th>
        <th data-grid-th="name">
          <button class="zak-grid__sort" type="button" data-grid-sort="name" data-dir="asc">Member ▲</button>
        </th>
        <th class="zak-grid__row-actions"><span class="zak-visually-hidden">Actions</span></th>
      </tr></thead>
      <tbody>
        <!-- .zak-grid__table tbody tr.is-selected — brand-subtle row fill -->
        <tr class="is-selected" data-row-key="1">
          <td class="zak-grid__check">
            <label class="zak-check zak-check--bare"><input type="checkbox" aria-label="Select row"/></label>
          </td>
          <td>Aisha Rahman</td>
          <!-- [data-grid-action] — view toggles the detail row, edit focuses the
               contenteditable cell, delete removes the row and re-renders -->
          <td class="zak-grid__row-actions">
            <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm zak-grid__action"
                    type="button" data-grid-action="view" aria-label="View Aisha Rahman">…</button>
            <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm zak-grid__action"
                    type="button" data-grid-action="edit" aria-label="Edit Aisha Rahman">…</button>
            <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm zak-grid__action zak-grid__action--danger"
                    type="button" data-grid-action="delete" aria-label="Delete Aisha Rahman">…</button>
          </td>
        </tr>
        <!-- .zak-grid__detail — expansion row with a sunken full-span panel -->
        <tr class="zak-grid__detail" hidden><td colspan="5">…</td></tr>
      </tbody>
    </table>
  </div>
  <!-- .zak-grid__count — "Showing 1–5 of 24" summary in the footer -->
  <div class="zak-grid__footer">
    <span class="zak-grid__count" data-grid-count>Showing 1–5 of 24</span>
    <div class="zak-grid__pager">…</div>
  </div>
</div>

<!-- The grid reads its feature set from one JSON block — actions lists the
     buttons rendered per row (view | edit | delete or any subset) -->
<script type="application/json" data-grid-config>
{ "columns": [{"key":"name","label":"Member"},{"key":"team","label":"Team"}],
  "selectable": true, "expandable": true, "editable": ["team"],
  "actions": ["view","edit","delete"], "pageSize": 5 }
<\/script>`,
    props: [
      ['.zak-grid__sort[data-dir]', 'attr', '—', 'Sorted column shows a directed brand chevron.'],
      ['.zak-grid__table tbody tr.is-selected', 'class', '—', 'Brand-subtle fill for selected rows.'],
      ['.zak-grid__detail', 'row', '—', 'Expansion row with a sunken full-span panel.'],
      ['.zak-grid__count', 'element', '—', '"Showing 1–5 of 24" summary in the footer.'],
      ['.zak-check--bare', 'class', '—', 'Label-wrapped checkbox so cells use the ZAKUIKit control.'],
      ['.zak-grid__row-actions', 'element', '—', 'Trailing cell holding one button per configured action.'],
      ['data-grid-action', 'attr', 'view | edit | delete', 'Row action: expansion toggle, editable-cell focus or row removal.'],
      ['actions', 'config', 'string[]', 'Names the row actions to render; every action reports through a toast.'],
    ],
    a11y: {
      keys: [
        ['Enter on header', 'Sorts by that column; press again to flip.'],
        ['Space', 'Toggles a row checkbox or expands a row.'],
        ['Tab', 'Visits toolbar, headers, row controls and pager in order.'],
      ],
      aria: [
        ['aria-sort', 'Set on the sorted th — ascending / descending.'],
        ['aria-expanded', 'Reflects row expansion state on the caret.'],
        ['aria-checked / indeterminate', 'Header checkbox mirrors partial selection.'],
      ],
    },
  }),
  'advanced-data-grid': defineDemo({
    desc: 'Everything the grid does, plus column management: a show/hide menu, drag-resizable columns, reorderable order, inline row actions and a bulk bar that appears with the first checked row.',
    playground: false,
    stage: 'stretch',
    tpl: grid({
      columns: [
        ...BASE,
        { key: 'role', label: 'Role', sortable: true, hidden: true },
        { key: 'location', label: 'Location', sortable: true, hidden: true },
      ],
      search: true,
      filters: [teamFilter, statusFilter],
      columnPanel: true,
      selectable: true,
      bulk: true,
      editable: ['name'],
      actions: ['view', 'edit', 'delete'],
      pagination: true,
      resizable: true,
      reorderable: true,
      pageSize: 5,
    }),
    codeTpl: `<!-- .zak-grid__cols — column checklist popover -->
<div class="zak-grid__cols" hidden data-grid-cols-menu>
  <div class="zak-grid__cols-title">Visible columns</div>
  <label><input type="checkbox" data-grid-col="role" checked/> Role</label>
  <label><input type="checkbox" data-grid-col="location"/> Location</label>
</div>

<!-- .zak-grid__resizer — 5px drag handle on each header edge -->
<th data-grid-th="name">
  Member
  <span class="zak-grid__resizer"></span>
</th>

<!-- draggable th — header drag reorders columns; .is-dragover shows the drop edge -->
<th data-grid-th="team" draggable="true" class="is-dragover">Team</th>

<!-- .zak-grid__bulk — brand strip with batch actions while selection exists -->
<div class="zak-grid__bulk" hidden data-grid-bulk>
  <span data-grid-bulk-count>0 selected</span>
  <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Delete</button>
</div>

<!-- .zak-grid__row-actions — trailing cell, one [data-grid-action] button per row -->
<td class="zak-grid__row-actions">
  <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm zak-grid__action"
          type="button" data-grid-action="view" aria-label="View row">…</button>
  <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm zak-grid__action"
          type="button" data-grid-action="edit" aria-label="Edit row">…</button>
  <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm zak-grid__action zak-grid__action--danger"
          type="button" data-grid-action="delete" aria-label="Delete row">…</button>
</td>`,
    props: [
      ['.zak-grid__cols', 'element', '—', 'Column checklist popover; checkboxes toggle `.is-hidden`.'],
      ['.zak-grid__resizer', 'element', '—', '5px drag handle on each header edge.'],
      ['draggable th', 'attr', '—', 'Header drag reorders columns; `.is-dragover` shows the drop edge.'],
      ['.zak-grid__bulk', 'element', '—', 'Brand strip with batch actions while selection exists.'],
      ['actions', 'config', 'string[]', 'Renders the row action rail — view opens detail, edit focuses the cell, delete removes the row.'],
      ['data-grid-action', 'attr', 'view | edit | delete', 'Action button contract; each one reports through a toast.'],
    ],
  }),
  'server-side-data-grid': defineDemo({
    desc: 'Manual data lifecycle: every sort, filter or page change issues a request — the grid overlays a loading state, then swaps the rows and range label.',
    playground: false,
    stage: 'stretch',
    tpl: grid({
      columns: [...BASE, { key: 'joined', label: 'Joined', sortable: true }],
      search: true,
      filters: [teamFilter],
      pagination: true,
      server: true,
      pageSize: 5,
      emptyText: 'No rows returned for this request.',
    }),
    codeTpl: `<!-- data-grid-loading — absolute overlay; .is-visible reveals it -->
<div class="zak-grid__loading" data-grid-loading>
  <span class="zak-spinner zak-spinner--sm"></span> Fetching rows…
</div>

<!-- zak:gridrequest — one integration point for every state change -->
grid.addEventListener('zak:gridrequest', async () => {
  const res = await fetch('/api/members');
  renderRows(await res.json());
  updateRangeLabel(result.from, result.to, result.total);
});

<!-- range label — always echo the server's totals -->
<span class="zak-grid__count" data-grid-count>1–5 of 24</span>`,
    js: `grid.addEventListener('zak:gridrequest', async () => {
  grid.classList.add('is-loading');           // overlay via [data-grid-loading]
  const res = await fetch(\`/api/members?\${params}\`);
  renderRows(await res.json());               // swap tbody
  updateRangeLabel(result.from, result.to, result.total);
  grid.classList.remove('is-loading');
});`,
    props: [
      ['data-grid-loading', 'element', '—', 'Absolute overlay with blur; `.is-visible` reveals it.'],
      ['zak:gridrequest', 'event', '—', 'Dispatched on every state change — one integration point.'],
      ['range label', 'pattern', '—', 'Always update "1–5 of 24" with the server’s numbers.'],
    ],
    notes: ['Debounce free-text search (~300 ms) so keystrokes do not become requests.'],
  }),
  'virtual-data-grid': defineDemo({
    desc: 'Windowed rendering: 500 rows, but only the visible slice lives in the DOM. Two spacer rows preserve the scrollbar height while you fly through.',
    playground: false,
    stage: 'stretch',
    tpl: grid({
      columns: [
        { key: 'name', label: 'User', width: '30%' },
        { key: 'email', label: 'Email' },
        { key: 'usage', label: 'Events', numeric: true },
        { key: 'balance', label: 'Balance', numeric: true },
      ],
      virtual: true,
      rowCount: 500,
      maxHeight: '17rem',
    }),
    codeTpl: `<!-- .zak-grid__vpad — spacer row whose height equals the off-screen count -->
<tr class="zak-grid__vpad" aria-hidden="true"><td colspan="4" style="height:1840px">
  1840 rows above
</td></tr>
<tr>…12 visible rows…</tr>
<tr class="zak-grid__vpad" aria-hidden="true"><td colspan="4" style="height:4160px">
  4160 rows below
</td></tr>

<!-- --grid-max-height — scroll port height that defines the render window -->
<div class="zak-grid" data-zak-grid style="--grid-max-height:17rem">…</div>

<!-- overscan — 6 extra rows rendered beyond the viewport to absorb fast scrolling -->`,
    props: [
      ['.zak-grid__vpad', 'element', '—', 'Spacer row whose height equals the off-screen row count.'],
      ['--grid-max-height', 'token', '-', 'Scroll port height that defines the render window.'],
      ['overscan', 'technique', '6 rows', 'Rows rendered beyond the viewport to absorb fast scrolling.'],
    ],
    notes: ['Virtualization trades native Ctrl+F reach for constant DOM cost — keep real search in the toolbar.'],
  }),
  'editable-data-grid': defineDemo({
    desc: 'In-cell editing: click a cell, type, press Tab or click away to commit. Invalid values flash the danger ring and keep focus for correction.',
    playground: false,
    stage: 'stretch',
    tpl: grid({
      columns: [
        { key: 'name', label: 'Member', sortable: true, width: '30%' },
        { key: 'team', label: 'Team' },
        { key: 'role', label: 'Role' },
        { key: 'location', label: 'Location' },
        { key: 'balance', label: 'Balance', numeric: true },
      ],
      search: true,
      editable: ['role', 'location'],
      pageSize: 5,
    }),
    codeTpl: `<!-- contenteditable="true" — editable cells; Tab moves to the next cell -->
<td class="zak-grid__cell-edit" contenteditable="true" data-value="Editor">Editor</td>

<!-- .zak-grid__cell-edit — hover surface + focus ring for the cell value -->
<td class="zak-grid__cell-edit" contenteditable="true">Editor</td>

<!-- is-invalid — danger focus ring keeps focus until the value parses -->
<td class="zak-grid__cell-edit is-invalid" contenteditable="true">300%</td>`,
    js: `cell.addEventListener('blur', () => {
  if (cell.textContent.trim() === cell.dataset.value) return;
  if (!validate(cell.textContent)) {
    cell.classList.add('is-invalid');   // brand → danger focus ring
    cell.focus();
    return;
  }
  commit(cell.dataset.row, cell.dataset.col, cell.textContent);
});`,
    props: [
      ['contenteditable="true"', 'attr', '—', 'Editable cells; Tab moves to the next cell.'],
      ['.zak-grid__cell-edit', 'element', '—', 'Hover surface + focus ring for the cell value.'],
      ['is-invalid', 'class', '—', 'Danger focus ring keeps focus until the value parses.'],
    ],
    a11y: {
      keys: [
        ['Enter / F2', 'Begins editing the focused cell.'],
        ['Escape', 'Abandons the edit and restores the old value.'],
        ['Tab / Shift+Tab', 'Commits and moves to the adjacent cell.'],
      ],
      aria: [
        ['role="grid"', 'Editable grids switch on grid semantics with row/col indices.'],
        ['aria-readonly', 'Mark computed columns read-only instead of restyling them.'],
      ],
    },
  }),
  'tree-data-grid': defineDemo({
    desc: 'Parent teams roll up member rows with indent guides. Collapsing a parent hides the subtree without touching pagination math.',
    playground: false,
    stage: 'stretch',
    tpl: grid({
      columns: [
        { key: 'name', label: 'Team / Member', width: '34%' },
        { key: 'status', label: 'Status' },
        { key: 'usage', label: 'Storage', sortable: true, numeric: true },
        { key: 'balance', label: 'Balance', numeric: true },
      ],
      tree: true,
      pagination: false,
      maxHeight: '26rem',
    }),
    codeTpl: `<!-- toggle cell — caret with aria-expanded on each parent row -->
<tr>
  <td><button class="zak-grid__toggle" type="button" aria-expanded="true">▾</button> Platform</td>
  <!-- rollup — parent numeric cells show subtree totals -->
  <td class="zak-grid__num">12.4 GB</td>
</tr>

<!-- indent — child label steps in within the parent column -->
<tr>
  <td class="zak-grid__indent">api-gateway</td>
  <td class="zak-grid__num">6.1 GB</td>
</tr>`,
    props: [
      ['toggle cell', 'element', '—', 'Caret with aria-expanded on each parent row.'],
      ['indent', 'pattern', '—', 'Child cells share the parent column but step the label in.'],
      ['rollup', 'pattern', '—', 'Parent numeric cells show subtree totals.'],
    ],
  }),
  'grouped-data-grid': defineDemo({
    desc: 'Rows grouped by a column with aggregate summaries. Group headers count members and sum storage; expanding a group reveals its rows.',
    playground: false,
    stage: 'stretch',
    tpl: grid({
      columns: [
        { key: 'name', label: 'Member', width: '34%' },
        { key: 'status', label: 'Status' },
        { key: 'usage', label: 'Storage', sortable: true, numeric: true },
        { key: 'balance', label: 'Balance', numeric: true },
      ],
      grouped: true,
      pagination: false,
      maxHeight: '26rem',
    }),
    codeTpl: `<!-- .zak-grid__group — muted aggregate row with count and totals -->
<tr class="zak-grid__group">
  <td>Platform <span class="zak-badge zak-badge--counter">5</span></td>
  <td class="zak-grid__num">20.4 GB</td>
</tr>

<!-- groupBy — one group per distinct value of the column -->
<tr class="zak-grid__group" data-zak-group="team" data-group-value="Platform">…</tr>`,
    props: [
      ['.zak-grid__group', 'row', '—', 'Muted aggregate row with count and totals.'],
      ['groupBy', 'config', 'team', 'One group per distinct value of the column.'],
    ],
  }),
  'column-selector': defineDemo({
    desc: 'A checklist popover that drives column visibility. Hidden columns carry `.is-hidden` on their header and cells — no re-render needed.',
    playground: false,
    stage: 'stretch',
    tpl: grid({
      columns: [
        ...BASE,
        { key: 'role', label: 'Role', hidden: true },
        { key: 'joined', label: 'Joined', hidden: true },
      ],
      search: true,
      columnPanel: true,
      pagination: true,
      pageSize: 5,
    }),
    codeTpl: `<!-- aria-expanded — reflects the menu state on the trigger -->
<button class="zak-btn zak-btn--ghost zak-btn--sm" data-grid-cols-btn
        aria-expanded="false" aria-controls="cols-menu">
  Columns
</button>

<!-- .zak-grid__cols — anchored checklist; closes on outside click and Escape -->
<div class="zak-grid__cols" id="cols-menu" hidden>
  <div class="zak-grid__cols-title">Visible columns</div>
  <label><input type="checkbox" data-grid-col="role" checked/> Role</label>
  <label><input type="checkbox" data-grid-col="joined"/> Joined</label>
</div>

<!-- is-hidden — applied to the matching th and td at the same time -->
<th data-grid-th="joined" class="is-hidden">Joined</th>`,
    props: [
      ['.zak-grid__cols', 'element', '—', 'Anchored checklist; closes on outside click and Escape.'],
      ['is-hidden', 'class', '—', 'Applied to matching th and td simultaneously.'],
      ['aria-expanded', 'attr', '—', 'Reflects menu state on the trigger button.'],
    ],
  }),
  'column-reordering': defineDemo({
    desc: 'Drag any header to rearrange columns. The drop target shows an inset brand edge; the order persists with the grid state.',
    playground: false,
    stage: 'stretch',
    tpl: grid({
      columns: [
        { key: 'name', label: 'Member', sortable: true, width: '30%' },
        { key: 'team', label: 'Team', sortable: true },
        { key: 'role', label: 'Role' },
        { key: 'location', label: 'Location' },
        { key: 'usage', label: 'Storage', numeric: true },
      ],
      reorderable: true,
      search: true,
      pagination: true,
      pageSize: 5,
    }),
    codeTpl: `<!-- draggable="true" — headers become drag sources with a grab cursor -->
<th data-grid-th="team" draggable="true">Team</th>

<!-- .is-dragover — inset brand edge marks the drop position -->
<th data-grid-th="name" class="is-dragover">Member</th>`,
    js: `th.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/col', th.dataset.col));
th.addEventListener('dragover', (e) => {
  e.preventDefault();
  th.classList.add('is-dragover');          // inset brand edge
});
th.addEventListener('drop', (e) => reorder(e.dataTransfer.getData('text/col'), th.dataset.col));`,
    props: [
      ['draggable="true"', 'attr', '—', 'Headers become drag sources; cursor: grab affordance.'],
      ['.is-dragover', 'class', '—', '3px inset brand shadow marks the drop position.'],
    ],
    notes: ['Keyboard alternative: focus a header and use Alt+← / Alt+→ to move the column.'],
  }),
  'column-resizing': defineDemo({
    desc: 'Column edges are drag handles. The handle brightens on hover and thickens to brand while dragging, with live width feedback.',
    playground: false,
    stage: 'stretch',
    tpl: grid({
      columns: [
        { key: 'name', label: 'Member', sortable: true, width: '220px' },
        { key: 'team', label: 'Team', width: '110px' },
        { key: 'role', label: 'Role', width: '180px' },
        { key: 'usage', label: 'Storage', numeric: true, width: '130px' },
      ],
      resizable: true,
      pagination: true,
      pageSize: 5,
    }),
    codeTpl: `<!-- .zak-grid__resizer — 5px full-height handle on the header's trailing edge -->
<th data-grid-th="name" style="width:220px">
  Member
  <span class="zak-grid__resizer"></span>
</th>

<!-- .is-active — brand-colored handle while the pointer is captured -->
<span class="zak-grid__resizer is-active"></span>

<!-- table-layout — fixed layout keeps widths predictable while dragging -->
<table class="zak-grid__table" style="table-layout:fixed">…</table>`,
    js: `handle.addEventListener('pointerdown', (e) => {
  handle.setPointerCapture(e.pointerId);
  handle.classList.add('is-active');
  const startX = e.clientX;
  const startW = th.offsetWidth;
  handle.addEventListener('pointermove', (ev) => {
    th.style.width = \`\${Math.max(80, startW + ev.clientX - startX)}px\`;
  }, { once: false });
});`,
    props: [
      ['.zak-grid__resizer', 'element', '—', '5px full-height handle pinned to the header’s trailing edge.'],
      ['.is-active', 'class', '—', 'Brand-colored handle while the pointer is captured.'],
      ['table-layout', 'css', 'fixed', 'Fixed layout keeps widths predictable while dragging.'],
    ],
  }),
  'row-selection': defineDemo({
    desc: 'Selection states up close: header select-all with indeterminate support, brand-subtle row fills and a live count in the footer.',
    playground: false,
    stage: 'stretch',
    tpl: grid({
      columns: BASE,
      selectable: true,
      pagination: true,
      pageSize: 6,
    }),
    codeTpl: `<!-- tr.is-selected — brand-subtle fill on every cell of the row -->
<tr class="is-selected">
  <td class="zak-grid__check">
    <!-- aria-label — row checkboxes name their row for screen readers -->
    <input type="checkbox" checked aria-label="Select Alina Popescu"/>
  </td>
  …
</tr>

<!-- indeterminate — header checkbox shows the partial state via JS -->
<input type="checkbox" data-grid-check-all aria-label="Select all rows"/>`,
    props: [
      ['tr.is-selected', 'class', '—', 'Brand-subtle fill on every cell of the row.'],
      ['indeterminate', 'attr', '—', 'Header checkbox shows the partial state via JS.'],
      ['aria-label', 'attr', '—', 'Row checkboxes name their row for screen readers.'],
    ],
  }),
  'row-expansion': defineDemo({
    desc: 'Drill-down rows: the caret rotates, a sunken detail panel opens inline, and only one expansion per row keeps the table visually quiet.',
    playground: false,
    stage: 'stretch',
    tpl: grid({
      columns: BASE,
      expandable: true,
      pagination: true,
      pageSize: 5,
    }),
    codeTpl: `<!-- is-expanded — muted fill on the parent row while its detail is open -->
<tr class="is-expanded">…</tr>

<!-- .zak-grid__detail — sunken full-span panel under the expanded row -->
<tr class="zak-grid__detail">
  <td colspan="5">
    <!-- .zak-grid__detail-inner — auto-fit grid, 180px minimum -->
    <div class="zak-grid__detail-inner">
      <div><div class="zak-hint">Role</div>Staff Engineer</div>
      <div><div class="zak-hint">Location</div>London</div>
      <div><div class="zak-hint">Joined</div>2023-11-03</div>
    </div>
  </td>
</tr>`,
    props: [
      ['.zak-grid__detail', 'row', '—', 'Sunken full-span panel under the expanded row.'],
      ['.zak-grid__detail-inner', 'element', '—', 'Auto-fit grid, 180px minimum — survives narrow widths.'],
      ['is-expanded', 'class', '—', 'Muted fill on the parent row while its detail is open.'],
    ],
  }),
  'data-grid-toolbar': defineDemo({
    desc: 'The command strip: search, facet selects, column toggle, refresh and the primary action — plus a second row of applied-filter chips with one-tap removal.',
    playground: false,
    stage: 'stretch',
    tpl: grid({
      columns: BASE,
      search: true,
      filters: [teamFilter, statusFilter],
      columnPanel: true,
      applied: ['Team: Platform', 'Status: active'],
      pagination: true,
      pageSize: 5,
    }),
    codeTpl: `<!-- .zak-grid__toolbar — wraps and reflows: search grows, chips wrap -->
<div class="zak-grid__toolbar">
  <div class="zak-grid__search"><input type="search" aria-label="Search rows"/></div>
  <div class="zak-grid__filters"><select class="zak-select" aria-label="Team">…</select></div>
  <!-- .zak-grid__actions — pushed right with margin-inline-start:auto -->
  <div class="zak-grid__actions">
    <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Columns</button>
    <button class="zak-btn zak-btn--primary zak-btn--sm" type="button">New member</button>
  </div>
</div>

<!-- applied chips — removable chips make current state visible and undoable -->
<div class="zak-saved-filters">
  <span class="zak-chip" data-zak-chip>Team: Platform
    <button class="zak-chip__x" type="button" aria-label="Remove filter Team: Platform"><svg class="zak-icon" aria-hidden="true">…</svg></button>
  </span>
  <span class="zak-chip" data-zak-chip>Status: active
    <button class="zak-chip__x" type="button" aria-label="Remove filter Status: active"><svg class="zak-icon" aria-hidden="true">…</svg></button>
  </span>
</div>`,
    props: [
      ['.zak-grid__toolbar', 'element', '—', 'Wraps and reflows: search grows, chips wrap, actions pin right.'],
      ['.zak-grid__actions', 'element', '—', 'Pushed right with margin-inline-start:auto.'],
      ['applied chips', 'pattern', '—', 'Removable chips make current state visible and undoable.'],
    ],
    notes: ['Keep the toolbar one row on desktop: search ≤300px, selects width:auto, overflow folds under 720px.'],
  }),
  'data-grid-filter': defineDemo({
    desc: 'Column-scoped filtering: each facet select owns one column, the preset state ships applied, and the footer count confirms the narrowed set.',
    playground: false,
    stage: 'stretch',
    tpl: grid({
      columns: BASE,
      filters: [teamFilter, statusFilter],
      presetFilters: { team: 'Platform' },
      pagination: true,
      pageSize: 5,
    }),
    codeTpl: `<!-- data-grid-filter — named like its column key; empty value means no constraint -->
<select class="zak-select" data-grid-filter="team" aria-label="Filter by team">
  <option value="">All teams</option>
  <option selected>Platform</option>
</select>

<!-- page reset — filtering always returns to page one -->
grid.dataset.page = '1';

<!-- count echo — the footer range shows the filtered total -->
<span class="zak-grid__count" data-grid-count>1–3 of 3</span>`,
    js: `filters.forEach((select) => {
  select.addEventListener('change', () => {
    state.filters[select.dataset.gridFilter] = select.value;
    state.page = 1;                     // always reset to page one
    applyFilters();                     // recompute state.filtered
    render();                           // rows + count + pager
  });
});`,
    props: [
      ['data-grid-filter', 'attr', '—', 'Named like its column key; empty value means no constraint.'],
      ['page reset', 'pattern', '—', 'Filtering always returns to page 1.'],
      ['count echo', 'pattern', '—', 'Footer range shows the filtered total, not the dataset total.'],
    ],
  }),
  'filter-builder': defineDemo({
    desc: 'Composable filter rows: pick a field, an operator and a value, flip AND/OR joins between rows, and remove conditions with the trailing button.',
    playground: false,
    tpl: `<div class="zak-filter-builder" style="width:100%;max-width:44rem">
    <div class="zak-filter-row">
      <span class="zak-filter-row__join">Where</span>
      <select class="zak-select" aria-label="Field"><option>Team</option><option>Status</option><option>Storage</option><option>Location</option></select>
      <select class="zak-select" aria-label="Operator"><option>is</option><option>is not</option><option>contains</option></select>
      <input class="zak-input" value="Platform" aria-label="Value"/>
      <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Remove condition" style="margin-inline-start:auto">${xI}</button>
    </div>
    <div class="zak-filter-row">
      <span class="zak-filter-row__join">And</span>
      <select class="zak-select" aria-label="Field"><option>Status</option><option>Team</option></select>
      <select class="zak-select" aria-label="Operator"><option>is</option><option>is not</option></select>
      <select class="zak-select" aria-label="Value"><option>active</option><option>invited</option><option>suspended</option></select>
      <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Remove condition" style="margin-inline-start:auto">${xI}</button>
    </div>
    <div class="zak-filter-row">
      <span class="zak-filter-row__join">Or</span>
      <select class="zak-select" aria-label="Field"><option>Storage</option><option>Team</option></select>
      <select class="zak-select" aria-label="Operator"><option>greater than</option><option>less than</option></select>
      <input class="zak-input" value="200 GB" aria-label="Value"/>
      <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Remove condition" style="margin-inline-start:auto">${xI}</button>
    </div>
    <div class="zak-flex">
      <button class="zak-btn zak-btn--outline zak-btn--sm" type="button">${svgIcon('plus', 'zak-icon', 13)} Add condition</button>
      <button class="zak-btn zak-btn--primary zak-btn--sm" type="button" style="margin-inline-start:auto">Apply filters</button>
    </div>
  </div>`,
    codeTpl: `<!-- .zak-filter-row — one condition: join, field, operator, value, remove -->
<div class="zak-filter-row">
  <span class="zak-filter-row__join">Where</span>
  <select class="zak-select" aria-label="Field"><option>Team</option></select>
  <select class="zak-select" aria-label="Operator"><option>is</option></select>
  <input class="zak-input" value="Platform" aria-label="Value"/>
  <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Remove condition">✕</button>
</div>

<!-- reflow — rows wrap under 560px; controls keep intrinsic widths -->
<div class="zak-builder" style="flex-wrap:wrap">…</div>`,
    js: `builder.addEventListener('click', (event) => {
  const remove = event.target.closest('[aria-label^="Remove"]');
  if (remove) remove.closest('.zak-filter-row').remove();
});`,
    props: [
      ['.zak-filter-row', 'element', '—', 'One condition: join chip, field, operator, value, remove.'],
      ['.zak-filter-row__join', 'element', '—', 'Where / And / Or chip in the row gutter.'],
      ['reflow', 'css', '—', 'Rows wrap under 560px; controls keep intrinsic widths.'],
    ],
    a11y: {
      keys: [
        ['Tab', 'Walks field → operator → value → remove for each row.'],
        ['Enter', 'Applies the builder when focus is on the Apply button.'],
      ],
      aria: [
        ['aria-label', 'Every select and the remove button are labelled per row.'],
      ],
    },
  }),
  'query-builder': defineDemo({
    desc: 'Nested logic for advanced queries: OR of two groups, the first group ANDs two conditions. Indent guides show nesting without extra chrome.',
    playground: false,
    tpl: `<div class="zak-qb" style="width:100%;max-width:44rem" role="group" aria-label="Query builder">
    <span class="zak-qb__group-label">Match <select class="zak-select" style="height:1.7rem;font-size:var(--zak-text-xs);width:auto;padding-block:0" aria-label="Match mode"><option>any</option><option>all</option></select> of the following groups</span>
    <div class="zak-qb__group">
      <span class="zak-qb__group-label">All of <span class="zak-badge zak-badge--counter">2</span></span>
      <div class="zak-filter-row">
        <select class="zak-select" aria-label="Field"><option>Team</option><option>Status</option></select>
        <select class="zak-select" aria-label="Operator"><option>is</option><option>is not</option></select>
        <input class="zak-input" value="Platform" aria-label="Value"/>
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Remove condition">${xI}</button>
      </div>
      <div class="zak-filter-row">
        <select class="zak-select" aria-label="Field"><option>Storage</option><option>Balance</option></select>
        <select class="zak-select" aria-label="Operator"><option>greater than</option></select>
        <input class="zak-input" value="120" aria-label="Value"/>
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Remove condition">${xI}</button>
      </div>
      <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button" style="align-self:flex-start">${svgIcon('plus', 'zak-icon', 13)} Condition</button>
    </div>
    <div class="zak-qb__group">
      <span class="zak-qb__group-label">Any of <span class="zak-badge zak-badge--counter">1</span></span>
      <div class="zak-filter-row">
        <select class="zak-select" aria-label="Field"><option>Location</option><option>Role</option></select>
        <select class="zak-select" aria-label="Operator"><option>contains</option><option>is</option></select>
        <input class="zak-input" value="Berlin" aria-label="Value"/>
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Remove condition">${xI}</button>
      </div>
    </div>
    <div class="zak-flex">
      <button class="zak-btn zak-btn--outline zak-btn--sm" type="button">${svgIcon('plus', 'zak-icon', 13)} Add group</button>
      <button class="zak-btn zak-btn--primary zak-btn--sm" type="button" style="margin-inline-start:auto">Run query</button>
    </div>
  </div>`,
    codeTpl: `<div class="zak-qb">
  <span class="zak-qb__group-label">Match any of the following groups</span>

  <!-- .zak-qb__group — nestable container with a brand indent guide -->
  <div class="zak-qb__group">
    <!-- .zak-qb__group-label — All of / Any of with a live count badge -->
    <span class="zak-qb__group-label">All of <span class="zak-badge zak-badge--counter">2</span></span>
    <div class="zak-filter-row">…</div>

    <!-- nesting — groups recurse; the guide line encodes depth -->
    <div class="zak-qb__group">
      <span class="zak-qb__group-label">Any of <span class="zak-badge zak-badge--counter">1</span></span>
      <div class="zak-filter-row">…</div>
    </div>
  </div>
</div>`,
    props: [
      ['.zak-qb__group', 'element', '—', 'Nestable container with a brand indent guide.'],
      ['.zak-qb__group-label', 'element', '—', 'All of / Any of with a live count badge.'],
      ['nesting', 'technique', '—', 'Groups recurse — the guide line encodes depth.'],
    ],
  }),
  'saved-filters': defineDemo({
    desc: 'Persisted presets as removable chips: click to reapply the whole filter set, or save the current combination as a new one.',
    playground: false,
    tpl: `<div class="zak-stack zak-stack--lg" style="width:100%;max-width:40rem">
    <div class="zak-saved-filters">
      <button class="zak-chip zak-chip--interactive is-active" type="button" aria-pressed="true">My team · active</button>
      <span class="zak-chip" data-zak-chip>Overdue invoices <button class="zak-chip__x" type="button" aria-label="Remove saved filter Overdue invoices">${xI}</button></span>
      <span class="zak-chip" data-zak-chip>Large workspaces <button class="zak-chip__x" type="button" aria-label="Remove saved filter Large workspaces">${xI}</button></span>
      <button class="zak-chip zak-chip--interactive" type="button" aria-pressed="false">${svgIcon('plus', 'zak-icon', 12)} Save current</button>
    </div>
    ${grid({
      columns: BASE,
      presetFilters: { status: 'active' },
      pagination: true,
      pageSize: 4,
    })}
  </div>`,
    codeTpl: `<!-- chip preset — one chip = one stored filter state; click reapplies it -->
<div class="zak-saved-filters">
  <!-- .zak-chip--interactive — the applied preset reads as pressed -->
  <button class="zak-chip zak-chip--interactive is-active" type="button" aria-pressed="true">My team · active</button>
  <span class="zak-chip" data-zak-chip>Overdue invoices <button class="zak-chip__x" type="button" aria-label="Remove saved filter Overdue invoices">✕</button></span>
  <!-- Save current — prompts for a name, then appends a new chip -->
  <button class="zak-chip zak-chip--interactive" type="button" aria-pressed="false">＋ Save current</button>
</div>`,
    props: [
      ['chip preset', 'pattern', '—', 'One chip = one stored filter state; click reapplies it.'],
      ['.zak-chip--interactive', 'class', '—', 'The applied preset reads as pressed.'],
      ['Save current', 'pattern', '—', 'Prompts for a name, then appends a new chip.'],
    ],
    notes: ['Persist presets per user server-side; align the chip list to the filters schema so states stay compatible.'],
  }),
};
