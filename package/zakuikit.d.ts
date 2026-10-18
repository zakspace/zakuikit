/**
 * ZAKUIKit v2.2 — public API typings.
 * Hand-maintained; mirrors src/scripts/library.ts + controllers.ts.
 */

export type ZakTarget = string | HTMLElement;

export type ZakToastTone = 'default' | 'info' | 'success' | 'warning' | 'danger';

export interface ZakToastOptions {
  /** Auto-hide delay in ms. 0 pins the toast until dismissed. Default 5000. */
  duration?: number;
  /** Secondary line rendered under the title. */
  desc?: string;
}

/** Fire a toast into the shared aria-live region. */
export declare function toast(
  title: string,
  tone?: ZakToastTone,
  options?: ZakToastOptions,
): void;

export interface ZakSnackbarOptions {
  /** Trailing action label; renders a link button inside the snackbar. */
  actionLabel?: string;
  /** Runs when the action is clicked; without it `zak:snackbar-action` is emitted. */
  onAction?: () => void;
  /** Auto-dismiss delay in ms. 0 keeps it until the action is used. Default 4000. */
  duration?: number;
}

/** Show a bottom-centred snackbar in a live region created on first call. */
export declare function snackbar(message: string, options?: ZakSnackbarOptions): void;

/* ------------------------------------------------------------------ charts */

export type ZakChartType = 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'sparkline';

export interface ZakChartDataset {
  label?: string;
  data: number[];
  /** A token/hex, or one entry per point for bar and pie series. */
  color?: string | string[];
}

export interface ZakChartOptions {
  width?: number;
  height?: number;
  grid?: boolean;
  points?: boolean;
  legend?: boolean;
  /** Big centre figure for pie/donut charts. */
  center?: string;
  centerSub?: string;
  thickness?: number;
  size?: number;
}

/** Chart.js-shaped configuration object. */
export interface ZakChartConfig {
  type?: ZakChartType;
  data?: { labels?: string[]; datasets?: ZakChartDataset[] };
  options?: ZakChartOptions;
}

export interface ZakChartHandle {
  el: HTMLElement;
  readonly config: ZakChartConfig;
  /** Re-render, optionally replacing the config. */
  update(config?: ZakChartConfig): void;
  /** Remove the SVG from the host and forget the instance. */
  destroy(): void;
}

/** Render a config to an SVG markup string without touching the DOM. */
export declare function renderChart(config: ZakChartConfig): string;

/** Mount a config onto a host element (or selector). */
export declare function createChart(
  target: ZakTarget,
  config?: ZakChartConfig,
): ZakChartHandle;

/** Mount every `[data-zak-chart]` host found in `scope` (default: document). */
export declare function scanCharts(scope?: ParentNode): void;

export declare const ZakChart: {
  create: typeof createChart;
  render: typeof renderChart;
  scan: typeof scanCharts;
};

export declare class ZakButton {
  readonly element: HTMLButtonElement;
  constructor(target: ZakTarget);
  readonly isLoading: boolean;
  loading(on?: boolean): this;
  withLoading(task: () => unknown | Promise<unknown>): Promise<unknown>;
  disabled(on?: boolean): this;
}

export declare class ZakModal {
  readonly element: HTMLDialogElement;
  constructor(target: ZakTarget);
  readonly isOpen: boolean;
  open(): this;
  close(): this;
  toggle(): this;
  onDismiss(handler: (event: Event) => void): this;
}

export declare class ZakDrawer extends ZakModal {}

export declare class ZakDropdown {
  readonly element: HTMLElement;
  constructor(target: ZakTarget);
  readonly isOpen: boolean;
  open(focusFirst?: boolean): this;
  close(returnFocus?: boolean): this;
  toggle(): this;
}

export declare class ZakTabs {
  readonly element: HTMLElement;
  constructor(target: ZakTarget);
  readonly selected: number;
  select(indexOrTab: number | HTMLElement): this;
  selectAndFocus(index: number): this;
}

export declare class ZakAccordion {
  readonly element: HTMLElement;
  constructor(target: ZakTarget);
  open(index: number): this;
  close(index: number): this;
  toggle(index: number): this;
}

export declare class ZakCollapse {
  readonly element: HTMLElement;
  readonly trigger: HTMLElement;
  constructor(target: ZakTarget);
  readonly isOpen: boolean;
  open(on?: boolean): this;
  toggle(): this;
}

export declare class ZakTooltip {
  readonly element: HTMLElement;
  constructor(target: ZakTarget);
  show(): this;
  hide(): this;
  toggle(): this;
}

export declare class ZakToast {
  static show(title: string, tone?: ZakToastTone, options?: ZakToastOptions): void;
}

export declare class ZakSnackbar {
  static show(message: string, options?: ZakSnackbarOptions): void;
}

export interface ZakThemeAPI {
  set(mode: 'light' | 'dark' | 'system'): void;
  get(): 'light' | 'dark';
  toggle(): void;
}

export interface ZakModalFacade {
  open(target: string | HTMLDialogElement): ZakModal;
  close(target: string | HTMLDialogElement): void;
}

export type ZakComponentName =
  | 'modal'
  | 'drawer'
  | 'dropdown'
  | 'tabs'
  | 'accordion'
  | 'collapse'
  | 'tooltip'
  | 'button';

/** Options accepted by `ZakUI.chart(...)` / `ZakChart.create(...)`. */
export type ZakChartAPI = typeof ZakChart;

/** Register a controller under a `data-zak-component` name. */
export declare function register(
  name: string,
  ctor: new (el: HTMLElement) => unknown,
): void;

/** Mount every registered controller found in `root`. Idempotent per element. */
export declare function autoRegister(root?: ParentNode): unknown[];

/** Library entry: mounts `[data-zak-component]` hosts across `root`. */
export declare function init(root?: ParentNode): unknown[];

/** The global surface of the IIFE/CDN bundle (`window.ZakUI`). */
declare global {
  interface Window {
    ZakUI: {
      toast: typeof toast;
      snackbar: typeof snackbar;
      chart: typeof createChart;
      ZakChart: ZakChartAPI;
      init: typeof init;
      autoRegister: typeof autoRegister;
      register: typeof register;
      theme: ZakThemeAPI;
      modal: ZakModalFacade;
      ZakButton: typeof ZakButton;
      ZakModal: typeof ZakModal;
      ZakDrawer: typeof ZakDrawer;
      ZakDropdown: typeof ZakDropdown;
      ZakTabs: typeof ZakTabs;
      ZakAccordion: typeof ZakAccordion;
      ZakCollapse: typeof ZakCollapse;
      ZakTooltip: typeof ZakTooltip;
      ZakToast: typeof ZakToast;
      ZakSnackbar: typeof ZakSnackbar;
    };
    /** Chart facade exposed by the docs/standalone bundle (`window.ZakChart`). */
    ZakChart: ZakChartAPI;
  }
}