/**
 * Demos — Tables: semantic table patterns from simple lists to rich datasets.
 *
 * Every demo renders as a static preview card and ships a curated `codeTpl`
 * that demonstrates each entry in its props API.
 */
import { defineDemo, type DemoDef } from './types';
import { svgIcon } from '../data/icons';
import { people, type Person } from '../data/people';

const chevDown = svgIcon('chevron-down', 'zak-icon', 12);
const chevRight = svgIcon('chevron-right', 'zak-icon', 14);
const chevLeft = svgIcon('chevron-left', 'zak-icon', 13);
const searchI = svgIcon('search', 'zak-icon', 14);
const editI = svgIcon('edit', 'zak-icon', 14);
const copyI = svgIcon('copy', 'zak-icon', 14);
const trashI = svgIcon('trash', 'zak-icon', 14);
const downloadI = svgIcon('download', 'zak-icon', 14);

const tone: Record<Person['status'], [string, string]> = {
  active: ['success', 'Active'],
  invited: ['warning', 'Invited'],
  suspended: ['danger', 'Suspended'],
};

const statusBadge = (p: Person) =>
  `<span class="zak-badge zak-badge--${tone[p.status][0]}"><span class="zak-badge__dot"></span>${tone[p.status][1]}</span>`;

const personCell = (p: Person) =>
  `<span style="display:inline-flex;align-items:center;gap:var(--zak-space-2)"><span class="zak-avatar zak-avatar--xs">${p.initials}</span><span style="display:flex;flex-direction:column;line-height:1.35"><span style="font-weight:var(--zak-weight-medium)">${p.name}</span><span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">${p.email}</span></span></span>`;

const usageCell = (p: Person) =>
  `<span style="display:inline-flex;align-items:center;gap:var(--zak-space-2);min-width:6.5rem"><span class="zak-progress zak-progress--sm" style="flex:1;max-width:4rem"><span class="zak-progress__bar" style="--value:${Math.min(Math.round(p.usage / 3), 100)}%"></span></span><span class="zak-table__num" style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">${p.usage} GB</span></span>`;

const memberRow = (p: Person) =>
  `<tr><td>${personCell(p)}</td><td>${p.team}</td><td>${statusBadge(p)}</td><td>${usageCell(p)}</td></tr>`;

const memberHead = `<thead>
      <tr><th scope="col">Member</th><th scope="col">Team</th><th scope="col">Status</th><th scope="col">Storage</th></tr>
    </thead>`;

const who = people.slice(0, 9);

export const tableDemos: Record<string, DemoDef> = {
  table: defineDemo({
    desc: 'The base data table: muted header strip, hairline row separators, numeric alignment and a wrapping scroll container. Semantics are pure `<table>` — no display:none accessibility debt.',
    playground: false,
    stage: 'stretch',
    tpl: `<div class="zak-table-wrap" style="width:100%;max-width:44rem">
    <table class="zak-table zak-table--hover">
      ${memberHead}
      <tbody>
        ${who.slice(0, 5).map(memberRow).join('\n        ')}
      </tbody>
      <caption>Showing 5 of 24 members</caption>
    </table>
  </div>`,
    codeTpl: `<!-- .zak-table-wrap — rounded shell with overflow:auto -->
<div class="zak-table-wrap">
  <!-- .zak-table — collapsed borders, 480px min width -->
  <table class="zak-table zak-table--hover">
    <!-- caption sits below the table as a range summary -->
    <caption>Showing 5 of 24 members</caption>
    <thead>
      <!-- scope="col" associates each header with its column -->
      <tr>
        <th scope="col">Member</th>
        <th scope="col">Team</th>
        <th scope="col">Status</th>
        <th scope="col" class="zak-table__num">Storage</th>
      </tr>
    </thead>
    <tbody>…</tbody>
  </table>
</div>`,
    examples: [
      {
        title: 'Hover and striped',
        desc: '`--hover` fills the row under the pointer; `--striped` fills alternate rows with the muted surface and hover still wins on top of it.',
        stage: 'stretch',
        tpl: `<div class="zak-table-wrap" style="width:100%;max-width:40rem">
    <table class="zak-table zak-table--striped zak-table--hover">
      ${memberHead}
      <tbody>
        ${who.slice(0, 4).map(memberRow).join('\n        ')}
      </tbody>
    </table>
  </div>`,
        code: `<table class="zak-table zak-table--striped zak-table--hover">
  <thead>
    <tr><th scope="col">Member</th><th scope="col">Team</th><th scope="col">Status</th><th scope="col">Storage</th></tr>
  </thead>
  <tbody>
    <tr><td>…</td><td>…</td><td>…</td><td>…</td></tr>
  </tbody>
</table>`,
      },
      {
        title: 'Bordered grid',
        desc: '`--bordered` draws a hairline on every cell edge — the right density for printed or spreadsheet-like output.',
        stage: 'stretch',
        tpl: `<div class="zak-table-wrap" style="width:100%;max-width:40rem">
    <table class="zak-table zak-table--bordered">
      ${memberHead}
      <tbody>
        ${who.slice(0, 3).map(memberRow).join('\n        ')}
      </tbody>
    </table>
  </div>`,
        code: `<table class="zak-table zak-table--bordered">
  <thead>…</thead>
  <tbody>…</tbody>
</table>`,
      },
      {
        title: 'Compact',
        desc: '`--compact` drops cell padding from 12px/16px to 8px/12px and the font one step — for dense reference data.',
        stage: 'stretch',
        tpl: `<div class="zak-table-wrap" style="width:100%;max-width:40rem">
    <table class="zak-table zak-table--compact">
      ${memberHead}
      <tbody>
        ${who.slice(0, 5).map(memberRow).join('\n        ')}
      </tbody>
    </table>
  </div>`,
        code: `<table class="zak-table zak-table--compact">
  <thead>…</thead>
  <tbody>…</tbody>
</table>`,
      },
      {
        title: 'Sticky header',
        desc: 'The wrapper owns the scroll port via `max-height`; `--sticky` pins `thead th` so column context never scrolls away.',
        stage: 'stretch',
        tpl: `<div class="zak-table-wrap" style="width:100%;max-width:40rem;max-height:11.5rem">
    <table class="zak-table zak-table--sticky zak-table--hover">
      ${memberHead}
      <tbody>
        ${people.slice(0, 12).map(memberRow).join('\n        ')}
      </tbody>
    </table>
  </div>`,
        code: `<!-- max-height goes on the shell — it is the scroll port -->
<div class="zak-table-wrap" style="max-height:11.5rem">
  <table class="zak-table zak-table--sticky">
    <thead>…</thead>
    <tbody>…</tbody>
  </table>
</div>`,
      },
      {
        title: 'Right-aligned numerics',
        desc: '`.zak-table__num` on both the header and the cell tabulates figures so digits stay in one column.',
        stage: 'stretch',
        tpl: `<div class="zak-table-wrap" style="width:100%;max-width:34rem">
    <table class="zak-table">
      <thead>
        <tr><th scope="col">Service</th><th scope="col" class="zak-table__num">Requests</th><th scope="col" class="zak-table__num">p95</th></tr>
      </thead>
      <tbody>
        <tr><td>api-gateway</td><td class="zak-table__num">1 284 930</td><td class="zak-table__num">182 ms</td></tr>
        <tr><td>auth-service</td><td class="zak-table__num">962 118</td><td class="zak-table__num">74 ms</td></tr>
        <tr><td>search-index</td><td class="zak-table__num">41 605</td><td class="zak-table__num">512 ms</td></tr>
      </tbody>
    </table>
  </div>`,
        code: `<table class="zak-table">
  <thead>
    <!-- .zak-table__num on the header right-aligns the whole column -->
    <tr>
      <th scope="col">Service</th>
      <th scope="col" class="zak-table__num">Requests</th>
      <th scope="col" class="zak-table__num">p95</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>api-gateway</td><td class="zak-table__num">1 284 930</td><td class="zak-table__num">182 ms</td></tr>
  </tbody>
</table>`,
      },
      {
        title: 'Scrolling shell',
        desc: 'Narrow container, wide table: the shell scrolls horizontally while the rounded border and caption stay put.',
        stage: 'stretch',
        tpl: `<div class="zak-table-wrap" style="width:100%;max-width:26rem">
    <table class="zak-table zak-table--hover">
      <thead>
        <tr><th scope="col">Member</th><th scope="col">Team</th><th scope="col">Role</th><th scope="col">Status</th><th scope="col" class="zak-table__num">Storage</th></tr>
      </thead>
      <tbody>
        ${who.slice(0, 3).map((p) => `<tr><td>${p.name}</td><td>${p.team}</td><td>${p.role}</td><td>${statusBadge(p)}</td><td class="zak-table__num">${p.usage} GB</td></tr>`).join('\n        ')}
      </tbody>
      <caption>Scroll sideways for the remaining columns</caption>
    </table>
  </div>`,
        code: `<!-- .zak-table-wrap keeps the scrollbars inside the rounded shell -->
<div class="zak-table-wrap">
  <!-- .zak-table holds a 480px min width, so narrow shells scroll -->
  <table class="zak-table">
    <thead>
      <tr>
        <th scope="col">Member</th>
        <th scope="col">Team</th>
        <th scope="col">Role</th>
        <th scope="col">Status</th>
        <th scope="col" class="zak-table__num">Storage</th>
      </tr>
    </thead>
    <tbody>…</tbody>
    <caption>Scroll sideways for the remaining columns</caption>
  </table>
</div>`,
      },
    ],
    props: [
      ['.zak-table-wrap', 'class', '—', 'Rounded border shell with overflow:auto for narrow viewports.'],
      ['.zak-table', 'class', '—', 'Collapsed borders, 480px min width, tabular-friendly.'],
      ['caption', 'element', '—', 'Sits below the table; use it for range summaries.'],
      ['scope="col"', 'attr', '—', 'Marks header cells for screen readers.'],
    ],
    a11y: {
      keys: [
        ['Tab', 'Moves through interactive cells (links, buttons) only.'],
        ['↑ / ↓', 'Screen-reader table mode row navigation.'],
      ],
      aria: [
        ['scope="col"', 'Associates each header with its column.'],
        ['caption', 'Announced as the table summary.'],
      ],
    },
  }),
  'data-table': defineDemo({
    desc: 'The complete table unit: toolbar with title, count and actions, the table itself and a footer with pagination and page-size control.',
    playground: false,
    stage: 'stretch',
    tpl: `<div style="width:100%;max-width:48rem">
    <div class="zak-table-toolbar" style="border:1px solid var(--zak-border-subtle);border-block-end:0;border-radius:var(--zak-radius-lg) var(--zak-radius-lg) 0 0">
      <span class="zak-table-toolbar__title">Team members</span>
      <span class="zak-table-toolbar__count">24 people · 3 invited</span>
      <span style="display:flex;gap:var(--zak-space-2)">
        <button class="zak-btn zak-btn--outline zak-btn--sm" type="button">${downloadI} Export</button>
        <button class="zak-btn zak-btn--primary zak-btn--sm" type="button">Invite</button>
      </span>
    </div>
    <div class="zak-table-wrap" style="border-radius:0 0 var(--zak-radius-lg) var(--zak-radius-lg)">
      <table class="zak-table zak-table--hover">
        ${memberHead}
        <tbody>
          ${who.slice(0, 6).map(memberRow).join('\n          ')}
        </tbody>
      </table>
    </div>
    <div style="display:flex;align-items:center;gap:var(--zak-space-3);margin-block-start:var(--zak-space-3);flex-wrap:wrap">
      <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary)">Rows per page
        <select class="zak-select zak-input--sm" style="width:4.5rem;display:inline-flex" aria-label="Rows per page"><option>10</option><option>25</option><option>50</option></select>
      </span>
      <span style="margin-inline-start:auto"></span>
      <nav class="zak-pagination" aria-label="Pagination">
        <button class="zak-page-btn" type="button" disabled aria-label="Previous page">${chevLeft}</button>
        <button class="zak-page-btn is-active" type="button" aria-current="page">1</button>
        <button class="zak-page-btn" type="button">2</button>
        <button class="zak-page-btn" type="button">3</button>
        <span class="zak-page-ellipsis">…</span>
        <button class="zak-page-btn" type="button">12</button>
        <button class="zak-page-btn" type="button" aria-label="Next page">${chevRight}</button>
      </nav>
    </div>
  </div>`,
    codeTpl: `<!-- .zak-table-toolbar__title — pushed left by margin-inline-end:auto -->
<div class="zak-table-toolbar">
  <span class="zak-table-toolbar__title">Team members</span>
  <!-- .zak-table-toolbar__count — tertiary summary next to the title -->
  <span class="zak-table-toolbar__count">24 people · 3 invited</span>
  <button class="zak-btn zak-btn--outline zak-btn--sm" type="button">Export</button>
  <button class="zak-btn zak-btn--primary zak-btn--sm" type="button">Invite</button>
</div>

<table class="zak-table zak-table--hover">…</table>

<!-- .zak-pagination — footer control; pair with a page-size select -->
<div style="display:flex;align-items:center;gap:var(--zak-space-3);flex-wrap:wrap">
  <select class="zak-select zak-input--sm" aria-label="Rows per page">
    <option>10</option><option>25</option><option>50</option>
  </select>
  <nav class="zak-pagination" aria-label="Pagination">
    <button class="zak-page-btn" type="button" disabled aria-label="Previous page">‹</button>
    <button class="zak-page-btn is-active" type="button" aria-current="page">1</button>
    <button class="zak-page-btn" type="button">2</button>
    <button class="zak-page-btn" type="button" aria-label="Next page">›</button>
  </nav>
</div>`,
    props: [
      ['.zak-table-toolbar__title', 'element', '—', 'Pushed left by `margin-inline-end:auto`.'],
      ['.zak-table-toolbar__count', 'element', '—', 'Tertiary summary next to the title.'],
      ['.zak-pagination', 'class', '—', 'Footer control; pair with a page-size select.'],
    ],
  }),
  'sortable-table': defineDemo({
    desc: 'Click-to-sort headers. The active column shows a directed chevron in brand; `aria-sort` conveys the direction to assistive tech.',
    playground: false,
    stage: 'stretch',
    tpl: `<div class="zak-table-wrap" style="width:100%;max-width:46rem" data-zak-table-sort>
    <table class="zak-table zak-table--hover">
      <thead>
        <tr>
          <th scope="col" aria-sort="ascending"><button class="zak-table__sort" type="button" data-dir="asc">Member ${chevDown}</button></th>
          <th scope="col"><button class="zak-table__sort" type="button">Team ${chevDown}</button></th>
          <th scope="col" aria-sort="descending"><button class="zak-table__sort" type="button" data-dir="desc">Storage ${chevDown}</button></th>
          <th scope="col"><button class="zak-table__sort" type="button">Joined ${chevDown}</button></th>
        </tr>
      </thead>
      <tbody>
        ${who
          .slice(0, 6)
          .map(
            (p) =>
              `<tr><td>${personCell(p)}</td><td>${p.team}</td><td class="zak-table__num">${p.usage} GB</td><td>${p.joined}</td></tr>`,
          )
          .join('\n        ')}
      </tbody>
    </table>
  </div>`,
    codeTpl: `<!-- .zak-table__sort[data-dir="asc"] — brand chevron points up -->
<th scope="col" aria-sort="ascending">
  <button class="zak-table__sort" type="button" data-dir="asc">Member ▲</button>
</th>

<!-- .zak-table__sort[data-dir="desc"] — chevron rotates, rows descend -->
<th scope="col" aria-sort="descending">
  <button class="zak-table__sort" type="button" data-dir="desc">Storage ▼</button>
</th>

<!-- aria-sort is set on the th; omit it for none -->
<th scope="col">
  <button class="zak-table__sort" type="button">Team ▼</button>
</th>`,
    js: `header.addEventListener('click', () => {
  const next = header.dataset.dir === 'asc' ? 'desc' : 'asc';
  header.dataset.dir = next;
  th.setAttribute('aria-sort', next === 'asc' ? 'ascending' : 'descending');
  sortRows(column, next);
});`,
    examples: [
      {
        title: 'Sorted and unsorted headers',
        desc: 'One button per sortable column; `data-dir` carries the direction for the chevron and `aria-sort` carries it for assistive tech.',
        stage: 'stretch',
        tpl: `<div class="zak-table-wrap" style="width:100%;max-width:40rem">
    <table class="zak-table">
      <thead>
        <tr>
          <th scope="col" aria-sort="ascending"><button class="zak-table__sort" type="button" data-dir="asc">Member ${chevDown}</button></th>
          <th scope="col"><button class="zak-table__sort" type="button">Team ${chevDown}</button></th>
          <th scope="col" aria-sort="descending"><button class="zak-table__sort" type="button" data-dir="desc">Storage ${chevDown}</button></th>
        </tr>
      </thead>
      <tbody>
        ${who.slice(0, 3).map((p) => `<tr><td>${personCell(p)}</td><td>${p.team}</td><td class="zak-table__num">${p.usage} GB</td></tr>`).join('\n        ')}
      </tbody>
    </table>
  </div>`,
        code: `<!-- data-dir="asc" — brand chevron points up; aria-sort mirrors it on the th -->
<th scope="col" aria-sort="ascending">
  <button class="zak-table__sort" type="button" data-dir="asc">Member<svg class="zak-icon" aria-hidden="true">…</svg></button>
</th>

<!-- data-dir="desc" — the same chevron rotates 180° -->
<th scope="col" aria-sort="descending">
  <button class="zak-table__sort" type="button" data-dir="desc">Storage<svg class="zak-icon" aria-hidden="true">…</svg></button>
</th>

<!-- Unsorted columns keep the button and simply omit both attributes -->
<th scope="col">
  <button class="zak-table__sort" type="button">Team<svg class="zak-icon" aria-hidden="true">…</svg></button>
</th>`,
      },
    ],
    props: [
      ['.zak-table__sort[data-dir="asc"]', 'attr', '—', 'Brand chevron pointing up; rows ascending.'],
      ['.zak-table__sort[data-dir="desc"]', 'attr', '—', 'Chevron rotates 180°; rows descending.'],
      ['aria-sort', 'attr', 'none', 'Set on the `<th>`: ascending | descending | none.'],
    ],
    a11y: {
      keys: [
        ['Enter / Space', 'Sorts by the focused column header.'],
        ['Click again', 'Flips the sort direction.'],
      ],
      aria: [
        ['aria-sort', 'Announced on the header cell, not the button.'],
        ['aria-label', 'Optional: "Sort by storage, descending".'],
      ],
    },
  }),
  'responsive-table': defineDemo({
    desc: 'On narrow screens the wrapper scrolls horizontally while the table keeps a comfortable minimum width — data stays readable instead of collapsing into mystery pancakes.',
    playground: false,
    stage: 'stretch',
    tpl: `<div class="zak-table-wrap" style="width:100%;max-width:34rem">
    <table class="zak-table zak-table--hover" style="min-width:640px">
      ${memberHead.replace('</tr>', '<th scope="col">Location</th></tr>')}
      <tbody>
        ${who
          .slice(0, 5)
          .map(
            (p) =>
              `<tr><td>${personCell(p)}</td><td>${p.team}</td><td>${statusBadge(p)}</td><td>${usageCell(p)}</td><td>${p.location}</td></tr>`,
          )
          .join('\n        ')}
      </tbody>
      <caption>Scroll horizontally — the wrapper owns the overflow, the page never does.</caption>
    </table>
  </div>`,
    codeTpl: `<!-- min-width: 640px — raise the minimum so columns keep breathing room -->
<div class="zak-table-wrap">
  <table class="zak-table zak-table--hover" style="min-width:640px">
    <thead>…</thead>
    <tbody>…</tbody>
    <caption>Scroll horizontally — the wrapper owns the overflow.</caption>
  </table>
</div>

<!-- .zak-table-wrap — overflow:auto contains the scrollbars in the rounded shell -->
<div class="zak-table-wrap" style="max-width:34rem">…</div>`,
    props: [
      ['min-width: 640px', 'css', '480px', 'Raise the minimum so columns keep breathing room.'],
      ['.zak-table-wrap', 'class', '—', 'overflow:auto contains the scrollbars inside the rounded shell.'],
    ],
    notes: ['If a table must be reduced below ~600px, re-compose rows as cards instead of shrinking type.'],
  }),
  'striped-table': defineDemo({
    desc: 'Zebra striping trades hover interaction for permanent scan lanes — ideal for read-first tables inside touch kiosks or printouts.',
    playground: false,
    stage: 'stretch',
    tpl: `<div class="zak-table-wrap" style="width:100%;max-width:44rem">
    <table class="zak-table zak-table--striped zak-table--hover">
      ${memberHead}
      <tbody>
        ${who.slice(0, 6).map(memberRow).join('\n        ')}
      </tbody>
    </table>
  </div>`,
    codeTpl: `<!-- --striped — even rows take the muted surface -->
<table class="zak-table zak-table--striped">
  <tbody>…</tbody>
</table>

<!-- --striped + --hover — hover wins on striped rows so feedback stays visible -->
<table class="zak-table zak-table--striped zak-table--hover">
  <tbody>…</tbody>
</table>`,
    props: [
      ['--striped', 'modifier', '—', 'Even rows take the muted surface.'],
      ['--striped + --hover', 'combination', '—', 'Hover wins on striped rows so feedback stays visible.'],
    ],
  }),
  'bordered-table': defineDemo({
    desc: 'The full-grid presentation: every cell outlined. Best for comparison matrices and values that read column-first.',
    playground: false,
    stage: 'stretch',
    tpl: `<div class="zak-table-wrap" style="width:100%;max-width:40rem">
    <table class="zak-table zak-table--bordered zak-table--compact">
      <thead>
        <tr><th scope="col">Plan</th><th scope="col" class="zak-table__num">Seats</th><th scope="col" class="zak-table__num">Retention</th><th scope="col" class="zak-table__num">SLA</th></tr>
      </thead>
      <tbody>
        <tr><td>Starter</td><td class="zak-table__num">1–5</td><td class="zak-table__num">7 days</td><td class="zak-table__num">—</td></tr>
        <tr><td>Team</td><td class="zak-table__num">6–50</td><td class="zak-table__num">90 days</td><td class="zak-table__num">99.5%</td></tr>
        <tr><td>Business</td><td class="zak-table__num">51–500</td><td class="zak-table__num">1 year</td><td class="zak-table__num">99.9%</td></tr>
        <tr><td>Enterprise</td><td class="zak-table__num">500+</td><td class="zak-table__num">Custom</td><td class="zak-table__num">99.99%</td></tr>
      </tbody>
    </table>
  </div>`,
    codeTpl: `<!-- --bordered + --compact — 1px grid on every edge, tighter padding -->
<table class="zak-table zak-table--bordered zak-table--compact">
  <thead>
    <tr>
      <th scope="col">Plan</th>
      <th scope="col" class="zak-table__num">Seats</th>
      <th scope="col" class="zak-table__num">SLA</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Team</td>
      <!-- .zak-table__num — right-aligns and enables tabular numerals -->
      <td class="zak-table__num">6–50</td>
      <td class="zak-table__num">99.5%</td>
    </tr>
  </tbody>
</table>`,
    props: [
      ['--bordered', 'modifier', '—', '1px grid on every cell edge.'],
      ['--compact', 'modifier', '—', 'Tightens padding to 8px/12px.'],
      ['.zak-table__num', 'class', '—', 'Right-aligns and enables tabular numerals.'],
    ],
  }),
  'compact-table': defineDemo({
    desc: 'Information-dense rows for operator consoles: smaller padding, tighter type, more columns per viewport without losing alignment.',
    playground: false,
    stage: 'stretch',
    tpl: `<div class="zak-table-wrap" style="width:100%;max-width:52rem">
    <table class="zak-table zak-table--compact zak-table--hover">
      <thead>
        <tr><th scope="col">ID</th><th scope="col">Member</th><th scope="col">Team</th><th scope="col">Role</th><th scope="col">Location</th><th scope="col">Joined</th></tr>
      </thead>
      <tbody>
        ${who
          .slice(0, 8)
          .map(
            (p) =>
              `<tr><td class="zak-table__num">#${String(p.id).padStart(4, '0')}</td><td>${p.name}</td><td>${p.team}</td><td>${p.role}</td><td>${p.location}</td><td>${p.joined}</td></tr>`,
          )
          .join('\n        ')}
      </tbody>
    </table>
  </div>`,
    codeTpl: `<!-- --compact — cells drop to 8px/12px; type falls from 14px to 13px -->
<table class="zak-table zak-table--compact zak-table--hover">
  <thead>
    <tr><th scope="col">ID</th><th scope="col">Member</th><th scope="col">Team</th></tr>
  </thead>
  <tbody>
    <tr><td class="zak-table__num">#0001</td><td>Alina Popescu</td><td>Platform</td></tr>
    <tr><td class="zak-table__num">#0002</td><td>Marcus Webb</td><td>Platform</td></tr>
  </tbody>
</table>`,
    props: [
      ['--compact', 'modifier', '—', 'Cells drop from 12px/16px to 8px/12px; font 14→13px.'],
    ],
    notes: ['Compact tables are for desktop consoles — restore default density below 768px if touch input is expected.'],
  }),
  'expandable-table': defineDemo({
    desc: 'Rows drill into inline detail panels. The expander rotates to point down while open; detail rows reuse the full column span.',
    playground: false,
    stage: 'stretch',
    tpl: `<div class="zak-table-wrap" style="width:100%;max-width:48rem" data-zak-table-expand>
    <table class="zak-table zak-table--hover">
      <thead>
        <tr><th scope="col" style="width:2.5rem"></th><th scope="col">Deployment</th><th scope="col">Environment</th><th scope="col">Status</th><th scope="col" class="zak-table__num">Duration</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><button class="zak-table__expand is-open" type="button" aria-expanded="true" aria-label="Collapse deployment 4821">${chevRight}</button></td>
          <td style="font-weight:var(--zak-weight-medium)">#4821 · api-gateway</td>
          <td>Production</td>
          <td><span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Healthy</span></td>
          <td class="zak-table__num">2m 48s</td>
        </tr>
        <tr class="zak-table__detail-row">
          <td colspan="5">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--zak-space-4)">
              <div><div class="zak-hint">Commit</div><div>a41f9c2 — “harden retry budget”</div></div>
              <div><div class="zak-hint">Nodes</div><div>12 of 12 upgraded</div></div>
              <div><div class="zak-hint">Health checks</div><div>144 passed · 0 failed</div></div>
              <div><div class="zak-hint">p95 latency</div><div>184 ms (−8.2%)</div></div>
            </div>
          </td>
        </tr>
        <tr>
          <td><button class="zak-table__expand" type="button" aria-expanded="false" aria-label="Expand deployment 4820">${chevRight}</button></td>
          <td style="font-weight:var(--zak-weight-medium)">#4820 · worker-pool</td>
          <td>Production</td>
          <td><span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Healthy</span></td>
          <td class="zak-table__num">1m 12s</td>
        </tr>
        <tr>
          <td><button class="zak-table__expand" type="button" aria-expanded="false" aria-label="Expand deployment 4819">${chevRight}</button></td>
          <td style="font-weight:var(--zak-weight-medium)">#4819 · scheduler</td>
          <td>Staging</td>
          <td><span class="zak-badge zak-badge--warning"><span class="zak-badge__dot"></span>Degraded</span></td>
          <td class="zak-table__num">3m 05s</td>
        </tr>
      </tbody>
    </table>
  </div>`,
    codeTpl: `<!-- .zak-table__expand — caret button; .is-open rotates it 90° -->
<button class="zak-table__expand is-open" type="button" aria-expanded="true"
        aria-label="Collapse deployment 4821">▸</button>

<!-- aria-expanded — announce state, then toggle row visibility -->
<button class="zak-table__expand" type="button" aria-expanded="false"
        aria-label="Expand deployment 4820">▸</button>

<!-- .zak-table__detail-row — sunken full-span drill-down panel -->
<tr class="zak-table__detail-row">
  <td colspan="5">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--zak-space-4)">
      <div><div class="zak-hint">Commit</div>a41f9c2</div>
      <div><div class="zak-hint">Nodes</div>12 of 12</div>
    </div>
  </td>
</tr>`,
    js: `button.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  button.classList.toggle('is-open', !open);
  button.closest('tr').nextElementSibling.hidden = open;
});`,
    props: [
      ['.zak-table__expand', 'element', '—', 'Caret button; `.is-open` rotates it 90°.'],
      ['.zak-table__detail-row', 'element', '—', 'Sunken full-span panel for the drill-down.'],
      ['aria-expanded', 'attr', 'false', 'On the expander; announce state, then toggle row visibility.'],
    ],
    a11y: {
      keys: [
        ['Enter / Space', 'Toggles the focused row’s detail panel.'],
      ],
      aria: [
        ['aria-expanded', 'Reflects the open/closed panel state.'],
        ['aria-label', 'Name the row in the expander label — "Expand deployment 4821".'],
      ],
    },
  }),
  'tree-table': defineDemo({
    desc: 'Hierarchical rows with depth-driven indents. Parent rows summarize children; the caret collapses the whole subtree while every column stays aligned.',
    playground: false,
    stage: 'stretch',
    tpl: `<div class="zak-table-wrap" style="width:100%;max-width:48rem" data-zak-table-tree>
    <table class="zak-table zak-table--hover">
      <thead>
        <tr><th scope="col">Service</th><th scope="col" class="zak-table__num">Instances</th><th scope="col" class="zak-table__num">CPU</th><th scope="col" class="zak-table__num">Memory</th></tr>
      </thead>
      <tbody>
        <tr data-level="0" aria-expanded="true">
          <td class="zak-table__indent" style="--depth:0"><span class="zak-table__tree"><button class="zak-table__toggle" type="button" aria-label="Collapse platform">${chevRight}</button>platform <span class="zak-badge zak-badge--counter">6</span></span></td>
          <td class="zak-table__num">19</td><td class="zak-table__num">48%</td><td class="zak-table__num">44.5 GB</td>
        </tr>
        <tr data-level="1"><td class="zak-table__indent" style="--depth:1">api-gateway</td><td class="zak-table__num">3</td><td class="zak-table__num">41%</td><td class="zak-table__num">6.1 GB</td></tr>
        <tr data-level="1" aria-expanded="true">
          <td class="zak-table__indent" style="--depth:1"><span class="zak-table__tree"><button class="zak-table__toggle" type="button" aria-label="Collapse worker-pool">${chevRight}</button>worker-pool</span></td>
          <td class="zak-table__num">12</td><td class="zak-table__num">67%</td><td class="zak-table__num">24.8 GB</td>
        </tr>
        <tr data-level="2"><td class="zak-table__indent" style="--depth:2">pool · eu-central-1</td><td class="zak-table__num">8</td><td class="zak-table__num">71%</td><td class="zak-table__num">16.2 GB</td></tr>
        <tr data-level="2"><td class="zak-table__indent" style="--depth:2">pool · us-east-2</td><td class="zak-table__num">4</td><td class="zak-table__num">58%</td><td class="zak-table__num">8.6 GB</td></tr>
        <tr data-level="1"><td class="zak-table__indent" style="--depth:1">scheduler</td><td class="zak-table__num">1</td><td class="zak-table__num">12%</td><td class="zak-table__num">1.2 GB</td></tr>
        <tr data-level="1"><td class="zak-table__indent" style="--depth:1">audit-log</td><td class="zak-table__num">3</td><td class="zak-table__num">9%</td><td class="zak-table__num">2.4 GB</td></tr>
        <tr data-level="0" aria-expanded="false">
          <td class="zak-table__indent" style="--depth:0"><span class="zak-table__tree"><button class="zak-table__toggle" type="button" aria-label="Expand data">${chevRight}</button>data <span class="zak-badge zak-badge--counter">4</span></span></td>
          <td class="zak-table__num">6</td><td class="zak-table__num">52%</td><td class="zak-table__num">41.0 GB</td>
        </tr>
        <tr data-level="1" hidden><td class="zak-table__indent" style="--depth:1">postgres-cluster</td><td class="zak-table__num">3</td><td class="zak-table__num">64%</td><td class="zak-table__num">28.0 GB</td></tr>
        <tr data-level="1" hidden><td class="zak-table__indent" style="--depth:1">clickhouse</td><td class="zak-table__num">2</td><td class="zak-table__num">44%</td><td class="zak-table__num">11.4 GB</td></tr>
        <tr data-level="1" hidden><td class="zak-table__indent" style="--depth:1">blob index</td><td class="zak-table__num">1</td><td class="zak-table__num">6%</td><td class="zak-table__num">1.6 GB</td></tr>
        <tr data-level="0" aria-expanded="false">
          <td class="zak-table__indent" style="--depth:0"><span class="zak-table__tree"><button class="zak-table__toggle" type="button" aria-label="Expand infra">${chevRight}</button>infra <span class="zak-badge zak-badge--counter">3</span></span></td>
          <td class="zak-table__num">3</td><td class="zak-table__num">22%</td><td class="zak-table__num">8.6 GB</td>
        </tr>
        <tr data-level="1" hidden><td class="zak-table__indent" style="--depth:1">edge cache</td><td class="zak-table__num">2</td><td class="zak-table__num">26%</td><td class="zak-table__num">6.1 GB</td></tr>
        <tr data-level="1" hidden><td class="zak-table__indent" style="--depth:1">runner pool</td><td class="zak-table__num">1</td><td class="zak-table__num">14%</td><td class="zak-table__num">2.5 GB</td></tr>
      </tbody>
    </table>
  </div>`,
    codeTpl: `<!-- Parent row: --depth sets the indent, data-level drives collapse math -->
<tr data-level="0" aria-expanded="true">
  <td class="zak-table__indent" style="--depth:0">
    <!-- .zak-table__tree keeps toggle, label and badge on one baseline -->
    <span class="zak-table__tree">
      <button class="zak-table__toggle" type="button" aria-label="Collapse platform"><svg class="zak-icon" aria-hidden="true">…</svg></button>
      platform <span class="zak-badge zak-badge--counter">6</span>
    </span>
  </td>
  <!-- .zak-table__num right-aligns numerics so levels stay aligned -->
  <td class="zak-table__num">19</td>
  <td class="zak-table__num">48%</td>
</tr>

<!-- Child row: one level deeper -->
<tr data-level="1"><td class="zak-table__indent" style="--depth:1">api-gateway</td><td class="zak-table__num">3</td></tr>

<!-- Grandchild row -->
<tr data-level="2"><td class="zak-table__indent" style="--depth:2">pool · eu-central-1</td><td class="zak-table__num">8</td></tr>

<!-- Collapsed children simply carry hidden; the caret rotation is pure CSS -->
<tr data-level="1" hidden><td class="zak-table__indent" style="--depth:1">postgres-cluster</td></tr>`,
    examples: [
      {
        title: 'Nesting levels',
        desc: '`--depth` sets the indent and `data-level` records the same number for the collapse math — one step per hierarchy level.',
        stage: 'stretch',
        tpl: `<div class="zak-table-wrap" style="width:100%;max-width:38rem" data-zak-table-tree>
    <table class="zak-table zak-table--hover">
      <thead>
        <tr><th scope="col">Service</th><th scope="col" class="zak-table__num">Hosts</th><th scope="col" class="zak-table__num">Storage</th></tr>
      </thead>
      <tbody>
        <tr data-level="0" aria-expanded="true"><td class="zak-table__indent" style="--depth:0"><span class="zak-table__tree"><button class="zak-table__toggle" type="button" aria-label="Collapse platform">${chevRight}</button>platform <span class="zak-badge zak-badge--counter">3</span></span></td><td class="zak-table__num">19</td><td class="zak-table__num">48.2 GB</td></tr>
        <tr data-level="1"><td class="zak-table__indent" style="--depth:1">api-gateway</td><td class="zak-table__num">3</td><td class="zak-table__num">12.4 GB</td></tr>
        <tr data-level="2"><td class="zak-table__indent" style="--depth:2">pool · eu-central-1</td><td class="zak-table__num">8</td><td class="zak-table__num">6.1 GB</td></tr>
      </tbody>
    </table>
  </div>`,
        code: `<!-- Parent row: --depth drives the padding, data-level the collapse math -->
<tr data-level="0" aria-expanded="true">
  <td class="zak-table__indent" style="--depth:0">
    <!-- .zak-table__tree keeps toggle, label and badge on one baseline -->
    <span class="zak-table__tree">
      <button class="zak-table__toggle" type="button" aria-label="Collapse platform"><svg class="zak-icon" aria-hidden="true">…</svg></button>
      platform <span class="zak-badge zak-badge--counter">3</span>
    </span>
  </td>
</tr>

<tr data-level="1"><td class="zak-table__indent" style="--depth:1">api-gateway</td></tr>
<tr data-level="2"><td class="zak-table__indent" style="--depth:2">pool · eu-central-1</td></tr>`,
      },
      {
        title: 'Collapsed branch',
        desc: 'Children of a closed branch just carry `hidden`; the caret rotation and the aria-label swap come from `aria-expanded` alone.',
        stage: 'stretch',
        tpl: `<div class="zak-table-wrap" style="width:100%;max-width:38rem" data-zak-table-tree>
    <table class="zak-table zak-table--hover">
      <thead>
        <tr><th scope="col">Service</th><th scope="col" class="zak-table__num">Hosts</th><th scope="col" class="zak-table__num">Storage</th></tr>
      </thead>
      <tbody>
        <tr data-level="0" aria-expanded="false"><td class="zak-table__indent" style="--depth:0"><span class="zak-table__tree"><button class="zak-table__toggle" type="button" aria-label="Expand infra">${chevRight}</button>infra <span class="zak-badge zak-badge--counter">2</span></span></td><td class="zak-table__num">3</td><td class="zak-table__num">8.6 GB</td></tr>
        <tr data-level="1" hidden><td class="zak-table__indent" style="--depth:1">edge cache</td><td class="zak-table__num">2</td><td class="zak-table__num">6.1 GB</td></tr>
        <tr data-level="1" hidden><td class="zak-table__indent" style="--depth:1">runner pool</td><td class="zak-table__num">1</td><td class="zak-table__num">2.5 GB</td></tr>
      </tbody>
    </table>
  </div>`,
        code: `<!-- Closed parent: aria-expanded="false", every deeper row hidden -->
<tr data-level="0" aria-expanded="false">
  <td class="zak-table__indent" style="--depth:0">
    <span class="zak-table__tree">
      <button class="zak-table__toggle" type="button" aria-label="Expand infra"><svg class="zak-icon" aria-hidden="true">…</svg></button>
      infra <span class="zak-badge zak-badge--counter">2</span>
    </span>
  </td>
</tr>
<tr data-level="1" hidden><td class="zak-table__indent" style="--depth:1">edge cache</td></tr>
<tr data-level="1" hidden><td class="zak-table__indent" style="--depth:1">runner pool</td></tr>`,
        js: `// The runtime hides exactly one descendant block: everything deeper than
// the toggled row, up to the next row at the same or a shallower level.
toggle.addEventListener('click', () => {
  const row = toggle.closest('tr');
  const open = row.getAttribute('aria-expanded') === 'true';
  row.setAttribute('aria-expanded', String(!open));
  const level = Number(row.dataset.level);

  for (let n = row.nextElementSibling; n; n = n.nextElementSibling) {
    if (Number(n.dataset.level) <= level) break;
    n.hidden = open;
  }
});`,
      },
    ],
    props: [
      ['--depth', 'custom property', '0', 'Indent level in rem multiples of 1.25; one per hierarchy step.'],
      ['data-level', 'attr', '—', 'Numeric depth; the runtime hides rows deeper than the toggled row.'],
      ['aria-expanded', 'attr', '—', 'Parent state; drives the caret rotation and the aria-label swap.'],
      ['.zak-table__indent', 'class', '—', 'Cell that receives the depth-driven start padding.'],
      ['.zak-table__tree', 'class', '—', 'Inline-flex row: toggle, label and badge share one baseline.'],
      ['.zak-table__toggle', 'class', '—', 'Caret button; the row remains the click target.'],
      ['[data-zak-table-tree]', 'attr', '—', 'Marks the wrapper whose rows are collapse-enabled.'],
      ['.zak-table__num', 'class', '—', 'Right-aligned numerics stay aligned across levels.'],
    ],
  }),
  'sticky-header-table': defineDemo({
    desc: 'The header pins to the top of the scroll shell while long result sets scroll beneath it — context never leaves the viewport.',
    playground: false,
    stage: 'stretch',
    tpl: `<div class="zak-table-wrap" style="width:100%;max-width:42rem;max-height:11.5rem">
    <table class="zak-table zak-table--sticky zak-table--hover">
      ${memberHead}
      <tbody>
        ${people.slice(0, 20).map(memberRow).join('\n        ')}
      </tbody>
    </table>
  </div>`,
    codeTpl: `<!-- max-height — set on the wrapper; it owns the scroll port -->
<div class="zak-table-wrap" style="max-height:11.5rem">
  <!-- --sticky — thead th get position:sticky with an elevated surface -->
  <table class="zak-table zak-table--sticky zak-table--hover">
    <thead>…</thead>
    <tbody>…</tbody>
  </table>
</div>`,
    props: [
      ['--sticky', 'modifier', '—', 'thead th get position:sticky with elevated surface.'],
      ['max-height', 'css', '—', 'Set on the wrapper — it owns the scroll port.'],
    ],
    notes: ['Give the wrapper a max-height; without a scroll port there is nothing to stick against.'],
  }),
  'table-with-pagination': defineDemo({
    desc: 'Standalone page navigation: boundary chevrons, numbered pages with an ellipsis window, and a current-page weight that survives both themes.',
    playground: false,
    tpl: `<div class="zak-stack zak-stack--lg" style="align-items:center">
    <nav class="zak-pagination" aria-label="Full pagination">
      <button class="zak-page-btn" type="button" disabled>${chevLeft} Previous</button>
      <button class="zak-page-btn" type="button">1</button>
      <button class="zak-page-btn is-active" type="button" aria-current="page">2</button>
      <button class="zak-page-btn" type="button">3</button>
      <button class="zak-page-btn" type="button">4</button>
      <span class="zak-page-ellipsis">…</span>
      <button class="zak-page-btn" type="button">12</button>
      <button class="zak-page-btn" type="button">Next ${chevRight}</button>
    </nav>
    <nav class="zak-pagination" aria-label="Compact pagination">
      <button class="zak-page-btn" type="button" aria-label="Previous page">${chevLeft}</button>
      <button class="zak-page-btn is-active" type="button" aria-current="page">7</button>
      <span class="zak-page-ellipsis">of 12</span>
      <button class="zak-page-btn" type="button" aria-label="Next page">${chevRight}</button>
    </nav>
  </div>`,
    codeTpl: `<!-- .zak-page-btn.is-active — brand-filled current page -->
<nav class="zak-pagination" aria-label="Pagination">
  <!-- disabled — boundary chevrons disable at the ends -->
  <button class="zak-page-btn" type="button" disabled aria-label="Previous page">‹</button>
  <button class="zak-page-btn" type="button">1</button>
  <button class="zak-page-btn is-active" type="button" aria-current="page">2</button>
  <button class="zak-page-btn" type="button">3</button>
  <!-- .zak-page-ellipsis — truncation window marker; non-focusable -->
  <span class="zak-page-ellipsis">…</span>
  <button class="zak-page-btn" type="button">12</button>
  <button class="zak-page-btn" type="button" aria-label="Next page">›</button>
</nav>`,
    js: `pagination.addEventListener('click', (event) => {
  const btn = event.target.closest('.zak-page-btn');
  if (!btn || btn.disabled) return;
  pagination.querySelectorAll('.zak-page-btn').forEach((b) => {
    b.classList.toggle('is-active', b === btn);
    b.toggleAttribute('aria-current', b === btn);
  });
  loadPage(Number(btn.textContent));
});`,
    props: [
      ['.zak-page-btn.is-active', 'class', '—', 'Brand-filled current page with aria-current="page".'],
      ['.zak-page-ellipsis', 'element', '—', 'Truncation window marker; non-focusable.'],
      ['disabled', 'attr', '—', 'Boundary chevrons disable at the ends.'],
    ],
    a11y: {
      keys: [
        ['Enter / Space', 'Navigates to the focused page.'],
        ['Tab', 'Pagination controls form a single tab sequence.'],
      ],
      aria: [
        ['aria-current="page"', 'Marks the active page for assistive tech.'],
        ['aria-label', 'Wrap in nav aria-label="Pagination"; label icon-only chevrons.'],
      ],
    },
  }),
  'table-with-selection': defineDemo({
    desc: 'Checkbox selection with a select-all header, drawn with the library checkbox itself (`.zak-check--bare`). The header flips to indeterminate when some — but not all — rows are chosen.',
    playground: false,
    stage: 'stretch',
    tpl: `<div class="zak-table-wrap" style="width:100%;max-width:44rem" data-zak-table-select>
    <table class="zak-table zak-table--hover">
      <thead>
        <tr><th scope="col" class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" aria-label="Select all rows" data-zak-checkall/></label></th><th scope="col">Member</th><th scope="col">Team</th><th scope="col">Status</th></tr>
      </thead>
      <tbody>
        <tr class="is-selected"><td class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" checked aria-label="Select Alina Popescu"/></label></td><td>${personCell(who[0])}</td><td>${who[0].team}</td><td>${statusBadge(who[0])}</td></tr>
        <tr class="is-selected"><td class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" checked aria-label="Select Marcus Webb"/></label></td><td>${personCell(who[1])}</td><td>${who[1].team}</td><td>${statusBadge(who[1])}</td></tr>
        <tr><td class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" aria-label="Select Priya Raman"/></label></td><td>${personCell(who[2])}</td><td>${who[2].team}</td><td>${statusBadge(who[2])}</td></tr>
        <tr><td class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" aria-label="Select Tom Okafor"/></label></td><td>${personCell(who[3])}</td><td>${who[3].team}</td><td>${statusBadge(who[3])}</td></tr>
        <tr><td class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" aria-label="Select Sofia Marchetti"/></label></td><td>${personCell(who[4])}</td><td>${who[4].team}</td><td>${statusBadge(who[4])}</td></tr>
      </tbody>
    </table>
  </div>`,
    codeTpl: `<!-- Header cell: the checkbox is a real input, wrapped for the custom drawing -->
<tr>
  <th class="zak-table__check">
    <label class="zak-check zak-check--bare">
      <input type="checkbox" aria-label="Select all rows" data-zak-checkall/>
    </label>
  </th>
</tr>

<!-- tr.is-selected — brand-subtle fill marks chosen rows -->
<tr class="is-selected">
  <td class="zak-table__check">
    <!-- aria-label — every row checkbox names its row -->
    <label class="zak-check zak-check--bare">
      <input type="checkbox" checked aria-label="Select Alina Popescu"/>
    </label>
  </td>
  <td>Alina Popescu</td>
</tr>

<!-- indeterminate — set via JS on the input when only a subset is selected -->`,
    js: `checkAll.addEventListener('change', () => {
  rows.forEach((row) => {
    row.querySelector('input').checked = checkAll.checked;
    row.classList.toggle('is-selected', checkAll.checked);
  });
});

// Partial selection → indeterminate
checkAll.indeterminate = someChecked && !allChecked;`,
    examples: [
      {
        title: 'Select-all header and row boxes',
        desc: 'Every box is the library checkbox itself, wrapped in a label-less `.zak-check--bare`; selected rows take `tr.is-selected`.',
        stage: 'stretch',
        tpl: `<div class="zak-table-wrap" style="width:100%;max-width:38rem" data-zak-table-select>
    <table class="zak-table zak-table--hover">
      <thead>
        <tr><th scope="col" class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" aria-label="Select all rows" data-zak-checkall/></label></th><th scope="col">Member</th><th scope="col">Team</th><th scope="col">Status</th></tr>
      </thead>
      <tbody>
        <tr class="is-selected"><td class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" checked aria-label="Select ${who[0].name}"/></label></td><td>${personCell(who[0])}</td><td>${who[0].team}</td><td>${statusBadge(who[0])}</td></tr>
        <tr><td class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" aria-label="Select ${who[1].name}"/></label></td><td>${personCell(who[1])}</td><td>${who[1].team}</td><td>${statusBadge(who[1])}</td></tr>
        <tr><td class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" aria-label="Select ${who[2].name}"/></label></td><td>${personCell(who[2])}</td><td>${who[2].team}</td><td>${statusBadge(who[2])}</td></tr>
      </tbody>
    </table>
  </div>`,
        code: `<tr>
  <!-- .zak-table__check — fixed 2.75rem centered column -->
  <th scope="col" class="zak-table__check">
    <label class="zak-check zak-check--bare">
      <input type="checkbox" aria-label="Select all rows" data-zak-checkall/>
    </label>
  </th>
</tr>

<tr class="is-selected">
  <td class="zak-table__check">
    <!-- aria-label names the row — there is no visible label to read -->
    <label class="zak-check zak-check--bare">
      <input type="checkbox" checked aria-label="Select Alina Popescu"/>
    </label>
  </td>
</tr>`,
      },
      {
        title: 'Indeterminate header',
        desc: 'Some — but not all — rows chosen: the header box half-fills only once script sets the `indeterminate` property, which has no attribute form.',
        stage: 'stretch',
        tpl: `<div class="zak-table-wrap" style="width:100%;max-width:38rem" data-zak-table-select>
    <table class="zak-table zak-table--hover">
      <thead>
        <tr><th scope="col" class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" aria-label="Select all rows" data-zak-checkall/></label></th><th scope="col">Member</th><th scope="col">Team</th></tr>
      </thead>
      <tbody>
        <tr class="is-selected"><td class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" checked aria-label="Select ${who[0].name}"/></label></td><td>${personCell(who[0])}</td><td>${who[0].team}</td></tr>
        <tr><td class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" aria-label="Select ${who[1].name}"/></label></td><td>${personCell(who[1])}</td><td>${who[1].team}</td></tr>
        <tr><td class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" aria-label="Select ${who[2].name}"/></label></td><td>${personCell(who[2])}</td><td>${who[2].team}</td></tr>
      </tbody>
    </table>
  </div>`,
        code: `<th scope="col" class="zak-table__check">
  <label class="zak-check zak-check--bare">
    <input type="checkbox" aria-label="Select all rows" data-zak-checkall/>
  </label>
</th>`,
        js: `// indeterminate is a property, never an attribute — set it after each toggle
const boxes = [...table.querySelectorAll('tbody input[type="checkbox"]')];
const checked = boxes.filter((box) => box.checked);

checkAll.checked = checked.length === boxes.length;
checkAll.indeterminate = checked.length > 0 && checked.length < boxes.length;

// Keep the row fill in sync with its checkbox
boxes.forEach((box) =>
  box.addEventListener('change', () => box.closest('tr').classList.toggle('is-selected', box.checked)),
);`,
      },
    ],
    props: [
      ['.zak-check--bare', 'modifier', '—', 'Label-less checkbox: compact, centered in the cell.'],
      ['.zak-table__check', 'class', '—', 'Fixed 2.75rem centered column so boxes line up with row text.'],
      ['tr.is-selected', 'class', '—', 'Brand-subtle row fill marks chosen rows.'],
      ['indeterminate', 'attr', '—', 'Set via JS when a subset is selected.'],
      ['aria-label', 'attr', '—', 'Every row checkbox names its row — "Select Alina Popescu".'],
      ['data-zak-checkall', 'attr', '—', 'Marks the header checkbox for the select-all behaviour.'],
    ],
    a11y: {
      keys: [
        ['Space', 'Toggles the focused checkbox.'],
        ['Shift+Click', 'Optional range selection convention.'],
      ],
      aria: [
        ['aria-label', 'Row checkboxes carry the row identity in words.'],
        ['indeterminate', 'Programmatic-only; still expose the count in a status region.'],
      ],
    },
  }),
  'table-with-actions': defineDemo({
    desc: 'Per-row action clusters: quiet icon buttons that reveal themselves on hover, with destructive actions separated by tone.',
    playground: false,
    stage: 'stretch',
    tpl: `<div class="zak-table-wrap" style="width:100%;max-width:48rem">
    <table class="zak-table zak-table--hover">
      <thead>
        <tr><th scope="col">Member</th><th scope="col">Role</th><th scope="col">Team</th><th scope="col" style="text-align:right">Actions</th></tr>
      </thead>
      <tbody>
        ${who
          .slice(0, 5)
          .map(
            (p) =>
              `<tr><td>${personCell(p)}</td><td>${p.role}</td><td>${p.team}</td><td style="text-align:right"><span class="zak-table__actions"><button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Edit ${p.name}">${editI}</button><button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Duplicate ${p.name}">${copyI}</button><button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Remove ${p.name}" style="color:var(--zak-danger-text)">${trashI}</button></span></td></tr>`,
          )
          .join('\n        ')}
      </tbody>
    </table>
  </div>`,
    codeTpl: `<!-- .zak-table__actions — inline-flex cluster with 4px gaps -->
<td style="text-align:right">
  <span class="zak-table__actions">
    <!-- aria-label — icon-only buttons must name their row -->
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Edit Alina Popescu"><svg class="zak-icon" aria-hidden="true">…</svg></button>
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Duplicate Alina Popescu"><svg class="zak-icon" aria-hidden="true">…</svg></button>
    <!-- --ghost — quiet until hovered; destructive separated by tone -->
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Remove Alina Popescu" style="color:var(--zak-danger-text)"><svg class="zak-icon" aria-hidden="true">…</svg></button>
  </span>
</td>`,
    examples: [
      {
        title: 'Quiet icon cluster',
        desc: '`.zak-table__actions` packs the buttons with a 4px gap; `--ghost` keeps them muted until hovered and every icon-only button names its row.',
        stage: 'stretch',
        tpl: `<div class="zak-table-wrap" style="width:100%;max-width:40rem">
    <table class="zak-table zak-table--hover">
      <thead>
        <tr><th scope="col">Member</th><th scope="col">Team</th><th scope="col" style="text-align:right">Actions</th></tr>
      </thead>
      <tbody>
        ${who.slice(0, 3).map((p) => `<tr><td>${personCell(p)}</td><td>${p.team}</td><td style="text-align:right"><span class="zak-table__actions"><button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Edit ${p.name}">${editI}</button><button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Duplicate ${p.name}">${copyI}</button><button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Remove ${p.name}" style="color:var(--zak-danger-text)">${trashI}</button></span></td></tr>`).join('\n        ')}
      </tbody>
    </table>
  </div>`,
        code: `<td style="text-align:right">
  <span class="zak-table__actions">
    <!-- --ghost — quiet until hovered -->
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Edit Alina Popescu"><svg class="zak-icon" aria-hidden="true">…</svg></button>
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Duplicate Alina Popescu"><svg class="zak-icon" aria-hidden="true">…</svg></button>
    <!-- destructive actions are separated by tone, not by another separator -->
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Remove Alina Popescu" style="color:var(--zak-danger-text)"><svg class="zak-icon" aria-hidden="true">…</svg></button>
  </span>
</td>`,
      },
      {
        title: 'Overflow menu per row',
        desc: 'When actions outnumber three, hand them to the dropdown runtime — `--end` keeps the panel inside the trigger edge.',
        stage: 'stretch',
        tpl: `<div class="zak-table-wrap" style="width:100%;max-width:40rem;overflow:visible">
    <table class="zak-table zak-table--hover">
      <thead>
        <tr><th scope="col">Member</th><th scope="col">Team</th><th scope="col" style="text-align:right">Actions</th></tr>
      </thead>
      <tbody>
        ${who.slice(0, 2).map((p) => `<tr><td>${personCell(p)}</td><td>${p.team}</td><td style="text-align:right"><span class="zak-dropdown" data-zak-dropdown><button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" data-zak-toggle="dropdown" aria-haspopup="menu" aria-expanded="false" aria-label="Actions for ${p.name}">${svgIcon('more-h', 'zak-icon', 16)}</button><div class="zak-dropdown__panel zak-dropdown__panel--end" hidden role="menu" aria-label="Actions for ${p.name}"><a class="zak-menu__item" href="#" role="menuitem">${editI} Edit profile</a><a class="zak-menu__item" href="#" role="menuitem">${downloadI} Export activity</a><div class="zak-menu__sep" role="separator"></div><a class="zak-menu__item" href="#" role="menuitem" style="color:var(--zak-danger-text)">${trashI} Remove from workspace</a></div></span></td></tr>`).join('\n        ')}
      </tbody>
    </table>
  </div>`,
        code: `<!-- The row reuses the dropdown contract — no table-specific behaviour -->
<!-- .zak-table-wrap is overflow:auto: give the shell overflow:visible where a panel must escape -->
<td style="text-align:right">
  <span class="zak-dropdown" data-zak-dropdown>
    <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button"
            data-zak-toggle="dropdown" aria-haspopup="menu" aria-expanded="false"
            aria-label="Actions for Alina Popescu"><svg class="zak-icon" aria-hidden="true">…</svg></button>

    <!-- .zak-dropdown__panel--end — right-aligns the panel to the trigger -->
    <div class="zak-dropdown__panel zak-dropdown__panel--end" hidden role="menu" aria-label="Actions for Alina Popescu">
      <a class="zak-menu__item" href="#" role="menuitem">Edit profile</a>
      <a class="zak-menu__item" href="#" role="menuitem">Export activity</a>
      <div class="zak-menu__sep" role="separator"></div>
      <a class="zak-menu__item" href="#" role="menuitem" style="color:var(--zak-danger-text)">Remove from workspace</a>
    </div>
  </span>
</td>`,
      },
    ],
    props: [
      ['.zak-table__actions', 'element', '—', 'Inline-flex cluster with 4px gaps.'],
      ['--ghost', 'modifier', '—', 'Row actions stay quiet until hovered.'],
      ['aria-label', 'attr', 'required', 'Icon-only buttons must name their row.'],
    ],
  }),
  'table-with-filters': defineDemo({
    desc: 'Filter controls bound to a result summary: free-text search, two facet selects and a live count that tells the user their filters applied.',
    playground: false,
    stage: 'stretch',
    tpl: `<div style="width:100%;max-width:48rem">
    <div class="zak-table-toolbar" style="border:1px solid var(--zak-border-subtle);border-block-end:0;border-radius:var(--zak-radius-lg) var(--zak-radius-lg) 0 0">
      <span class="zak-table-toolbar__title">Invoices</span>
      <span class="zak-table-toolbar__count" data-zak-filter-count>18 results</span>
    </div>
    <div class="zak-table-toolbar" style="border-inline:1px solid var(--zak-border-subtle)">
      <span class="zak-search" style="width:15rem">${searchI}<input type="search" placeholder="Search invoices…" aria-label="Search invoices" data-zak-table-filter/></span>
      <select class="zak-select zak-input--sm" style="width:auto;min-width:9rem" aria-label="Status" data-zak-table-filter><option value="">All statuses</option><option>Paid</option><option>Open</option><option>Overdue</option></select>
      <select class="zak-select zak-input--sm" style="width:auto;min-width:9rem" aria-label="Team"><option value="">All teams</option><option>Platform</option><option>Design</option><option>Data</option></select>
      <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button" style="margin-inline-start:auto">Reset</button>
    </div>
    <div class="zak-table-wrap" style="border-radius:0 0 var(--zak-radius-lg) var(--zak-radius-lg)">
      <table class="zak-table zak-table--hover">
        <thead>
          <tr><th scope="col">Invoice</th><th scope="col">Team</th><th scope="col">Issued</th><th scope="col" class="zak-table__num">Amount</th><th scope="col">Status</th></tr>
        </thead>
        <tbody>
          <tr><td class="zak-table__num">#INV-2291</td><td>Platform</td><td>2026-05-02</td><td class="zak-table__num">$12,400</td><td><span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Paid</span></td></tr>
          <tr><td class="zak-table__num">#INV-2292</td><td>Data</td><td>2026-05-04</td><td class="zak-table__num">$8,150</td><td><span class="zak-badge zak-badge--info"><span class="zak-badge__dot"></span>Open</span></td></tr>
          <tr><td class="zak-table__num">#INV-2293</td><td>Design</td><td>2026-05-11</td><td class="zak-table__num">$3,900</td><td><span class="zak-badge zak-badge--danger"><span class="zak-badge__dot"></span>Overdue</span></td></tr>
          <tr><td class="zak-table__num">#INV-2294</td><td>Infra</td><td>2026-05-15</td><td class="zak-table__num">$21,750</td><td><span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Paid</span></td></tr>
          <tr><td class="zak-table__num">#INV-2295</td><td>Platform</td><td>2026-05-21</td><td class="zak-table__num">$6,300</td><td><span class="zak-badge zak-badge--info"><span class="zak-badge__dot"></span>Open</span></td></tr>
          <tr><td class="zak-table__num">#INV-2296</td><td>Data</td><td>2026-05-28</td><td class="zak-table__num">$14,200</td><td><span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Paid</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>`,
    codeTpl: `<!-- data-zak-table-filter — marks controls the filter routine watches -->
<div class="zak-table-toolbar">
  <input type="search" placeholder="Search invoices…" aria-label="Search invoices" data-zak-table-filter/>
  <select class="zak-select" aria-label="Status" data-zak-table-filter>
    <option value="">All statuses</option>
    <option>Paid</option>
  </select>
  <!-- Reset — one-tap restore of the unfiltered set -->
  <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Reset</button>
</div>

<!-- result summary — always update the count; silence reads as a bug -->
<span class="zak-table-toolbar__count" data-zak-filter-count>18 results</span>`,
    props: [
      ['data-zak-table-filter', 'attr', '—', 'Marks controls the filter routine should watch.'],
      ['result summary', 'pattern', '—', 'Always update the count — silence reads as a bug.'],
      ['Reset', 'pattern', '—', 'One-tap restore of the unfiltered set.'],
    ],
  }),
  'table-with-bulk-actions': defineDemo({
    desc: 'When rows are selected, a contextual bar surfaces the batch operations and the count — the table itself never moves.',
    playground: false,
    stage: 'stretch',
    tpl: `<div style="width:100%;max-width:44rem" data-zak-table-select>
    <div style="display:flex;align-items:center;gap:var(--zak-space-3);padding:var(--zak-space-2) var(--zak-space-4);margin-block-end:var(--zak-space-3);background:var(--zak-primary-subtle);border:1px solid var(--zak-primary-subtle-border);border-radius:var(--zak-radius-md);color:var(--zak-primary-text);font-size:var(--zak-text-sm);font-weight:var(--zak-weight-medium)">
      <span>3 rows selected</span>
      <span style="display:flex;gap:var(--zak-space-2);margin-inline-start:auto">
        <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">${downloadI} Export</button>
        <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Archive</button>
        <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button" style="color:var(--zak-danger-text)">Delete</button>
      </span>
    </div>
    <div class="zak-table-wrap">
      <table class="zak-table zak-table--hover">
        <thead>
          <tr><th scope="col" class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" aria-label="Select all rows" data-zak-checkall/></label></th><th scope="col">Invoice</th><th scope="col">Team</th><th scope="col" class="zak-table__num">Amount</th><th scope="col">Status</th></tr>
        </thead>
        <tbody>
          <tr class="is-selected"><td class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" checked aria-label="Select invoice 2291"/></label></td><td class="zak-table__num">#INV-2291</td><td>Platform</td><td class="zak-table__num">$12,400</td><td><span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Paid</span></td></tr>
          <tr class="is-selected"><td class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" checked aria-label="Select invoice 2294"/></label></td><td class="zak-table__num">#INV-2294</td><td>Infra</td><td class="zak-table__num">$21,750</td><td><span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Paid</span></td></tr>
          <tr class="is-selected"><td class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" checked aria-label="Select invoice 2296"/></label></td><td class="zak-table__num">#INV-2296</td><td>Data</td><td class="zak-table__num">$14,200</td><td><span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Paid</span></td></tr>
          <tr><td class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" aria-label="Select invoice 2292"/></label></td><td class="zak-table__num">#INV-2292</td><td>Data</td><td class="zak-table__num">$8,150</td><td><span class="zak-badge zak-badge--info"><span class="zak-badge__dot"></span>Open</span></td></tr>
          <tr><td class="zak-table__check"><label class="zak-check zak-check--bare"><input type="checkbox" aria-label="Select invoice 2295"/></label></td><td class="zak-table__num">#INV-2295</td><td>Platform</td><td class="zak-table__num">$6,300</td><td><span class="zak-badge zak-badge--info"><span class="zak-badge__dot"></span>Open</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>`,
    codeTpl: `<!-- bulk bar — brand strip above the table, announced live -->
<div class="bulk-bar" role="region" aria-label="Bulk actions" aria-live="polite">
  <!-- selected count — a concrete number, updated on every toggle -->
  <span>3 rows selected</span>
  <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Export</button>
  <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">Archive</button>
  <!-- destructive last — danger action sits at the end and confirms -->
  <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button" style="color:var(--zak-danger-text)">Delete</button>
</div>

<!-- Selection cells use the library checkbox: .zak-check--bare inside .zak-table__check -->
<tr class="is-selected">
  <td class="zak-table__check">
    <label class="zak-check zak-check--bare"><input type="checkbox" checked aria-label="Select invoice 2291"/></label>
  </td>
  <td>#INV-2291</td>
</tr>`,
    props: [
      ['bulk bar', 'pattern', '—', 'Brand-subtle strip above the table; announces via a live region.'],
      ['selected count', 'pattern', '—', 'Concrete number, updated on every toggle.'],
      ['destructive last', 'pattern', '—', 'Danger action sits at the end and confirms.'],
      ['.zak-check--bare', 'modifier', '—', 'The ZAKUIKit checkbox without a label, centered in its cell.'],
      ['.zak-table__check', 'class', '—', 'Fixed-width checkbox column shared by head and body rows.'],
    ],
    a11y: {
      keys: [
        ['Space', 'Toggles row selection.'],
        ['Escape', 'Optional: clears the selection.'],
      ],
      aria: [
        ['role="region"', 'The bulk bar is a named region for quick jump.'],
        ['aria-live="polite"', 'Announce the selected count changes.'],
      ],
    },
  }),
};
