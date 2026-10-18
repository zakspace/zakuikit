/**
 * ZAKUIKit — Pickers runtime: calendar grids, time selects and color swatches.
 *
 * Nothing in this category ships as static markup: every surface is generated
 * from data attributes, so page code only declares a container —
 *
 *   <div data-zak-calendar="2026-06-18" data-zak-cal-today="2026-06-17"></div>
 *   <div data-zak-time="09:30" data-zak-time-step="5"></div>
 *   <div data-zak-colorpicker data-zak-colors="#6366f1,#10b981,…"></div>
 *
 * Supported calendar attributes:
 *   data-zak-calendar   ISO value — "2026-06-18" or range "2026-06-09..2026-06-24"
 *   data-zak-cal-view   month (default) · weeks · months · years
 *   data-zak-cal-today  ISO override for "today" (keeps docs deterministic)
 *   data-zak-cal-select "range" enables two-endpoint selection
 *   data-zak-cal-months 1–2 month grids side by side
 *   data-zak-cal-weeks  row count for the weeks view (default 6)
 *   data-zak-cal-min / data-zak-cal-max  ISO bounds
 *
 * Wiring is document-level (click / keydown / change / input / pointerdown)
 * plus per-element init behind WeakMap guards, so the playground's
 * `zak:refresh` re-renders re-initialise cleanly.
 */
import { setHtml, copyText } from './dom';

/* ------------------------------------------------------------------ dates */

const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS = MONTHS_FULL.map((m) => m.slice(0, 3));
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const WEEKDAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const pad2 = (value: number): string => String(value).padStart(2, '0');
const iso = (date: Date): string => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
const utc = (date: Date): number => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

const parseIso = (raw: string | null | undefined): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec((raw ?? '').trim());
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
};

const addDays = (date: Date, days: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const firstOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);
const addMonths = (date: Date, months: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + months, 1);
const addMonthsClamped = (date: Date, months: number): Date => {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
};
const startOfWeek = (date: Date): Date => addDays(date, -((date.getDay() + 6) % 7));
const sameDay = (a: Date | null, b: Date | null): boolean =>
  a !== null && b !== null && utc(a) === utc(b);

const fmtShort = (date: Date): string => `${date.getDate()} ${MONTHS[date.getMonth()]}`;
const fmtLong = (date: Date): string => `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
const fmtRange = (start: Date, end: Date): string =>
  start.getFullYear() === end.getFullYear()
    ? `${start.getDate()} ${MONTHS[start.getMonth()]} – ${end.getDate()} ${MONTHS[end.getMonth()]} ${end.getFullYear()}`
    : `${fmtLong(start)} – ${fmtLong(end)}`;

/** ISO-8601 week number. */
const isoWeek = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

const asElement = (target: EventTarget | null): HTMLElement | null =>
  target instanceof HTMLElement ? target : null;

/* --------------------------------------------------------------- calendar */

type CalView = 'month' | 'weeks' | 'months' | 'years';

interface CalState {
  view: CalView;
  months: number;
  weeks: number;
  range: boolean;
  keepOpen: boolean;
  today: Date;
  cursor: Date;
  start: Date | null;
  end: Date | null;
  min: Date | null;
  max: Date | null;
  roving: string | null;
}

const calStates = new WeakMap<HTMLElement, CalState>();

/** The field or panel a control belongs to — the scope sinks are looked up in. */
function calScope(el: HTMLElement): HTMLElement {
  return (
    el.closest<HTMLElement>('.zak-picker-field') ??
    el.closest<HTMLElement>('.zak-picker-panel') ??
    el.parentElement ??
    document.body
  );
}

function isOutOfBounds(state: CalState, date: Date): boolean {
  if (state.min && utc(date) < utc(state.min)) return true;
  return Boolean(state.max && utc(date) > utc(state.max));
}

function isSelected(state: CalState, date: Date): boolean {
  return sameDay(state.start, date) || sameDay(state.end, date);
}

/** First and last cell rendered by the month grid(s) — includes muted edges. */
function gridSpan(state: CalState): [Date, Date] {
  const first = firstOfMonth(state.cursor);
  const lastMonth = new Date(state.cursor.getFullYear(), state.cursor.getMonth() + state.months - 1, 1);
  const lead = (first.getDay() + 6) % 7;
  const lastLead = (lastMonth.getDay() + 6) % 7;
  const lastDays = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).getDate();
  const rows = Math.ceil((lastLead + lastDays) / 7);
  return [addDays(first, -lead), addDays(startOfWeek(lastMonth), rows * 7 - 1)];
}

function visibleInGrid(state: CalState, date: Date): boolean {
  const [from, to] = gridSpan(state);
  return utc(date) >= utc(from) && utc(date) <= utc(to);
}

/** The one cell that owns the tab stop. */
function rovingIso(state: CalState): string {
  const candidates = [state.roving ? parseIso(state.roving) : null, state.start, state.today];
  for (const candidate of candidates) {
    if (candidate && visibleInGrid(state, candidate)) return iso(candidate);
  }
  return iso(firstOfMonth(state.cursor));
}

function ensureVisible(state: CalState, date: Date): void {
  const diff =
    (date.getFullYear() - state.cursor.getFullYear()) * 12 + (date.getMonth() - state.cursor.getMonth());
  if (diff < 0) state.cursor = firstOfMonth(date);
  else if (diff > state.months - 1) state.cursor = addMonths(date, -(state.months - 1));
}

/* ------------------------------------------------------------ rendering */

function dayCell(date: Date, inMonth: boolean, state: CalState, chosen: string): string {
  const classes = ['zak-cal-day'];
  if (!inMonth) classes.push('zak-cal-day--muted');
  const selected = isSelected(state, date);
  if (selected) classes.push('zak-cal-day--selected');
  if (state.range) {
    if (state.start && state.end && sameDay(date, state.start)) classes.push('zak-cal-day--range-start');
    if (state.start && state.end && sameDay(date, state.end)) classes.push('zak-cal-day--range-end');
    if (state.start && state.end && utc(date) > utc(state.start) && utc(date) < utc(state.end)) {
      classes.push('zak-cal-day--range-mid');
    }
  }
  if (!selected && sameDay(state.today, date)) classes.push('zak-cal-day--today');
  const disabled = isOutOfBounds(state, date);
  if (disabled) classes.push('zak-cal-day--disabled');
  const label = `${WEEKDAYS_FULL[(date.getDay() + 6) % 7]} ${date.getDate()} ${MONTHS_FULL[date.getMonth()]} ${date.getFullYear()}`;
  return `<button type="button" class="${classes.join(' ')}" data-date="${iso(date)}" tabindex="${
    iso(date) === chosen ? '0' : '-1'
  }" aria-label="${label}" aria-pressed="${selected}"${disabled ? ' disabled' : ''}>${date.getDate()}</button>`;
}

function monthGridHtml(month: Date, state: CalState, chosen: string, caption: boolean): string {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const first = firstOfMonth(month);
  const lead = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const rows = Math.ceil((lead + daysInMonth) / 7);
  const cells: string[] = [];
  for (let i = 0; i < rows * 7; i += 1) {
    const date = addDays(first, i - lead);
    cells.push(dayCell(date, date.getMonth() === monthIndex && date.getFullYear() === year, state, chosen));
  }
  const label = `${MONTHS_FULL[monthIndex]} ${year}`;
  return [
    caption ? `<div class="zak-calendar__caption">${label}</div>` : '',
    `<div class="zak-calendar__weekdays" aria-hidden="true">${WEEKDAYS.map((d) => `<span>${d}</span>`).join('')}</div>`,
    `<div class="zak-calendar__grid" role="group" aria-label="${label}">`,
    cells.join('\n'),
    '</div>',
  ]
    .filter(Boolean)
    .join('\n');
}

function renderCalendar(container: HTMLElement, state: CalState): void {
  container.classList.remove('zak-calendar', 'zak-calendar-set', 'zak-cal-months', 'zak-cal-years');
  container.removeAttribute('role');
  container.removeAttribute('aria-label');

  let html = '';
  let title = '';

  switch (state.view) {
    case 'weeks': {
      container.classList.add('zak-calendar');
      container.setAttribute('role', 'listbox');
      const anchor = startOfWeek(state.cursor);
      container.setAttribute('aria-label', `Weeks of ${anchor.getFullYear()}`);
      const rows: string[] = [];
      for (let i = 0; i < state.weeks; i += 1) {
        const weekStart = addDays(anchor, i * 7);
        const weekEnd = addDays(weekStart, 6);
        const active = state.start !== null && sameDay(weekStart, startOfWeek(state.start));
        rows.push(
          `<button type="button" class="zak-cal-week${active ? ' is-active' : ''}" role="option" aria-selected="${active}" data-week="${iso(weekStart)}"><strong>W${isoWeek(weekStart)}</strong> ${fmtShort(weekStart)} – ${fmtShort(weekEnd)}</button>`,
        );
      }
      html = rows.join('\n');
      title = String(anchor.getFullYear());
      break;
    }
    case 'months': {
      container.classList.add('zak-cal-months');
      container.setAttribute('role', 'listbox');
      container.setAttribute('aria-label', `Months of ${state.cursor.getFullYear()}`);
      html = MONTHS.map((label, index) => {
        const active =
          state.start !== null &&
          state.start.getFullYear() === state.cursor.getFullYear() &&
          state.start.getMonth() === index;
        return `<button type="button"${active ? ' class="is-active"' : ''} role="option" aria-selected="${active}" data-month="${index}">${label}</button>`;
      }).join('\n');
      title = String(state.cursor.getFullYear());
      break;
    }
    case 'years': {
      const decade = state.cursor.getFullYear() - (state.cursor.getFullYear() % 10);
      container.classList.add('zak-cal-years');
      container.setAttribute('role', 'listbox');
      container.setAttribute('aria-label', `Years ${decade} to ${decade + 9}`);
      const cells: string[] = [];
      for (let year = decade; year < decade + 10; year += 1) {
        const active = state.start !== null && state.start.getFullYear() === year;
        cells.push(
          `<button type="button"${active ? ' class="is-active"' : ''} role="option" aria-selected="${active}" data-year="${year}">${year}</button>`,
        );
      }
      html = cells.join('\n');
      title = `${decade} – ${decade + 9}`;
      break;
    }
    default: {
      const chosen = rovingIso(state);
      const first = state.cursor;
      const last = addMonths(state.cursor, state.months - 1);
      if (state.months > 1) {
        container.classList.add('zak-calendar-set');
        const blocks: string[] = [];
        for (let i = 0; i < state.months; i += 1) {
          blocks.push(`<div class="zak-calendar">${monthGridHtml(addMonths(first, i), state, chosen, true)}</div>`);
        }
        html = blocks.join('\n');
        title =
          first.getFullYear() === last.getFullYear()
            ? `${MONTHS_FULL[first.getMonth()]} – ${MONTHS_FULL[last.getMonth()]} ${last.getFullYear()}`
            : `${MONTHS_FULL[first.getMonth()]} ${first.getFullYear()} – ${MONTHS_FULL[last.getMonth()]} ${last.getFullYear()}`;
      } else {
        container.classList.add('zak-calendar');
        html = monthGridHtml(first, state, chosen, false);
        title = `${MONTHS_FULL[first.getMonth()]} ${first.getFullYear()}`;
      }
      break;
    }
  }

  setHtml(container, html);
  const titleEl = calScope(container).querySelector<HTMLElement>('[data-zak-cal-title]');
  if (titleEl) titleEl.textContent = title;
}

function calValueText(state: CalState): string {
  if (state.view === 'weeks') {
    if (!state.start) return '';
    const weekEnd = addDays(state.start, 6);
    const span =
      state.start.getMonth() === weekEnd.getMonth()
        ? `${state.start.getDate()} – ${weekEnd.getDate()} ${MONTHS[weekEnd.getMonth()]}`
        : `${fmtShort(state.start)} – ${fmtShort(weekEnd)}`;
    return `W${isoWeek(state.start)} · ${span} ${weekEnd.getFullYear()}`;
  }
  if (state.view === 'months') {
    return state.start ? `${MONTHS_FULL[state.start.getMonth()]} ${state.start.getFullYear()}` : '';
  }
  if (state.view === 'years') return state.start ? String(state.start.getFullYear()) : '';
  if (!state.start) return '';
  return state.end ? fmtRange(state.start, state.end) : fmtLong(state.start);
}

function syncCalSinks(container: HTMLElement, state: CalState): void {
  const scope = calScope(container);
  const text = calValueText(state);
  scope.querySelectorAll<HTMLInputElement>('[data-zak-picker-value]').forEach((input) => {
    input.value = text;
  });
  scope.querySelectorAll<HTMLElement>('[data-zak-picker-text]').forEach((node) => {
    node.textContent = text;
  });
}

/* ------------------------------------------------------------- behaviour */

function initCalendar(container: HTMLElement): void {
  if (calStates.has(container)) return;
  const viewAttr = container.getAttribute('data-zak-cal-view') ?? 'month';
  const view: CalView = (['month', 'weeks', 'months', 'years'] as const).includes(viewAttr as CalView)
    ? (viewAttr as CalView)
    : 'month';
  const raw = (container.getAttribute('data-zak-calendar') ?? '').split('..');
  const start = parseIso(raw[0]);
  const end = parseIso(raw[1] ?? null);
  const state: CalState = {
    view,
    months: Math.min(2, Math.max(1, Number.parseInt(container.dataset.zakCalMonths ?? '1', 10) || 1)),
    weeks: Math.max(1, Number.parseInt(container.dataset.zakCalWeeks ?? '6', 10) || 6),
    range: container.getAttribute('data-zak-cal-select') === 'range',
    keepOpen: container.hasAttribute('data-zak-cal-keep-open'),
    today: parseIso(container.getAttribute('data-zak-cal-today')) ?? new Date(),
    cursor: firstOfMonth(start ?? parseIso(container.getAttribute('data-zak-cal-today')) ?? new Date()),
    start,
    end,
    min: parseIso(container.getAttribute('data-zak-cal-min')),
    max: parseIso(container.getAttribute('data-zak-cal-max')),
    roving: null,
  };
  if (state.view === 'weeks') state.cursor = start ?? state.today;
  calStates.set(container, state);
  renderCalendar(container, state);
  syncCalSinks(container, state);
}

/* --------------------------------------------------------- panel visibility */

/**
 * Position a floating `panel` against its `trigger` using fixed coordinates,
 * flipping to the side (and clamping within the viewport) that has room.
 * Shared by every surface that drops a panel below a control.
 */
export function positionPanel(trigger: HTMLElement, panel: HTMLElement, offset = 8): void {
  const rect = trigger.getBoundingClientRect();
  panel.style.position = 'fixed';
  const pw = panel.offsetWidth;
  const ph = panel.offsetHeight;
  const margin = 8;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top = rect.bottom + offset;
  if (top + ph > vh - margin && rect.top - offset - ph > margin) top = rect.top - offset - ph;
  top = Math.max(margin, Math.min(top, vh - ph - margin));

  let left = rect.left;
  if (left + pw > vw - margin) left = vw - pw - margin;
  left = Math.max(margin, left);

  panel.style.top = `${Math.round(top)}px`;
  panel.style.left = `${Math.round(left)}px`;
  panel.style.right = 'auto';
}

/* Panels currently open, kept pinned to their trigger on scroll and resize. */
const pinnedPanels: { trigger: HTMLElement; panel: HTMLElement }[] = [];
let pinBound = false;

function repinPanels(): void {
  for (const entry of pinnedPanels) positionPanel(entry.trigger, entry.panel);
}

function bindPinning(): void {
  if (pinBound) return;
  pinBound = true;
  window.addEventListener('scroll', repinPanels, true);
  window.addEventListener('resize', repinPanels);
}

function unpinPanel(panel: HTMLElement): void {
  const index = pinnedPanels.findIndex((entry) => entry.panel === panel);
  if (index !== -1) pinnedPanels.splice(index, 1);
}

/**
 * When each field's floating panel last closed. Focus handlers consult this so
 * restoring focus after a commit (or Escape) never re-opens the panel.
 */
const pickerCloseAt = new WeakMap<HTMLElement, number>();

/** True when the field's panel closed within the given window (ms). */
export function wasRecentlyClosed(field: HTMLElement, ms = 350): boolean {
  const at = pickerCloseAt.get(field);
  return at !== undefined && Date.now() - at < ms;
}

export function pickerPanel(field: HTMLElement): HTMLElement | null {
  return field.querySelector<HTMLElement>('.zak-picker-anchor > .zak-picker-panel');
}

export function setPickerOpen(field: HTMLElement, open: boolean): void {
  const panel = pickerPanel(field);
  if (!panel) return;
  if (!open && !panel.hidden) pickerCloseAt.set(field, Date.now());
  panel.hidden = !open;
  if (open) {
    /* Position against the control itself (the wrapped input or toggle). */
    const trigger = field.querySelector<HTMLElement>('.zak-input-wrap') ?? field;
    bindPinning();
    unpinPanel(panel);
    pinnedPanels.push({ trigger, panel });
    positionPanel(trigger, panel);
  } else {
    unpinPanel(panel);
  }
  field.querySelectorAll('[data-zak-picker-toggle]').forEach((btn) => btn.setAttribute('aria-expanded', String(open)));
  field.querySelectorAll<HTMLInputElement>('[data-zak-picker-value]').forEach((input) => {
    if (input.hasAttribute('aria-expanded')) input.setAttribute('aria-expanded', String(open));
  });
  if (open) {
    field
      .querySelector<HTMLElement>('[data-zak-calendar]')
      ?.querySelector<HTMLElement>('.zak-cal-day[tabindex="0"]')
      ?.focus();
  }
}

function closePickerField(el: HTMLElement): boolean {
  const field = el.closest<HTMLElement>('.zak-picker-field');
  const panel = field ? pickerPanel(field) : null;
  if (!field || !panel || panel.hidden) return false;
  setPickerOpen(field, false);
  return true;
}

/** Commit a week/month/year choice: close the field and restore focus to its input. */
function commitChoice(container: HTMLElement): void {
  if (closePickerField(container)) {
    calScope(container).querySelector<HTMLInputElement>('[data-zak-picker-value]')?.focus();
  }
}

function calendarIn(el: HTMLElement): { container: HTMLElement; state: CalState } | null {
  const container = el.closest<HTMLElement>('[data-zak-calendar]') ?? calScope(el).querySelector<HTMLElement>('[data-zak-calendar]');
  const state = container ? calStates.get(container) : undefined;
  return container && state ? { container, state } : null;
}

function selectCalDate(container: HTMLElement, state: CalState, date: Date): void {
  if (isOutOfBounds(state, date)) return;
  if (state.range) {
    if (!state.start || state.end) {
      state.start = date;
      state.end = null;
    } else if (utc(date) < utc(state.start)) {
      state.end = state.start;
      state.start = date;
    } else {
      state.end = date;
    }
  } else {
    state.start = date;
    state.end = null;
  }
  const hadFocus = container.contains(document.activeElement);
  state.roving = null;
  renderCalendar(container, state);
  syncCalSinks(container, state);
  if (!state.range && !state.keepOpen) {
    const closed = closePickerField(container);
    if (closed && hadFocus) {
      calScope(container).querySelector<HTMLInputElement>('[data-zak-picker-value]')?.focus();
    }
  } else if (hadFocus) {
    container.querySelector<HTMLElement>(`.zak-cal-day[data-date="${iso(date)}"]`)?.focus();
  }
}

function stepCalendar(container: HTMLElement, state: CalState, direction: number): void {
  switch (state.view) {
    case 'weeks':
      state.cursor = addDays(state.cursor, direction * state.weeks * 7);
      break;
    case 'months':
      state.cursor = new Date(state.cursor.getFullYear() + direction, 0, 1);
      break;
    case 'years':
      state.cursor = new Date(state.cursor.getFullYear() + direction * 10, 0, 1);
      break;
    default:
      state.cursor = addMonthsClamped(firstOfMonth(state.cursor), direction);
      break;
  }
  renderCalendar(container, state);
}

function applyPreset(button: HTMLElement, preset: string): void {
  const found = calendarIn(button);
  if (!found) return;
  const { container, state } = found;
  const today = state.today;
  let start: Date;
  let end: Date;
  switch (preset) {
    case 'last14':
      start = addDays(today, -13);
      end = today;
      break;
    case 'month':
      start = firstOfMonth(today);
      end = today;
      break;
    case 'quarter': {
      const quarter = Math.floor(today.getMonth() / 3) - 1;
      const year = quarter < 0 ? today.getFullYear() - 1 : today.getFullYear();
      const index = quarter < 0 ? 3 : quarter;
      start = new Date(year, index * 3, 1);
      end = addDays(new Date(year, index * 3 + 3, 1), -1);
      break;
    }
    case 'ytd':
      start = new Date(today.getFullYear(), 0, 1);
      end = today;
      break;
    default:
      start = today;
      end = today;
      break;
  }
  state.start = start;
  state.end = end;
  state.cursor = firstOfMonth(start);
  state.roving = null;
  renderCalendar(container, state);
  syncCalSinks(container, state);
  button.parentElement?.querySelectorAll<HTMLElement>('[data-zak-range-preset]').forEach((item) => {
    item.classList.toggle('is-active', item === button);
  });
}

function clearCalendar(container: HTMLElement, state: CalState): void {
  state.start = null;
  state.end = null;
  state.roving = null;
  renderCalendar(container, state);
  syncCalSinks(container, state);
}

/* ------------------------------------------------------------------ time */

const timeReady = new WeakSet<HTMLElement>();

function parseTime(raw: string | null): [number, number, number] {
  const match = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec((raw ?? '').trim());
  if (!match) return [0, 0, 0];
  return [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)];
}

function timeSelectHtml(
  part: 'hour' | 'minute' | 'second',
  label: string,
  to: number,
  step: number,
  selected: number,
  sizeClass: string,
): string {
  const options: string[] = [];
  for (let value = 0; value <= to; value += step) {
    options.push(`<option value="${pad2(value)}"${value === selected ? ' selected' : ''}>${pad2(value)}</option>`);
  }
  return `<select class="zak-select${sizeClass}" data-zak-time-part="${part}" aria-label="${label}">${options.join('')}</select>`;
}

function syncTimeSink(container: HTMLElement): void {
  const part = (name: string): string =>
    container.querySelector<HTMLSelectElement>(`[data-zak-time-part="${name}"]`)?.value ?? '00';
  const text = container.hasAttribute('data-zak-time-seconds')
    ? `${part('hour')}:${part('minute')}:${part('second')}`
    : `${part('hour')}:${part('minute')}`;
  const nodes = calScope(container).querySelectorAll<HTMLElement>('[data-zak-time-value]');
  nodes.forEach((node) => {
    if (node instanceof HTMLInputElement) node.value = text;
    else node.textContent = text;
  });
}

function initTime(container: HTMLElement): void {
  if (timeReady.has(container)) return;
  timeReady.add(container);
  const step = Math.max(1, Number.parseInt(container.dataset.zakTimeStep ?? '', 10) || 1);
  const withSeconds = container.hasAttribute('data-zak-time-seconds');
  const sizeClass = container.dataset.zakTimeSize === 'sm' ? ' zak-select--sm' : '';
  const [hours, minutes, seconds] = parseTime(container.getAttribute('data-zak-time'));
  const separator = '<span class="zak-time-selects__sep" aria-hidden="true">:</span>';
  let html = timeSelectHtml('hour', 'Hour', 23, 1, hours, sizeClass);
  html += separator + timeSelectHtml('minute', 'Minute', 59, step, minutes, sizeClass);
  if (withSeconds) html += separator + timeSelectHtml('second', 'Second', 59, step, seconds, sizeClass);
  container.classList.add('zak-time-selects');
  setHtml(container, html);
  syncTimeSink(container);
}

/* ----------------------------------------------------------------- color */

const colorReady = new WeakSet<HTMLElement>();

function hslToHex(hue: number, saturation: number, lightness: number): string {
  const s = saturation / 100;
  const l = lightness / 100;
  const k = (n: number): number => (n + hue / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number): number => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const hex = (value: number): string => Math.round(value * 255).toString(16).padStart(2, '0');
  return `#${hex(f(0))}${hex(f(8))}${hex(f(4))}`;
}

function rgbText(hex: string): string {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const value = Number.parseInt(full, 16);
  return `rgb(${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255})`;
}

function paintColor(picker: HTMLElement, hex: string): void {
  picker.querySelector<HTMLElement>('[data-cp-preview]')?.style.setProperty('background', hex);
  const hexOut = picker.querySelector<HTMLElement>('[data-cp-hex]');
  if (hexOut) hexOut.textContent = hex.toUpperCase();
  const rgbOut = picker.querySelector<HTMLElement>('[data-cp-rgb]');
  if (rgbOut) rgbOut.textContent = rgbText(hex);
  picker.querySelectorAll<HTMLElement>('.zak-swatch').forEach((swatch) => {
    const active = (swatch.dataset.color ?? '').toLowerCase() === hex.toLowerCase();
    swatch.classList.toggle('is-active', active);
    swatch.setAttribute('aria-checked', String(active));
  });
  const scope = calScope(picker);
  scope.querySelectorAll<HTMLInputElement>('[data-zak-picker-value]').forEach((input) => {
    input.value = hex.toUpperCase();
  });
  scope.querySelector<HTMLElement>('[data-zak-color-trigger]')?.style.setProperty('background', hex);
}

function buildColorPalette(picker: HTMLElement, colors: string[]): void {
  setHtml(
    picker,
    [
      '<div class="zak-colorpicker__preview" data-cp-preview></div>',
      `<div class="zak-color-swatches" data-zak-swatches role="radiogroup" aria-label="Palette">${colors
        .map(
          (color) =>
            `<button type="button" class="zak-swatch" style="background:${color}" data-color="${color}" role="radio" aria-checked="false" aria-label="${color.toUpperCase()}"></button>`,
        )
        .join('')}</div>`,
      '<input class="zak-hue" type="range" min="0" max="360" value="240" data-zak-hue aria-label="Hue"/>',
      '<div class="zak-colorpicker__codes"><span data-cp-hex></span><span data-cp-rgb></span><button class="zak-btn zak-btn--text zak-btn--sm" type="button" data-zak-color-copy aria-label="Copy hex value">Copy</button></div>',
    ].join('\n'),
  );
}

/* Ramp used when a palette container omits `data-zak-colors` — every swatch is a
   token colour, so the default surface stays on-theme. */
const DEFAULT_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#f43f5e', '#ef4444', '#f59e0b',
  '#eab308', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#64748b',
  '#94a3b8', '#0f172a', '#f8fafc',
];

function initColorPicker(picker: HTMLElement): void {
  /* `input[data-zak-colorpicker]` is minimal field markup handled by the
     field enhancer — never a palette container. */
  if (picker instanceof HTMLInputElement || colorReady.has(picker)) return;
  colorReady.add(picker);
  const colors = (picker.getAttribute('data-zak-colors') ?? '')
    .split(',')
    .map((color) => color.trim())
    .filter(Boolean);
  if (!colors.length) colors.push(...DEFAULT_COLORS);
  if (!picker.querySelector('[data-zak-swatches]')) buildColorPalette(picker, colors);
  const grid = picker.querySelector<HTMLElement>('[data-zak-swatches]');
  if (grid) {
    setHtml(
      grid,
      colors
        .map(
          (color) =>
            `<button type="button" class="zak-swatch" style="background:${color}" data-color="${color}" role="radio" aria-checked="false" aria-label="${color.toUpperCase()}"></button>`,
        )
        .join(''),
    );
  }
  const sink = calScope(picker).querySelector<HTMLInputElement>('[data-zak-picker-value]');
  const initial = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(sink?.value ?? '') ? (sink?.value ?? '') : colors[0] ?? '#6366f1';
  paintColor(picker, initial);
}

/* --------------------------------------------------------- delegation */

document.addEventListener('click', (event) => {
  const target = asElement(event.target);
  if (!target) return;

  /* Day cell */
  const day = target.closest<HTMLElement>('.zak-cal-day[data-date]');
  if (day) {
    const container = day.closest<HTMLElement>('[data-zak-calendar]');
    const state = container ? calStates.get(container) : undefined;
    const date = parseIso(day.dataset.date);
    if (container && state && date) selectCalDate(container, state, date);
    return;
  }

  /* Week row */
  const week = target.closest<HTMLElement>('.zak-cal-week[data-week]');
  if (week) {
    const found = calendarIn(week);
    const date = parseIso(week.dataset.week);
    if (found && date) {
      found.state.start = date;
      found.state.end = null;
      renderCalendar(found.container, found.state);
      syncCalSinks(found.container, found.state);
      commitChoice(found.container);
    }
    return;
  }

  /* Month / year cell */
  const monthCell = target.closest<HTMLElement>('.zak-cal-months [data-month]');
  if (monthCell) {
    const found = calendarIn(monthCell);
    if (found) {
      found.state.start = new Date(found.state.cursor.getFullYear(), Number(monthCell.dataset.month), 1);
      found.state.end = null;
      renderCalendar(found.container, found.state);
      syncCalSinks(found.container, found.state);
      commitChoice(found.container);
    }
    return;
  }
  const yearCell = target.closest<HTMLElement>('.zak-cal-years [data-year]');
  if (yearCell) {
    const found = calendarIn(yearCell);
    if (found) {
      found.state.start = new Date(Number(yearCell.dataset.year), 0, 1);
      found.state.end = null;
      renderCalendar(found.container, found.state);
      syncCalSinks(found.container, found.state);
      commitChoice(found.container);
    }
    return;
  }

  /* Panel navigation */
  const prev = target.closest<HTMLElement>('[data-zak-cal-prev]');
  const next = prev ? null : target.closest<HTMLElement>('[data-zak-cal-next]');
  if (prev || next) {
    const found = calendarIn(prev ?? next!);
    if (found) stepCalendar(found.container, found.state, prev ? -1 : 1);
    return;
  }

  /* Range presets */
  const preset = target.closest<HTMLElement>('[data-zak-range-preset]');
  if (preset) {
    applyPreset(preset, preset.dataset.zakRangePreset ?? 'today');
    return;
  }

  /* Open / close floating panels */
  const toggle = target.closest<HTMLElement>('[data-zak-picker-toggle]');
  if (toggle) {
    const field = toggle.closest<HTMLElement>('.zak-picker-field');
    const panel = field ? pickerPanel(field) : null;
    if (field && panel && !panel.hidden && wasRecentlyClosed(field)) return;
    if (field && panel) setPickerOpen(field, panel.hidden);
    return;
  }
  if (target instanceof HTMLInputElement && target.closest('[data-zak-picker-value]')) {
    const field = target.closest<HTMLElement>('.zak-picker-field');
    const panel = field ? pickerPanel(field) : null;
    if (field && panel && !panel.hidden) return;
    if (field && panel && !wasRecentlyClosed(field)) setPickerOpen(field, true);
    return;
  }

  /* Foot actions */
  const apply = target.closest<HTMLElement>('[data-zak-picker-apply]');
  if (apply) {
    closePickerField(apply);
    return;
  }
  const clear = target.closest<HTMLElement>('[data-zak-picker-clear]');
  if (clear) {
    const found = calendarIn(clear);
    if (found) clearCalendar(found.container, found.state);
    return;
  }

  /* Color swatches */
  const swatch = target.closest<HTMLElement>('.zak-swatch[data-color]');
  if (swatch) {
    const picker = swatch.closest<HTMLElement>('[data-zak-colorpicker]');
    if (picker) paintColor(picker, swatch.dataset.color ?? '#6366f1');
  }
});

document.addEventListener('keydown', (event) => {
  const target = asElement(event.target);
  if (!target) return;

  if (event.key === 'Escape') {
    if (closePickerField(target)) {
      calScope(target).querySelector<HTMLInputElement>('[data-zak-picker-value]')?.focus();
      event.preventDefault();
    }
    return;
  }

  const day = target.closest<HTMLElement>('.zak-cal-day[data-date]');
  const container = day?.closest<HTMLElement>('[data-zak-calendar]') ?? null;
  const state = container ? calStates.get(container) : undefined;
  const date = day ? parseIso(day.dataset.date) : null;
  if (!container || !state || !date || state.view !== 'month') return;

  let next: Date | null = null;
  switch (event.key) {
    case 'ArrowLeft': next = addDays(date, -1); break;
    case 'ArrowRight': next = addDays(date, 1); break;
    case 'ArrowUp': next = addDays(date, -7); break;
    case 'ArrowDown': next = addDays(date, 7); break;
    case 'Home': next = startOfWeek(date); break;
    case 'End': next = addDays(startOfWeek(date), 6); break;
    case 'PageUp': next = addMonthsClamped(date, event.shiftKey ? -12 : -1); break;
    case 'PageDown': next = addMonthsClamped(date, event.shiftKey ? 12 : 1); break;
    default: return;
  }
  event.preventDefault();
  state.roving = iso(next);
  ensureVisible(state, next);
  renderCalendar(container, state);
  container.querySelector<HTMLElement>(`.zak-cal-day[data-date="${state.roving}"]`)?.focus();
});

document.addEventListener('change', (event) => {
  const target = asElement(event.target);
  if (!(target instanceof HTMLSelectElement) || !target.closest('[data-zak-time]')) return;
  syncTimeSink(target.closest<HTMLElement>('[data-zak-time]')!);
});

document.addEventListener('input', (event) => {
  const target = asElement(event.target);
  if (!(target instanceof HTMLInputElement) || !target.hasAttribute('data-zak-hue')) return;
  const picker = target.closest<HTMLElement>('[data-zak-colorpicker]');
  if (picker) paintColor(picker, hslToHex(Number(target.value), 78, 55));
});

document.addEventListener('click', async (event) => {
  const target = asElement(event.target);
  const copy = target?.closest<HTMLElement>('[data-zak-color-copy]');
  if (!copy) return;
  const picker = copy.closest<HTMLElement>('[data-zak-colorpicker]');
  const hexOut = picker?.querySelector<HTMLElement>('[data-cp-hex]');
  const copied = await copyText(hexOut?.textContent ?? '');
  if (!copied) return;
  copy.setAttribute('aria-label', 'Copied!');
  window.setTimeout(() => copy.setAttribute('aria-label', 'Copy hex value'), 1200);
});

document.addEventListener('pointerdown', (event) => {
  const target = asElement(event.target);
  if (!target) return;
  document.querySelectorAll<HTMLElement>('.zak-picker-field').forEach((field) => {
    const panel = pickerPanel(field);
    if (panel && !panel.hidden && !field.contains(target)) setPickerOpen(field, false);
  });
});

/* ------------------------------------------------------------- bootstrap */

export function initPickers(scope: ParentNode): void {
  scope.querySelectorAll<HTMLElement>('[data-zak-calendar]').forEach(initCalendar);
  scope.querySelectorAll<HTMLElement>('[data-zak-time]').forEach(initTime);
  scope.querySelectorAll<HTMLElement>('[data-zak-colorpicker]').forEach(initColorPicker);
}

initPickers(document);
document.addEventListener('zak:refresh', () => initPickers(document));
