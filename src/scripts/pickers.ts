/**
 * ZAKUIKit — Picker field enhancer: turns a single input attribute into a
 * complete form field with a focus-opened floating panel.
 *
 * Page code is one line — the runtime generates the field, toggle button and
 * panel surface (calendar grid, time selects, palette, dual-month range):
 *
 *   <input type="text" class="zak-input" data-zak-datepicker>
 *
 * Supported kinds: data-zak-{colorpicker|datepicker|timepicker|datetimepicker|
 * daterangepicker|weekpicker|monthpicker|yearpicker}.
 *
 * Configuration attributes on the input:
 *   data-zak-picker-label / -placeholder  field chrome
 *   data-zak-cal-min / -max / -today      calendar bounds (passthrough)
 *   data-zak-time-step / -seconds / -size time surface options
 *   data-zak-colors                       palette list for the color picker
 *
 * A value seed in `value` pre-selects: ISO dates ("2026-06-18" or
 * "a..b"), times ("14:15") and hex colors pass straight through; formatted
 * text seeds start the surface at "today".
 *
 * The panel opens when the field receives focus and closes on Escape (focus
 * returns), on an outside pointer press, and on commit — range and date-time
 * surfaces stay open until Apply. All markup is built with DOM APIs (never
 * innerHTML) so attribute values cannot inject markup.
 */
import {
  initPickers,
  pickerPanel,
  setPickerOpen,
  wasRecentlyClosed,
} from './calendar';
import { svgIcon } from '../data/icons';
import { setHtml } from './dom';

/* ------------------------------------------------------------------ specs */

const KINDS = [
  'colorpicker',
  'datetimepicker',
  'daterangepicker',
  'datepicker',
  'monthpicker',
  'timepicker',
  'weekpicker',
  'yearpicker',
] as const;

type Kind = (typeof KINDS)[number];

const pickerKind = (input: HTMLInputElement): Kind | undefined =>
  KINDS.find((kind) => input.hasAttribute(`data-zak-${kind}`));

function icon(name: string, size = 15): SVGElement {
  const host = document.createElement('span');
  setHtml(host, svgIcon(name, 'zak-icon', size));
  const svg = host.firstElementChild;
  if (svg instanceof SVGElement) return svg;
  return document.createElementNS('http://www.w3.org/2000/svg', 'svg');
}

interface Spec {
  icon: 'calendar' | 'clock';
  width: string;
  panelWidth: string;
  placeholder: string;
  label: string;
  toggleLabel: string;
}

const SPECS: Record<Kind, Spec> = {
  colorpicker: { icon: 'calendar', width: '16rem', panelWidth: '', placeholder: 'Pick a color', label: 'Color', toggleLabel: 'Open palette' },
  datepicker: { icon: 'calendar', width: '19rem', panelWidth: '18rem', placeholder: 'Select a date', label: 'Date', toggleLabel: 'Open calendar' },
  timepicker: { icon: 'clock', width: '14rem', panelWidth: '', placeholder: 'Select a time', label: 'Time', toggleLabel: 'Open time picker' },
  datetimepicker: { icon: 'calendar', width: '20rem', panelWidth: '', placeholder: 'Select date & time', label: 'Date & time', toggleLabel: 'Open picker' },
  daterangepicker: { icon: 'calendar', width: '22rem', panelWidth: '', placeholder: 'Select a range', label: 'Date range', toggleLabel: 'Open range picker' },
  weekpicker: { icon: 'calendar', width: '19rem', panelWidth: '20rem', placeholder: 'Select a week', label: 'Week', toggleLabel: 'Open weeks' },
  monthpicker: { icon: 'calendar', width: '19rem', panelWidth: '19rem', placeholder: 'Select a month', label: 'Month', toggleLabel: 'Open months' },
  yearpicker: { icon: 'calendar', width: '19rem', panelWidth: '19rem', placeholder: 'Select a year', label: 'Year', toggleLabel: 'Open years' },
};

/* ------------------------------------------------------------- primitives */

function el(tag: string, cls?: string, attrs?: Record<string, string>): HTMLElement {
  const node = document.createElement(tag);
  if (cls) node.className = cls ?? '';
  if (attrs) {
    for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
  }
  return node;
}

const button = (cls: string): HTMLButtonElement => {
  const node = document.createElement('button');
  if (cls) node.className = cls;
  node.type = 'button';
  return node;
};

const navButton = (direction: 'prev' | 'next'): HTMLButtonElement => {
  const node = button('zak-btn zak-btn--text zak-btn--sm');
  node.setAttribute(`data-zak-cal-${direction}`, '');
  node.setAttribute('aria-label', direction === 'prev' ? 'Previous' : 'Next');
  node.append(icon(direction === 'prev' ? 'chevron-left' : 'chevron-right', 14));
  return node;
};

/** Calendar block; optionally with a header whose title the runtime updates. */
function calDiv(seed: string, attrs: Record<string, string>, withHeader: boolean): HTMLElement {
  const container = el('div', undefined, { 'data-zak-calendar': seed, ...attrs });
  if (!withHeader) return container;
  const wrap = el('div');
  const head = el('div', 'zak-picker-panel__head');
  const title = el('span', 'zak-picker-panel__title', { 'data-zak-cal-title': '' });
  const nav = el('span', 'zak-picker-panel__nav');
  nav.append(navButton('prev'), navButton('next'));
  head.append(title, nav);
  wrap.append(head, container);
  return wrap;
}

const textReadout = (): HTMLElement => {
  const node = el('span', 'zak-hint', { 'data-zak-picker-text': '' });
  return node;
};

function footRow(kind: Kind, readout: HTMLElement | null, opts?: { clear?: boolean; apply?: string }): HTMLElement {
  const foot = el('div', 'zak-picker-panel__foot');
  if (readout) foot.append(readout);
  const actions = el('span', 'zak-picker-field__actions');
  actions.style.cssText = 'display:inline-flex;gap:var(--zak-space-2)';
  if (opts?.clear) {
    const clear = button('zak-btn zak-btn--text zak-btn--sm');
    clear.setAttribute('data-zak-picker-clear', '');
    clear.textContent = 'Clear';
    actions.append(clear);
  }
  if (opts?.apply) {
    const apply = button('zak-btn zak-btn--filled zak-btn--sm');
    apply.setAttribute('data-zak-picker-apply', '');
    apply.setAttribute('data-zak-picker-commit', kind);
    apply.textContent = opts.apply;
    actions.append(apply);
  }
  if (actions.childNodes.length) foot.append(actions);
  return foot;
}

function timeDiv(seed: string, attrs: Record<string, string>, seconds: boolean): HTMLElement {
  const match = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(seed.trim());
  const container = el('div', undefined, { 'data-zak-time': match ? match[0] : '', ...attrs });
  if (seconds) container.setAttribute('data-zak-time-seconds', '');
  return container;
}

/* ---------------------------------------------------------------- panels */

function buildPanel(kind: Kind, input: HTMLInputElement, seed: string): HTMLElement {
  const pass: Record<string, string> = {};
  const today = input.getAttribute('data-zak-cal-today') ?? '';
  if (today) pass['data-zak-cal-today'] = today;
  for (const bound of ['min', 'max']) {
    const value = input.getAttribute(`data-zak-cal-${bound}`);
    if (value) pass[`data-zak-cal-${bound}`] = value;
  }
  const timeAttrs: Record<string, string> = {};
  const step = input.getAttribute('data-zak-time-step');
  if (step) timeAttrs['data-zak-time-step'] = step;
  if (input.dataset.zakTimeSize) timeAttrs['data-zak-time-size'] = input.dataset.zakTimeSize;
  const seconds = input.hasAttribute('data-zak-time-seconds');
  /* For combined surfaces the seed may be a date, a time or both halves. */
  const timeSeed = /\d{1,2}:\d{2}/.test(seed) ? /\d{1,2}:\d{2}(?::\d{2})?/.exec(seed)![0] : '';
  const dateSeed = /\d{4}-\d{2}-\d{2}/.test(seed) ? /\d{4}-\d{2}-\d{2}/.exec(seed)![0] : '';

  const panel = el('div', 'zak-picker-panel', { role: 'dialog', 'aria-label': input.getAttribute('data-zak-picker-label') ?? SPECS[kind].label });
  /* Generated panels start shut: the enhancer runs before any focus gesture, so
     an un-hidden panel would flash open over the page on first paint. */
  panel.hidden = true;
  if (SPECS[kind].panelWidth) panel.style.width = SPECS[kind].panelWidth;

  switch (kind) {
    case 'datepicker': {
      panel.append(calDiv(seed, pass, true));
      panel.append(footRow(kind, textReadout(), { clear: true, apply: 'Done' }));
      break;
    }
    case 'weekpicker':
    case 'monthpicker':
    case 'yearpicker': {
      const view = kind === 'weekpicker' ? 'weeks' : kind === 'monthpicker' ? 'months' : 'years';
      panel.append(calDiv(seed, { 'data-zak-cal-view': view, ...pass }, true));
      panel.append(footRow(kind, textReadout()));
      break;
    }
    case 'timepicker': {
      /* The sink the time runtime paints; Apply copies it into the field. */
      const timeSink = el('span', 'zak-hint', { 'data-zak-time-value': '' });
      panel.append(timeDiv(seed, timeAttrs, seconds));
      panel.append(footRow(kind, timeSink, { apply: 'Apply' }));
      break;
    }
    case 'datetimepicker': {
      const row = el('div', 'zak-picker-panel__row');
      /* Keep the panel open after picking a date so the time can be set too. */
      row.append(calDiv(dateSeed, { 'data-zak-cal-keep-open': '', ...pass }, true));
      const timeCol = el('div', 'zak-stack zak-stack--sm');
      const timeLabel = el('span', 'zak-label');
      timeLabel.textContent = 'Time';
      timeCol.append(timeLabel, timeDiv(timeSeed, timeAttrs, seconds));
      row.append(timeCol);
      panel.append(row);
      const readout = el('span', 'zak-hint');
      readout.append(textReadout(), document.createTextNode(' · '), el('span', undefined, { 'data-zak-time-value': '' }));
      panel.append(footRow(kind, readout, { apply: 'Schedule' }));
      break;
    }
    case 'daterangepicker': {
      const row = el('div', 'zak-picker-panel__row');
      const menu = el('div', 'zak-menu');
      menu.style.cssText = 'box-shadow:none;min-width:10rem';
      const menuLabel = el('span', 'zak-menu__label');
      menuLabel.textContent = 'Presets';
      menu.append(menuLabel);
      for (const [preset, label] of [
        ['today', 'Today'],
        ['last14', 'Last 14 days'],
        ['month', 'This month'],
        ['quarter', 'Last quarter'],
        ['ytd', 'Year to date'],
      ] as const) {
        const item = button('zak-menu__item');
        item.setAttribute('data-zak-range-preset', preset);
        item.textContent = label;
        menu.append(item);
      }
      row.append(menu);
      row.append(calDiv(dateSeed, { 'data-zak-cal-select': 'range', 'data-zak-cal-months': '2', ...pass }, true));
      panel.append(row);
      panel.append(footRow(kind, textReadout(), { clear: true, apply: 'Apply range' }));
      break;
    }
    case 'colorpicker': {
      const palette = el('div', 'zak-colorpicker', { 'data-zak-colorpicker': '' });
      const colors = input.getAttribute('data-zak-colors');
      if (colors) palette.setAttribute('data-zak-colors', colors);
      panel.append(palette);
      break;
    }
  }
  return panel;
}

/* ---------------------------------------------------------------- enhance */

const enhanced = new WeakSet<HTMLInputElement>();
let uid = 0;

function seedFor(kind: Kind, value: string): string {
  const raw = value.trim();
  if (kind === 'colorpicker') return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw) ? raw : '';
  if (kind === 'timepicker') return /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.test(raw) ? raw : '';
  if (kind === 'datetimepicker' && /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.test(raw)) return raw;
  return /^(\d{4}-\d{2}-\d{2})(\.\.\d{4}-\d{2}-\d{2})?$/.test(raw) ? raw : '';
}

function enhance(input: HTMLInputElement): void {
  if (enhanced.has(input)) return;
  const kind = pickerKind(input);
  if (!kind) return;

  enhanced.add(input);
  /* Already inside hand-built field markup (container demos): the calendar
     runtime owns open/close — focus wiring applies as-is. */
  if (input.closest('.zak-picker-field')) return;

  const spec = SPECS[kind];
  const id = input.id || `zak-${kind}-input-${(uid += 1)}`;
  /* Where the bare input lived: captured before the input is moved into the
     generated field, otherwise the swap would reparent an ancestor. */
  const host = input.parentElement;
  const following = input.nextSibling;
  input.id = id;
  input.readOnly = true;
  input.classList.add('zak-input');
  input.setAttribute('data-zak-picker-value', '');
  if (!input.hasAttribute('aria-haspopup')) input.setAttribute('aria-haspopup', 'dialog');
  if (!input.hasAttribute('aria-expanded')) input.setAttribute('aria-expanded', 'false');
  if (!input.placeholder) input.placeholder = input.getAttribute('data-zak-picker-placeholder') ?? spec.placeholder;

  const field = el('div', 'zak-picker-field zak-field--outlined');
  field.dataset.zakPickerKind = kind;
  field.style.width = spec.width;

  const fieldInner = el('div', 'zak-field');
  const label = el('label', 'zak-label', { for: id });
  label.textContent = input.getAttribute('data-zak-picker-label') ?? spec.label;
  fieldInner.append(label);

  const wrap = el('div', 'zak-input-wrap zak-input-wrap--suffix');
  wrap.append(input);
  const toggle = button('zak-input-wrap__btn');
  toggle.setAttribute('data-zak-picker-toggle', '');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', spec.toggleLabel);
  if (kind === 'colorpicker') {
    const dot = el('span', 'zak-color-trigger', { 'data-zak-color-trigger': '' });
    toggle.append(dot);
  } else {
    toggle.append(icon(spec.icon));
  }
  wrap.append(toggle);
  fieldInner.append(wrap);
  field.append(fieldInner);

  const anchor = el('div', 'zak-picker-anchor');
  anchor.append(buildPanel(kind, input, seedFor(kind, input.value)));
  field.append(anchor);

  /* Swap the field in where the bare input lived, then initialise surfaces. */
  if (host) host.insertBefore(field, following);
  else document.body.append(field);
  initPickers(field);
}

/* ----------------------------------------------------------------- commit */

function applyCommit(field: HTMLElement, kind: Kind): void {
  const input = field.querySelector<HTMLInputElement>('[data-zak-picker-value]');
  const panel = pickerPanel(field);
  if (!input || !panel) return;
  const readout = (node: HTMLElement | null | undefined): string => {
    if (!node) return '';
    return (node instanceof HTMLInputElement ? node.value : node.textContent ?? '').trim();
  };
  if (kind === 'timepicker') {
    const time = readout(panel.querySelector<HTMLElement>('[data-zak-time-value]'));
    if (time) input.value = time;
  } else if (kind === 'datetimepicker') {
    const date = readout(panel.querySelector<HTMLElement>('[data-zak-picker-text]'));
    const time = readout(panel.querySelector<HTMLElement>('[data-zak-time-value]'));
    if (date) input.value = time ? `${date} · ${time}` : date;
  } else if (kind === 'daterangepicker') {
    const text = readout(panel.querySelector<HTMLElement>('[data-zak-picker-text]'));
    if (text) input.value = text;
  }
  setPickerOpen(field, false);
  input.focus();
}

/* ----------------------------------------------------------------- events */

const sinkInput = (target: EventTarget | null): HTMLInputElement | null =>
  target instanceof HTMLInputElement && target.matches('[data-zak-picker-value]') ? target : null;

document.addEventListener('focusin', (event) => {
  const input = sinkInput(event.target);
  if (!input) return;
  const field = input.closest<HTMLElement>('.zak-picker-field');
  if (!field || !pickerPanel(field) || wasRecentlyClosed(field)) return;
  setPickerOpen(field, true);
});

document.addEventListener('focusout', (event) => {
  const input = sinkInput(event.target);
  if (!input) return;
  const field = input.closest<HTMLElement>('.zak-picker-field');
  if (!field) return;
  if (event.relatedTarget instanceof Element && field.contains(event.relatedTarget)) return;
  if (!pickerPanel(field) || wasRecentlyClosed(field)) return;
  /* Defer past click handlers so in-panel commits win over this close. */
  window.setTimeout(() => {
    if (document.activeElement instanceof Node && field.contains(document.activeElement)) return;
    const panel = pickerPanel(field);
    if (panel && !panel.hidden && !wasRecentlyClosed(field)) setPickerOpen(field, false);
  }, 80);
});

/* Apply buttons for the generated surfaces (delegated, commit-then-close). */
document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const apply = target?.closest<HTMLElement>('[data-zak-picker-commit]');
  if (!apply) return;
  const field = apply.closest<HTMLElement>('.zak-picker-field');
  const kind = field?.dataset.zakPickerKind as Kind | undefined;
  if (field && kind) {
    event.preventDefault();
    event.stopPropagation();
    applyCommit(field, kind);
  }
});

/* -------------------------------------------------------------- bootstrap */

function scan(scope: ParentNode): void {
  const selector = KINDS.map((kind) => `input[data-zak-${kind}]`).join(', ');
  const nodes: HTMLInputElement[] = [];
  if (scope instanceof HTMLInputElement && scope.matches(selector)) nodes.push(scope);
  if (scope instanceof Element || scope === document) {
    nodes.push(...Array.from(scope.querySelectorAll<HTMLInputElement>(selector)));
  }
  for (const input of nodes) enhance(input);
}

function boot(): void {
  scan(document);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

document.addEventListener('zak:refresh', (event) => {
  const root = (event as CustomEvent<{ root?: ParentNode }>).detail?.root;
  scan(root ?? document);
});

/* Catch dynamically injected markup (playground re-renders, JS inserts). */
let scanTimer = 0;
const observer = new MutationObserver(() => {
  window.clearTimeout(scanTimer);
  scanTimer = window.setTimeout(() => scan(document), 120);
});
observer.observe(document.body, { childList: true, subtree: true });

export { enhance as enhancePickerInput, scan as scanPickerInputs };
