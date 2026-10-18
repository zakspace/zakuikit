/**
 * ZAKUIKit — modular controller classes.
 *
 * Thin, dependency-free imperative wrappers over the declarative
 * data-attribute contracts the runtime already honours. Every class accepts
 * an element or a CSS selector, mutates exactly the same state the delegated
 * listeners use, and dispatches `zak:open` / `zak:close` / `zak:select`
 * CustomEvents on its element so app code can delegate against the API.
 *
 * `autoRegister()` scans a subtree for `[data-zak-component="<name>"]` hosts
 * and mounts the matching controller once — that is the public entry point
 * behind `ZakUI.init()` in the distributable bundle.
 */
import { snackbar, toast } from './behaviors';

export type ZakTarget = string | HTMLElement;

/** Resolve a target or throw with a component-qualified message. */
function resolve(target: ZakTarget, label: string): HTMLElement {
  const el =
    typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) throw new Error(`ZAKUIKit: ${label} target "${String(target)}" not found`);
  return el;
}

function emit(el: HTMLElement, name: string, detail: Record<string, unknown> = {}): void {
  el.dispatchEvent(new CustomEvent(`zak:${name}`, { detail, bubbles: true }));
}

/* ------------------------------------------------------------------ button */

export class ZakButton {
  readonly element: HTMLButtonElement;

  constructor(target: ZakTarget) {
    this.element = resolve(target, 'ZakButton') as HTMLButtonElement;
  }

  get isLoading(): boolean {
    return this.element.classList.contains('is-loading');
  }

  /** Spinner state — mirrors the documented `is-loading` + `aria-busy` pair. */
  loading(on = true): this {
    this.element.classList.toggle('is-loading', on);
    this.element.setAttribute('aria-busy', String(on));
    return this;
  }

  /** Async action wrapper: busy for the duration, restored on settle. */
  async withLoading(task: () => Promise<unknown> | unknown): Promise<unknown> {
    this.loading(true);
    this.element.disabled = true;
    try {
      return await task();
    } finally {
      this.loading(false);
      this.element.disabled = false;
    }
  }

  disabled(on = true): this {
    this.element.disabled = on;
    this.element.setAttribute('aria-disabled', String(on));
    return this;
  }
}

/* ------------------------------------------------------------- modal/drawer */

/** Native <dialog> controllers — Esc + focus containment come from the platform. */
export class ZakModal {
  readonly element: HTMLDialogElement;

  constructor(target: ZakTarget) {
    const el = resolve(target, 'ZakModal');
    if (!(el instanceof HTMLDialogElement)) {
      throw new Error('ZAKUIKit: ZakModal requires a native <dialog> element');
    }
    this.element = el;
  }

  get isOpen(): boolean {
    return this.element.open;
  }

  open(): this {
    if (!this.element.open) {
      this.element.showModal();
      emit(this.element, 'open');
    }
    return this;
  }

  close(): this {
    if (this.element.open) {
      this.element.close();
      emit(this.element, 'close');
    }
    return this;
  }

  toggle(): this {
    return this.isOpen ? this.close() : this.open();
  }

  /** Result of the native cancel event, so apps can veto dismissal. */
  onDismiss(handler: (event: Event) => void): this {
    this.element.addEventListener('cancel', handler);
    return this;
  }
}

export class ZakDrawer extends ZakModal {}

/* ---------------------------------------------------------------- dropdown */

export class ZakDropdown {
  readonly element: HTMLElement;

  constructor(target: ZakTarget) {
    this.element = resolve(target, 'ZakDropdown');
  }

  private get trigger(): HTMLElement | null {
    return this.element.querySelector<HTMLElement>('[data-zak-toggle="dropdown"]');
  }

  private get panel(): HTMLElement | null {
    return this.element.querySelector<HTMLElement>('.zak-dropdown__panel');
  }

  get isOpen(): boolean {
    return !this.panel?.hidden;
  }

  open(focusFirst = true): this {
    const panel = this.panel;
    if (!panel) return this;
    panel.hidden = false;
    this.trigger?.setAttribute('aria-expanded', 'true');
    this.element.classList.toggle('is-open', true);
    if (focusFirst) {
      panel
        .querySelector<HTMLElement>('input:not([type="hidden"]), select, textarea, button')
        ?.focus();
    }
    emit(this.element, 'open');
    return this;
  }

  close(returnFocus = true): this {
    const panel = this.panel;
    if (!panel) return this;
    panel.hidden = true;
    this.trigger?.setAttribute('aria-expanded', 'false');
    this.element.classList.toggle('is-open', false);
    if (returnFocus) this.trigger?.focus();
    emit(this.element, 'close');
    return this;
  }

  toggle(): this {
    return this.isOpen ? this.close() : this.open();
  }
}

/* -------------------------------------------------------------------- tabs */

export class ZakTabs {
  readonly element: HTMLElement;

  constructor(target: ZakTarget) {
    this.element = resolve(target, 'ZakTabs');
  }

  private get tabs(): HTMLElement[] {
    const list = this.element.matches('[role="tablist"]')
      ? this.element
      : this.element.querySelector('[role="tablist"]');
    return list ? Array.from(list.querySelectorAll<HTMLElement>('.zak-tab[role="tab"]')) : [];
  }

  get selected(): number {
    return this.tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
  }

  /** Activate a tab by index (or element) and announce it with zak:select. */
  select(indexOrTab: number | HTMLElement): this {
    const tabs = this.tabs;
    const tab =
      typeof indexOrTab === 'number' ? tabs[indexOrTab] : tabs.includes(indexOrTab) ? indexOrTab : null;
    if (!tab || tabs.length === 0) return this;
    for (const item of tabs) {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    }
    const root = this.element.closest('[data-zak-tabs]') ?? this.element;
    const target = tab.getAttribute('aria-controls');
    root.querySelectorAll<HTMLElement>('.zak-tab-panel').forEach((panel) => {
      panel.hidden = panel.id !== target;
    });
    emit(this.element, 'select', { index: tabs.indexOf(tab), id: target ?? '' });
    return this;
  }

  selectAndFocus(index: number): this {
    const tab = this.tabs[index];
    tab?.focus();
    return this.select(tab ?? index);
  }
}

/* --------------------------------------------------------------- accordion */

export class ZakAccordion {
  readonly element: HTMLElement;

  constructor(target: ZakTarget) {
    this.element = resolve(target, 'ZakAccordion');
  }

  private get triggers(): HTMLElement[] {
    return Array.from(this.element.querySelectorAll<HTMLElement>('.zak-accordion__trigger'));
  }

  private panelFor(trigger: HTMLElement): HTMLElement | null {
    const id = trigger.getAttribute('aria-controls');
    return id ? document.getElementById(id) : null;
  }

  /** Open item `index`, closing siblings first when the set is `single`. */
  open(index: number): this {
    const triggers = this.triggers;
    const trigger = triggers[index];
    if (!trigger) return this;
    if (this.element.dataset.zakAccordion === 'single') this.closeAll(index);
    const panel = this.panelFor(trigger);
    if (panel && trigger.getAttribute('aria-expanded') !== 'true') {
      trigger.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
      emit(this.element, 'open', { index });
    }
    return this;
  }

  close(index: number): this {
    const trigger = this.triggers[index];
    const panel = trigger ? this.panelFor(trigger) : null;
    if (trigger && panel && trigger.getAttribute('aria-expanded') === 'true') {
      trigger.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
      emit(this.element, 'close', { index });
    }
    return this;
  }

  toggle(index: number): this {
    const trigger = this.triggers[index];
    return trigger && trigger.getAttribute('aria-expanded') === 'true'
      ? this.close(index)
      : this.open(index);
  }

  private closeAll(except: number): void {
    this.triggers.forEach((trigger, i) => {
      if (i !== except) this.close(i);
    });
  }
}

/* ---------------------------------------------------------------- collapse */

export class ZakCollapse {
  readonly trigger: HTMLElement;
  readonly element: HTMLElement;

  constructor(target: ZakTarget) {
    // Accepts the panel itself, or the trigger that owns it via aria-controls.
    const el = resolve(target, 'ZakCollapse');
    if (el.classList.contains('zak-collapse')) {
      this.element = el;
      const found =
        document.querySelector<HTMLElement>(`[data-zak-target="#${el.id}"]`) ??
        document.querySelector<HTMLElement>(`[aria-controls="${el.id}"]`);
      this.trigger = found ?? el;
    } else {
      this.trigger = el;
      const id = el.getAttribute('aria-controls') ?? '';
      const panel = document.getElementById(id);
      if (!panel) throw new Error(`ZAKUIKit: ZakCollapse panel #${id} not found`);
      this.element = panel;
    }
  }

  get isOpen(): boolean {
    return this.element.classList.contains('is-open');
  }

  open(on = true): this {
    if (on) this.element.hidden = false;
    this.element.classList.toggle('is-open', on);
    if (!on) {
      // Collapse the grid row first; [hidden] lands when the transition settles.
      const panel = this.element;
      const settle = (): void => {
        if (!panel.classList.contains('is-open')) panel.hidden = true;
      };
      const onEnd = (event: TransitionEvent): void => {
        if (event.target !== panel) return;
        panel.removeEventListener('transitionend', onEnd);
        settle();
      };
      panel.addEventListener('transitionend', onEnd);
      window.setTimeout(settle, 400);
    }
    if (this.trigger !== this.element) this.trigger.setAttribute('aria-expanded', String(on));
    emit(this.element, on ? 'open' : 'close');
    return this;
  }

  toggle(): this {
    return this.open(!this.isOpen);
  }
}

/* ----------------------------------------------------------------- tooltip */

export class ZakTooltip {
  readonly element: HTMLElement;

  constructor(target: ZakTarget) {
    this.element = resolve(target, 'ZakTooltip');
    const bubble = this.element.querySelector<HTMLElement>('.zak-tooltip__bubble');
    if (bubble && !bubble.getAttribute('role')) bubble.setAttribute('role', 'tooltip');
  }

  show(): this {
    this.element.classList.add('is-open');
    return this;
  }

  hide(): this {
    this.element.classList.remove('is-open');
    return this;
  }

  toggle(): this {
    return this.element.classList.contains('is-open') ? this.hide() : this.show();
  }
}

/* ------------------------------------------------------------------- toast */

export class ZakToast {
  /** Fire a toast through the shared live region (polite, or assertive for danger). */
  static show(
    title: string,
    tone: 'default' | 'info' | 'success' | 'warning' | 'danger' = 'default',
    options?: { duration?: number; desc?: string },
  ): void {
    toast(title, tone, options);
  }
}

/* -------------------------------------------------------------- snackbar */

export class ZakSnackbar {
  /** Show a bottom-centred message with one optional action. */
  static show(message: string, options?: { actionLabel?: string; onAction?: () => void; duration?: number }): void {
    snackbar(message, options);
  }
}

/* ------------------------------------------------------ auto-registration */

type ControllerCtor = new (el: HTMLElement) => unknown;

const registry = new Map<string, ControllerCtor>();
const mounted = new WeakMap<Element, unknown>();

/** Register a controller under a `data-zak-component` name. */
export function register(name: string, ctor: ControllerCtor): void {
  registry.set(name, ctor);
}

/** Instantiate every registered component inside `root`, skipping mounted hosts. */
export function autoRegister(root: ParentNode = document): unknown[] {
  const created: unknown[] = [];
  registry.forEach((ctor, name) => {
    const selector = `[data-zak-component="${name}"]`;
    const hosts =
      root instanceof HTMLElement && root.matches(selector)
        ? [root]
        : Array.from(root.querySelectorAll<HTMLElement>(selector));
    for (const host of hosts) {
      if (mounted.has(host)) continue;
      const instance = new ctor(host);
      mounted.set(host, instance);
      created.push(instance);
    }
  });
  return created;
}

/* Built-in registrations — modal/drawer take their dialog host, dropdown its
   wrapper, tabs/accordion their container. */
register('modal', ZakModal);
register('drawer', ZakDrawer);
register('dropdown', ZakDropdown);
register('tabs', ZakTabs);
register('accordion', ZakAccordion);
register('collapse', ZakCollapse);
register('tooltip', ZakTooltip);
register('button', ZakButton);

/** Library entry: mount every `[data-zak-component]` controller in `root`. Idempotent. */
export function init(root: ParentNode = document): unknown[] {
  return autoRegister(root);
}
